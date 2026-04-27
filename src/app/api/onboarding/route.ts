import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name,
    columbiaEmail,
    linkedinUrl,
    gradYear,
    school,
    currentFirm,
    currentTitle,
    office,
    practiceArea,
    grcInvolvement,
    willingToChat,
    referralCode,
  } = body;

  // Validate
  if (!name || !columbiaEmail || !linkedinUrl || !currentFirm) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!columbiaEmail.endsWith("@columbia.edu")) {
    return NextResponse.json({ error: "Must use a @columbia.edu email" }, { status: 400 });
  }

  // Check for duplicate LinkedIn URL
  const existing = await prisma.alumni.findUnique({
    where: { linkedinUrl },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This LinkedIn profile is already in the directory" },
      { status: 409 }
    );
  }

  // Find referrer if referral code provided
  let referredBy: string | undefined;
  if (referralCode) {
    const link = await prisma.referralLink.findUnique({
      where: { code: referralCode },
    });
    if (link) {
      referredBy = link.createdBy;
      await prisma.referralLink.update({
        where: { id: link.id },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  await prisma.alumni.create({
    data: {
      name,
      personalEmail: columbiaEmail,
      linkedinUrl,
      gradYear: gradYear ? parseInt(gradYear) : null,
      school: school || null,
      currentFirm,
      currentTitle: currentTitle || null,
      office: office || null,
      practiceArea: practiceArea || null,
      grcInvolvement: grcInvolvement || null,
      willingToChat: willingToChat ?? true,
      source: referralCode ? "REFERRAL" : "SELF_ENROLLED",
      verifiedByAlumni: true,
      publishedToDirectory: true,
      claimedAt: new Date(),
      referredBy: referredBy || null,
    },
  });

  return NextResponse.json({ success: true });
}
