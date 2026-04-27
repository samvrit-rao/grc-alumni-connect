import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { alumniId, message } = await req.json();

  if (!alumniId || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify alumni exists and is published
  const alumni = await prisma.alumni.findUnique({ where: { id: alumniId } });
  if (!alumni || !alumni.publishedToDirectory) {
    return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
  }

  const outreach = await prisma.outreachRequest.create({
    data: {
      requesterId: session.user.id,
      alumniId,
      message: message.trim(),
      status: "DRAFTED",
    },
  });

  // TODO: Send email via Resend/Postmark when configured
  // For now, just mark as DRAFTED

  return NextResponse.json({ id: outreach.id, status: "DRAFTED" });
}
