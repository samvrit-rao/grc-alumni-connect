import { prisma } from "@/lib/prisma";
import { FIRMS, SCHOOLS } from "@/lib/firms";
import { AlumniFilters } from "@/components/alumni-filters";
import Link from "next/link";

interface Props {
  searchParams: {
    firm?: string;
    school?: string;
    yearFrom?: string;
    yearTo?: string;
    office?: string;
    practiceArea?: string;
    q?: string;
  };
}

export default async function AlumniPage({ searchParams }: Props) {
  const { firm, school, yearFrom, yearTo, office, practiceArea, q } = searchParams;

  const where: Record<string, unknown> = { publishedToDirectory: true };

  if (firm) where.currentFirm = firm;
  if (school) where.school = school;
  if (office) where.office = { contains: office };
  if (practiceArea) where.practiceArea = { contains: practiceArea };

  if (yearFrom || yearTo) {
    where.gradYear = {};
    if (yearFrom) (where.gradYear as Record<string, number>).gte = parseInt(yearFrom);
    if (yearTo) (where.gradYear as Record<string, number>).lte = parseInt(yearTo);
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { currentTitle: { contains: q, mode: "insensitive" } },
    ];
  }

  const [alumni, offices, practiceAreas] = await Promise.all([
    prisma.alumni.findMany({ where, orderBy: [{ name: "asc" }] }),
    prisma.alumni.findMany({
      where: { publishedToDirectory: true, office: { not: null } },
      select: { office: true }, distinct: ["office"], orderBy: { office: "asc" },
    }).then((r) => r.map((o) => o.office).filter(Boolean) as string[]),
    prisma.alumni.findMany({
      where: { publishedToDirectory: true, practiceArea: { not: null } },
      select: { practiceArea: true }, distinct: ["practiceArea"], orderBy: { practiceArea: "asc" },
    }).then((r) => r.map((o) => o.practiceArea).filter(Boolean) as string[]),
  ]);

  const hasFilters = firm || school || yearFrom || yearTo || office || practiceArea || q;
  const firmInfo = firm ? FIRMS.find((f) => f.slug === firm) : null;

  return (
    <div className="mx-auto max-w-[1128px] px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-li-border p-4 mb-4">
        <h1 className="text-lg font-semibold text-li-text">My Network</h1>
        <p className="text-sm text-li-text-secondary mt-0.5">
          {alumni.length} connection{alumni.length !== 1 ? "s" : ""}
          {firmInfo ? ` at ${firmInfo.shortName}` : ""}
          {hasFilters && !firmInfo ? " matching filters" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-li-border p-4 mb-4">
        <AlumniFilters
          firms={FIRMS}
          schools={[...SCHOOLS]}
          offices={offices}
          practiceAreas={practiceAreas}
          currentFilters={searchParams}
        />
      </div>

      {/* Results */}
      {alumni.length === 0 ? (
        <div className="bg-white rounded-lg border border-li-border p-12 text-center">
          <svg className="h-12 w-12 mx-auto text-li-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-base font-semibold text-li-text">No connections found</h3>
          <p className="text-sm text-li-text-secondary mt-1">
            {hasFilters ? "Try adjusting your filters." : "No alumni in the directory yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-li-border divide-y divide-li-border">
          {alumni.map((a) => {
            const f = FIRMS.find((fi) => fi.slug === a.currentFirm);
            return (
              <Link key={a.id} href={`/alumni/${a.id}`}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F2EE] transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-[#E8E8E8] flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-li-text-secondary">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-li-text hover:text-li-blue hover:underline truncate">
                      {a.name}
                    </div>
                    <div className="text-xs text-li-text-secondary truncate">
                      {a.currentTitle || "Alumni"} at {f?.shortName || a.currentFirm}
                    </div>
                    {a.office && (
                      <div className="text-xs text-li-text-muted">{a.office}</div>
                    )}
                  </div>
                  <button className="shrink-0 px-4 py-1.5 rounded-full border border-li-blue text-li-blue text-sm font-semibold hover:bg-li-blue/5 hover:border-li-blue transition-colors">
                    Connect
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
