import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminActions } from "@/components/admin-actions";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [pendingSeeds, outreachStats, totalAlumni, totalVerified] = await Promise.all([
    prisma.alumni.findMany({
      where: { source: "LINKEDIN_SEED", verifiedByAlumni: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.outreachRequest.groupBy({ by: ["status"], _count: true }),
    prisma.alumni.count(),
    prisma.alumni.count({ where: { verifiedByAlumni: true } }),
  ]);

  const outreachByStatus = Object.fromEntries(outreachStats.map((s) => [s.status, s._count]));

  return (
    <div>
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-columbia-blue/80 mt-2">Manage seeded alumni, review queue, and outreach analytics</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Alumni", value: totalAlumni, color: "text-navy" },
            { label: "Verified", value: totalVerified, color: "text-emerald-600" },
            { label: "Pending Review", value: pendingSeeds.length, color: "text-amber-600" },
            { label: "Outreach Sent", value: (outreachByStatus.SENT || 0) + (outreachByStatus.RESPONDED || 0), color: "text-columbia-dark" },
          ].map((stat) => (
            <Card key={stat.label} className="border-slate-200">
              <CardContent className="p-5 text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Outreach breakdown */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <h2 className="font-display text-base font-semibold text-navy mb-4">Outreach Analytics</h2>
            <div className="flex gap-8">
              {["DRAFTED", "SENT", "RESPONDED"].map((status) => (
                <div key={status}>
                  <span className="text-sm text-slate-500">{status.charAt(0) + status.slice(1).toLowerCase()}: </span>
                  <span className="font-semibold text-navy">{outreachByStatus[status] || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending seeds */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <h2 className="font-display text-base font-semibold text-navy mb-4">
              LinkedIn Seed Review Queue ({pendingSeeds.length})
            </h2>
            {pendingSeeds.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No pending seeds to review.</p>
            ) : (
              <div className="space-y-3">
                {pendingSeeds.map((alumni) => {
                  const firm = FIRMS.find((f) => f.slug === alumni.currentFirm);
                  return (
                    <div key={alumni.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center">
                          <span className="text-xs font-semibold text-amber-700">
                            {alumni.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-navy">{alumni.name}</div>
                          <div className="text-xs text-slate-500">
                            {alumni.currentTitle} at {firm?.shortName || alumni.currentFirm} &middot; {alumni.office || "Unknown office"}
                          </div>
                          <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-columbia-dark hover:underline">
                            LinkedIn →
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-300">
                          Seeded {alumni.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </Badge>
                        <AdminActions alumniId={alumni.id} alumniName={alumni.name} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
