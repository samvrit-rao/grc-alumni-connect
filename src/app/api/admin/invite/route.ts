import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateClaimToken } from "@/lib/claim-token";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { alumniId } = await req.json();

  const alumni = await prisma.alumni.findUnique({ where: { id: alumniId } });
  if (!alumni) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const token = generateClaimToken(alumniId);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store token on the alumni record
  await prisma.alumni.update({
    where: { id: alumniId },
    data: {
      claimToken: token,
      claimTokenExpiresAt: expiresAt,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const claimUrl = `${baseUrl}/alumni/${alumniId}/claim?token=${token}`;

  // TODO: Send email via Resend/Postmark when configured
  // For now, return the URL for manual sending

  return NextResponse.json({ claimUrl });
}
