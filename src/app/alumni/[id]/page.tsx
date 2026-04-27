import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CoffeeChatSection } from "@/components/coffee-chat-section";
import Link from "next/link";

export default async function AlumniDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const alumni = await prisma.alumni.findUnique({ where: { id: params.id } });

  if (!alumni || !alumni.publishedToDirectory) {
    notFound();
  }

  const firm = FIRMS.find((f) => f.slug === alumni.currentFirm);

  // Build AI summary from available data
  const summaryParts: string[] = [];
  summaryParts.push(`${alumni.name} is currently ${alumni.currentTitle ? `a ${alumni.currentTitle}` : "working"} at ${firm?.name || alumni.currentFirm}.`);
  if (alumni.office) summaryParts.push(`Based in ${alumni.office}.`);
  if (alumni.practiceArea) summaryParts.push(`Specializes in ${alumni.practiceArea}.`);
  if (alumni.school && alumni.gradYear) summaryParts.push(`Columbia ${alumni.school} '${alumni.gradYear.toString().slice(-2)}.`);
  if (alumni.grcInvolvement) summaryParts.push(`GRC involvement: ${alumni.grcInvolvement}.`);
  const aiSummary = summaryParts.join(" ");

  return (
    <div>
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/alumni" className="text-sm text-teal/70 hover:text-teal transition-colors">
            ← Back to directory
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Card */}
        <Card className="border-slate-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-semibold text-navy">
                  {alumni.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-navy">{alumni.name}</h1>
                <p className="text-[#595959] mt-0.5">
                  {alumni.currentTitle} at {firm?.name || alumni.currentFirm}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <div className="text-[10px] text-teal uppercase tracking-wider font-semibold">Firm</div>
                <div className="text-sm text-navy mt-1 font-medium">{firm?.name || alumni.currentFirm}</div>
              </div>
              {alumni.office && (
                <div>
                  <div className="text-[10px] text-teal uppercase tracking-wider font-semibold">Location</div>
                  <div className="text-sm text-navy mt-1">{alumni.office}</div>
                </div>
              )}
              {alumni.practiceArea && (
                <div>
                  <div className="text-[10px] text-teal uppercase tracking-wider font-semibold">Practice Area</div>
                  <div className="text-sm text-navy mt-1">{alumni.practiceArea}</div>
                </div>
              )}
              {alumni.gradYear && (
                <div>
                  <div className="text-[10px] text-teal uppercase tracking-wider font-semibold">Education</div>
                  <div className="text-sm text-navy mt-1">Columbia {alumni.school} &apos;{alumni.gradYear?.toString().slice(-2)}</div>
                </div>
              )}
            </div>

            {alumni.linkedinUrl && (
              <>
                <Separator className="my-6" />
                <div className="flex items-center gap-4">
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Connect on LinkedIn
                  </a>
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-teal hover:underline font-medium"
                  >
                    View Profile →
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="border-teal/30 bg-teal/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-sm font-display font-bold text-navy">AI Summary</h3>
            </div>
            <p className="text-sm text-[#595959] leading-relaxed">{aiSummary}</p>
          </CardContent>
        </Card>

        {/* Coffee Chat Message Generator */}
        <CoffeeChatSection
          alumniName={alumni.name}
          alumniTitle={alumni.currentTitle || ""}
          firmName={firm?.name || alumni.currentFirm}
          office={alumni.office || ""}
        />
      </div>
    </div>
  );
}
