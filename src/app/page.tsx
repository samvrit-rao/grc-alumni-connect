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
      {/* Beta banner — full width */}
      <div className="bg-[#FFF9C4] border-b border-[#F9A825]/30">
        <div className="max-w-[600px] mx-auto px-4 py-2.5 text-center">
          <p className="text-xs text-[#5D4037]">
            <strong>Beta Preview</strong> — This directory is currently in beta with Columbia Alumni. It will be populated with verified alumni from our full membership database.
          </p>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-5 space-y-3">
        {/* Profile card */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-[#004182] to-[#0A66C2]" />
          <div className="px-5 pb-4 -mt-8">
            <div className="h-16 w-16 rounded-full border-[3px] border-white bg-[#0A66C2] flex items-center justify-center">
              <span className="text-white font-bold text-sm">GRC</span>
            </div>
            <h2 className="text-lg font-semibold text-[#191919] mt-2">GRC Alumni Connect</h2>
            <p className="text-xs text-[#666]">Columbia Global Research & Consulting Group</p>
            <div className="flex gap-6 mt-3 pt-3 border-t border-[#E0E0E0]">
              <div className="text-xs">
                <span className="text-[#666]">Connections </span>
                <span className="text-[#0A66C2] font-semibold">{totalAlumni}</span>
              </div>
              <div className="text-xs">
                <span className="text-[#666]">Firms </span>
                <span className="text-[#0A66C2] font-semibold">{firmCounts.length}</span>
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
