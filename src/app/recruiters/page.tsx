import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OfficeHour {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

export default async function RecruitersPage() {
  const recruiters = await prisma.recruiter.findMany({ orderBy: { firm: "asc" } });

  const byFirm = new Map<string, typeof recruiters>();
  for (const r of recruiters) {
    const existing = byFirm.get(r.firm) || [];
    existing.push(r);
    byFirm.set(r.firm, existing);
  }

  const withHours = recruiters.filter((r) => {
    const hours = JSON.parse(r.officeHours || "[]") as OfficeHour[];
    return hours.length > 0;
  });

  return (
    <div>
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display text-3xl font-bold text-white">Recruiters</h1>
          <p className="text-columbia-blue/80 mt-2">Campus recruiters and contacts at target firms</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Office Hours highlight */}
        {withHours.length > 0 && (
          <Card className="border-columbia-blue/40 bg-gradient-to-r from-columbia-blue/5 to-transparent">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-navy mb-4">Office Hours This Week</h2>
              <div className="space-y-4">
                {withHours.map((r) => {
                  const firm = FIRMS.find((f) => f.slug === r.firm);
                  const hours = JSON.parse(r.officeHours || "[]") as OfficeHour[];
                  return hours.map((h, i) => (
                    <div key={`${r.id}-${i}`} className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm text-navy">{firm?.shortName || r.firm} — {r.name}</div>
                        <div className="text-sm text-slate-600">{h.dayOfWeek} {h.startTime}&#8211;{h.endTime}</div>
                        <div className="text-xs text-slate-400">{h.location}</div>
                      </div>
                      <div className="text-right space-y-1">
                        {h.notes && (
                          <Badge variant="secondary" className="text-[10px] bg-columbia-blue/10 text-columbia-dark border-0">
                            {h.notes}
                          </Badge>
                        )}
                        {r.schedulingLink && (
                          <a href={r.schedulingLink} target="_blank" rel="noopener noreferrer" className="block text-xs text-columbia-dark hover:underline font-medium">
                            Schedule →
                          </a>
                        )}
                      </div>
                    </div>
                  ));
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* By firm */}
        <div className="space-y-6">
          {Array.from(byFirm.entries()).map(([firmSlug, firmRecruiters]) => {
            const firm = FIRMS.find((f) => f.slug === firmSlug);
            return (
              <Card key={firmSlug} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-base font-semibold text-navy">{firm?.name || firmSlug}</h3>
                    {firm && (
                      <Badge variant="outline" className="text-[10px] text-navy/60 border-slate-300">{firm.tier}</Badge>
                    )}
                  </div>
                  <div className="space-y-4">
                    {firmRecruiters.map((r, idx) => (
                      <div key={r.id}>
                        {idx > 0 && <Separator className="mb-4" />}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-sm text-navy">{r.name}</div>
                            {r.title && <div className="text-xs text-slate-500">{r.title}</div>}
                            {r.email && (
                              <a href={`mailto:${r.email}`} className="text-xs text-columbia-dark hover:underline">{r.email}</a>
                            )}
                            {r.focusSchools && (
                              <div className="text-xs text-slate-400 mt-1">Focus: {r.focusSchools}</div>
                            )}
                          </div>
                          <div className="text-right space-y-1">
                            {r.nextCampusVisit && (
                              <div>
                                <div className="text-xs font-medium text-navy">
                                  {r.nextCampusVisit.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </div>
                                {r.campusVisitEvent && <div className="text-[11px] text-slate-400">{r.campusVisitEvent}</div>}
                              </div>
                            )}
                            {r.schedulingLink && (
                              <a href={r.schedulingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-columbia-dark hover:underline font-medium">
                                Schedule →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
