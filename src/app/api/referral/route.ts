import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = crypto.randomBytes(6).toString("hex");

  const link = await prisma.referralLink.create({
    data: {
      code,
      createdBy: session.user.id,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const referralUrl = `${baseUrl}/onboarding?ref=${link.code}`;

  return NextResponse.json({ referralUrl, code: link.code });
}
