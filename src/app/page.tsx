import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import Link from "next/link";
import Image from "next/image";
import { LogoMarquee } from "@/components/logo-marquee";

const FEATURED_FIRMS = [
  { slug: "mckinsey", logo: "/logos/mckinsey.png", name: "McKinsey & Company" },
  { slug: "bcg", logo: "/logos/bcg.png", name: "Boston Consulting Group" },
  { slug: "bain", logo: "/logos/bain.png", name: "Bain & Company" },
  { slug: "oliver-wyman", logo: "/logos/oliver-wyman.jpg", name: "Oliver Wyman" },
];

async function getDashboardData() {
  const firmCounts = await prisma.alumni.groupBy({
    by: ["currentFirm"],
    where: { publishedToDirectory: true },
    _count: true,
  });
  const recentAlumni = await prisma.alumni.findMany({
    where: { publishedToDirectory: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const totalAlumni = await prisma.alumni.count({ where: { publishedToDirectory: true } });
  return { firmCounts, recentAlumni, totalAlumni };
}

export default async function HomePage() {
  const { firmCounts, recentAlumni, totalAlumni } = await getDashboardData();

  return (
    <>
      {/* Beta banner */}
      <div className="bg-[#FFF9C4] border-b border-[#F9A825]/30">
        <div className="max-w-[600px] mx-auto px-4 py-2.5 text-center">
          <p className="text-xs text-[#5D4037]">
            <strong>Beta Preview</strong> - Currently running on general Columbia alumni. Infrastructure is ready to be pointed at GRC&apos;s actual alumni base.
          </p>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-5 space-y-3">
        {/* What is this tool */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
          <h2 className="text-lg font-semibold text-[#191919] mb-3">GRC Alumni Network Tool</h2>
          <p className="text-sm text-[#666] leading-relaxed mb-4">
            A LinkedIn-style alumni directory built for GRC. Currently a beta running on general Columbia alumni to demonstrate the platform.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-[#0A66C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#191919]">Search by firm, role, and grad year</div>
                <div className="text-xs text-[#666]">Finding an alum at Bain or McKinsey takes thirty seconds, not three days of digging through old Slack threads</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-[#0A66C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#191919]">AI-powered coffee chat outreach</div>
                <div className="text-xs text-[#666]">Auto-generates personalized messages based on their background and your interests. Copy and send via LinkedIn in one click</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-[#0A66C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#191919]">{totalAlumni} alumni across {firmCounts.length} top consulting firms</div>
                <div className="text-xs text-[#666]">McKinsey, BCG, Bain, Oliver Wyman and more. Profiles include title, office location, and direct LinkedIn links</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-[#0A66C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#191919]">AI background summaries</div>
                <div className="text-xs text-[#666]">Each profile includes an auto-generated summary of their experience and expertise so you know who to reach out to</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#057642]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-[#057642]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#191919]">Ready for GRC</div>
                <div className="text-xs text-[#666]">Infrastructure is built. Just needs to be pointed at GRC&apos;s actual alumni base to go live for the whole club</div>
              </div>
            </div>
          </div>
        </div>

        {/* Firm tiles */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
          <h3 className="text-base font-semibold text-[#191919] mb-3">Alumni by Firm</h3>
          <div className="grid grid-cols-4 gap-2">
            {FEATURED_FIRMS.map((firm) => {
              const count = firmCounts.find((fc) => fc.currentFirm === firm.slug)?._count ?? 0;
              return (
                <Link key={firm.slug} href={`/alumni?firm=${firm.slug}`}>
                  <div className="border border-[#E0E0E0] rounded-lg py-3 px-2 hover:shadow-md hover:border-[#0A66C2]/40 transition-all cursor-pointer text-center group">
                    <div className="h-7 flex items-center justify-center mb-2">
                      <Image src={firm.logo} alt={firm.name} width={70} height={24} className="max-h-6 w-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-lg font-bold text-[#191919]">{count}</div>
                    <div className="text-[10px] text-[#666]">alumni</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logo marquee */}
        <LogoMarquee />

        {/* Feed posts */}
        {recentAlumni.map((a) => {
          const firm = FIRMS.find((f) => f.slug === a.currentFirm);
          return (
            <div key={a.id} className="bg-white rounded-lg border border-[#E0E0E0]">
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-[#0A66C2]">GRC</span>
                  </div>
                  <span className="text-xs text-[#666]">GRC Alumni Connect</span>
                  <span className="text-xs text-[#999]">· Just now</span>
                </div>
                <p className="text-sm text-[#666]">
                  <strong className="text-[#191919]">{a.name}</strong> is now in the alumni directory
                </p>
              </div>
              <Link href={`/alumni/${a.id}`}>
                <div className="border-t border-[#E0E0E0] px-4 py-3 flex items-center gap-3 hover:bg-[#F4F2EE] transition-colors cursor-pointer">
                  <div className="h-11 w-11 rounded-full bg-[#E8E8E8] flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-[#666]">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#191919]">{a.name}</div>
                    <div className="text-xs text-[#666] truncate">
                      {a.currentTitle || "Alumni"} at {firm?.shortName || a.currentFirm}
                    </div>
                    {a.office && <div className="text-xs text-[#999]">{a.office}</div>}
                  </div>
                  <span className="shrink-0 px-3 py-1 rounded-full border border-[#0A66C2] text-[#0A66C2] text-xs font-semibold hover:bg-[#0A66C2]/5">
                    View
                  </span>
                </div>
              </Link>
            </div>
          );
        })}

        {/* View all link */}
        <div className="text-center py-2">
          <Link href="/alumni" className="text-sm text-[#0A66C2] font-semibold hover:underline">
            View all {totalAlumni} alumni →
          </Link>
        </div>
      </div>
    </>
  );
}
