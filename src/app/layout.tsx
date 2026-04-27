import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "GRC Alumni Connect",
  description: "Columbia Global Research & Consulting — Alumni Directory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
