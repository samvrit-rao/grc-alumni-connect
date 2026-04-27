import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyClaimToken } from "@/lib/claim-token";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { token, name, gradYear, school, currentTitle, office, practiceArea, grcInvolvement, willingToChat, columbiEmail } = body;

  // Verify token
  const payload = verifyClaimToken(token);
  if (!payload || payload.alumniId !== params.id) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  // Verify Columbia email
  if (!columbiEmail?.endsWith("@columbia.edu")) {
    return NextResponse.json({ error: "Must use a @columbia.edu email" }, { status: 400 });
  }

  const alumni = await prisma.alumni.findUnique({ where: { id: params.id } });
  if (!alumni) {
    return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
  }

  if (alumni.verifiedByAlumni) {
    return NextResponse.json({ error: "Already verified" }, { status: 400 });
  }

  // Update profile
  await prisma.alumni.update({
    where: { id: params.id },
    data: {
      name: name || alumni.name,
      gradYear: gradYear ? parseInt(gradYear) : alumni.gradYear,
      school: school || alumni.school,
      currentTitle: currentTitle || alumni.currentTitle,
      office: office || alumni.office,
      practiceArea: practiceArea || alumni.practiceArea,
      grcInvolvement: grcInvolvement || alumni.grcInvolvement,
      personalEmail: columbiEmail,
      willingToChat: willingToChat ?? false,
      verifiedByAlumni: true,
      publishedToDirectory: true,
      claimedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
