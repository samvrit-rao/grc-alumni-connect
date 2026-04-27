import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

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
    take: 8,
  });

  return { firmCounts, recentAlumni };
}

export default async function DashboardPage() {
  const { firmCounts, recentAlumni } = await getDashboardData();

  const totalPublished = firmCounts.reduce((sum, fc) => sum + fc._count, 0);

  // Only show firms that have alumni
  const activeFirms = FIRMS.filter((firm) =>
    firmCounts.some((fc) => fc.currentFirm === firm.slug && fc._count > 0)
  );

  return (
    <div>
      {/* ── Beta Banner ── */}
      <div className="bg-teal/10 border-b border-teal/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-center">
          <p className="text-sm text-navy">
            <span className="font-semibold">Beta Preview</span> — This directory is currently in beta with Columbia GRC alumni.
            Once elected to the board, it will be populated with verified alumni from our full membership database.
          </p>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="relative bg-navy overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/grc-team.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Transforming Global Communities.
            <br />
            <span className="text-teal">Consulting for Social Good.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed">
            Global Research and Consulting Group is a 501(c)3 nonprofit that operates
            worldwide from leading universities with the mission of helping global
            non-profits, social impact startups, and governmental organizations achieve
            their goals while simultaneously empowering students to give back to the
            global community.
          </p>
          <div className="mt-10">
            <Link
              href="/alumni"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-teal text-white font-semibold text-sm hover:bg-teal-light transition-colors"
            >
              Browse Alumni Directory
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-[#061340] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-teal">{totalPublished}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">Alumni in Directory</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-teal">{activeFirms.length}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">Consulting Firms</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Floating Firm Logo Tiles */}
        <section>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-tight">
            Our Alumni Work At
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_FIRMS.map((firm) => {
              const count = firmCounts.find((fc) => fc.currentFirm === firm.slug)?._count ?? 0;
              return (
                <Link key={firm.slug} href={`/alumni?firm=${firm.slug}`}>
                  <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center">
                    <div className="h-10 flex items-center justify-center mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={firm.logo}
                        alt={firm.name}
                        width={140}
                        height={40}
                        className="max-h-10 w-auto"
                      />
                    </div>
                    <div className="text-2xl font-display font-bold text-navy">{count}</div>
                    <div className="text-xs text-gray-dark mt-0.5">alumni</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Alumni by Firm — only firms with alumni */}
        <section>
          <h2 className="font-display text-2xl font-bold text-navy mb-6 tracking-tight">
            Columbia Alumni by Firm
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeFirms.map((firm) => {
              const count = firmCounts.find((fc) => fc.currentFirm === firm.slug)?._count ?? 0;
              return (
                <Link key={firm.slug} href={`/alumni?firm=${firm.slug}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-teal group">
                    <CardContent className="p-5 text-center">
                      <div className="text-3xl font-display font-bold text-navy group-hover:text-teal transition-colors">
                        {count}
                      </div>
                      <div className="text-sm text-gray-dark mt-1 font-medium">
                        {firm.shortName}
                      </div>
                      <div className="text-[10px] text-[#9E9E9E] uppercase tracking-wider mt-0.5">
                        {firm.tier}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recently Added */}
        <section>
          <h2 className="font-display text-xl font-bold text-navy mb-4 tracking-tight">
            Recently Added
          </h2>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="divide-y divide-slate-100">
                {recentAlumni.map((a) => {
                  const firm = FIRMS.find((f) => f.slug === a.currentFirm);
                  return (
                    <Link
                      key={a.id}
                      href={`/alumni/${a.id}`}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-3 px-3 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-navy">
                            {a.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-navy">{a.name}</div>
                          <div className="text-xs text-[#595959]">
                            {a.currentTitle || firm?.shortName || a.currentFirm}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#9E9E9E] font-medium">
                        {firm?.shortName || a.currentFirm}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-navy border-t border-white/10 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">GRC</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Global Research & Consulting</div>
                <div className="text-[10px] text-white/50">Columbia University</div>
              </div>
            </div>
            <div className="text-xs text-white/40">
              Beta Preview — Alumni data sourced from public LinkedIn profiles
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
