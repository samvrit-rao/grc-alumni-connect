import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dev-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dev-client-secret",
    }),
    // Dev-only credentials provider for local testing
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            name: "Dev Login",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "admin@columbia.edu" },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;
              const user = await prisma.user.findUnique({
                where: { email: credentials.email },
              });
              if (user) return { id: user.id, name: user.name, email: user.email, role: user.role };
              // Auto-create dev users with columbia.edu emails
              if (credentials.email.endsWith("@columbia.edu")) {
                const newUser = await prisma.user.create({
                  data: { email: credentials.email, name: credentials.email.split("@")[0], role: "MEMBER" },
                });
                return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
              }
              return null;
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: process.env.NODE_ENV === "development" ? "jwt" : "database",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email ?? "";
        if (!email.endsWith("@columbia.edu")) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "MEMBER";
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      } else if (user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: string }).role ?? "MEMBER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
