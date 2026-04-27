import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getDashboardData() {
  const [firmCounts, recentAlumni, recruitersWithHours, upcomingVisits] =
    await Promise.all([
      prisma.alumni.groupBy({
        by: ["currentFirm"],
        where: { publishedToDirectory: true },
        _count: true,
      }),
      prisma.alumni.findMany({
        where: { publishedToDirectory: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.recruiter.findMany({
        where: { officeHours: { not: "[]" } },
        orderBy: { firm: "asc" },
      }),
      prisma.recruiter.findMany({
        where: { nextCampusVisit: { gte: new Date() } },
        orderBy: { nextCampusVisit: "asc" },
        take: 5,
      }),
    ]);

  return { firmCounts, recentAlumni, recruitersWithHours, upcomingVisits };
}

function getFirmDisplay(slug: string) {
  return FIRMS.find((f) => f.slug === slug);
}

export default async function DashboardPage() {
  const { firmCounts, recentAlumni, recruitersWithHours, upcomingVisits } =
    await getDashboardData();

  const totalPublished = firmCounts.reduce((sum, fc) => sum + fc._count, 0);

  return (
    <div>
      {/* ── Hero Section ── */}
      <div className="relative bg-navy overflow-hidden">
        {/* Background image placeholder — replace /grc-team.jpg with your team photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/grc-team.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
            Transforming Global Communities.
            <br />
            <span className="text-columbia-blue">Consulting for Social Good.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed">
            Global Research and Consulting Group is a 501(c)3 nonprofit that operates
            worldwide from leading universities with the mission of helping global
            non-profits, social impact startups, and governmental organizations achieve
            their goals while simultaneously empowering students to give back to the
            global community.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/alumni"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-columbia-blue text-navy font-semibold text-sm hover:bg-columbia-light transition-colors"
            >
              Browse Alumni Directory
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Join as Alumni
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-navy-dark border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-columbia-blue">{totalPublished}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">Verified Alumni</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-columbia-blue">{firmCounts.length}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">Partner Firms</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-columbia-blue">{upcomingVisits.length}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">Upcoming Visits</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Alumni by Firm */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-navy mb-6">
            Columbia Alumni by Firm
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {FIRMS.map((firm) => {
              const count = firmCounts.find((fc) => fc.currentFirm === firm.slug)?._count ?? 0;
              return (
                <Link key={firm.slug} href={`/alumni?firm=${firm.slug}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-columbia-blue group">
                    <CardContent className="p-5 text-center">
                      <div className="text-3xl font-bold text-navy group-hover:text-columbia-dark transition-colors">
                        {count}
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">
                        {firm.shortName}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        {firm.tier}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Office Hours */}
          <section>
            <h2 className="font-display text-xl font-semibold text-navy mb-4">
              Office Hours
            </h2>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                {recruitersWithHours.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No office hours scheduled this week.</p>
                ) : (
                  <div className="space-y-4">
                    {recruitersWithHours.map((r) => {
                      const firm = getFirmDisplay(r.firm);
                      const hours = JSON.parse(r.officeHours || "[]") as {
                        dayOfWeek: string; startTime: string; endTime: string;
                        location: string; notes?: string;
                      }[];
                      return hours.map((h, i) => (
                        <div key={`${r.id}-${i}`} className="flex items-start justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                          <div>
                            <div className="text-sm font-semibold text-navy">{firm?.shortName || r.firm}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{h.dayOfWeek} {h.startTime}&#8211;{h.endTime}</div>
                            <div className="text-xs text-slate-400">{h.location}</div>
                          </div>
                          {h.notes && (
                            <Badge variant="secondary" className="text-[10px] bg-columbia-blue/10 text-columbia-dark border-0">
                              {h.notes}
                            </Badge>
                          )}
                        </div>
                      ));
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Campus Visits */}
          <section>
            <h2 className="font-display text-xl font-semibold text-navy mb-4">
              Upcoming Campus Visits
            </h2>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                {upcomingVisits.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No upcoming campus visits.</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingVisits.map((r) => {
                      const firm = getFirmDisplay(r.firm);
                      return (
                        <div key={r.id} className="flex items-start justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                          <div>
                            <div className="text-sm font-semibold text-navy">{firm?.shortName || r.firm}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{r.campusVisitEvent}</div>
                          </div>
                          <div className="text-xs font-medium text-navy bg-slate-100 px-2 py-1 rounded">
                            {r.nextCampusVisit?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Recently Joined */}
        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-4">
            Recently Joined
          </h2>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              {recentAlumni.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No alumni yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentAlumni.map((a) => {
                    const firm = getFirmDisplay(a.currentFirm);
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
                            <div className="text-xs text-slate-500">
                              {a.currentTitle} at {firm?.shortName || a.currentFirm}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {a.willingToChat && (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] border-0">
                              Open to chat
                            </Badge>
                          )}
                          <span className="text-xs text-slate-400">
                            {a.school} &apos;{a.gradYear?.toString().slice(-2)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-navy border-t border-white/10 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-columbia-blue flex items-center justify-center">
                <span className="text-navy font-bold text-[10px]">GRC</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Global Research & Consulting</div>
                <div className="text-[10px] text-white/50">Columbia University</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/50">
              <Link href="/onboarding" className="hover:text-white transition-colors">Join Directory</Link>
              <Link href="/alumni" className="hover:text-white transition-colors">Browse Alumni</Link>
              <Link href="/recruiters" className="hover:text-white transition-colors">Recruiters</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
