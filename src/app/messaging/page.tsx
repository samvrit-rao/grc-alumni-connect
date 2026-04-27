import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { MessageThread } from "@/components/message-thread";

export default async function MessagingPage() {
  const alumni = await prisma.alumni.findMany({
    where: { publishedToDirectory: true },
    orderBy: { name: "asc" },
    take: 20,
  });

  const alumniWithFirms = alumni.map((a) => ({
    ...a,
    firmName: FIRMS.find((f) => f.slug === a.currentFirm)?.shortName || a.currentFirm,
  }));

  return (
    <div className="mx-auto max-w-[1128px] px-4 py-6">
      <div className="bg-white rounded-lg border border-li-border overflow-hidden" style={{ height: "calc(100vh - 100px)" }}>
        <MessageThread alumni={alumniWithFirms} />
      </div>
    </div>
  );
}
