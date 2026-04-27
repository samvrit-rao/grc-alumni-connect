import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const alumni = await prisma.alumni.findUnique({ where: { id: params.id } });
  if (!alumni) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.alumni.update({
    where: { id: params.id },
    data: {
      publishedToDirectory: false,
      willingToChat: false,
    },
  });

  return NextResponse.json({ success: true });
}
