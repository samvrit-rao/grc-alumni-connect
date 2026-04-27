import { prisma } from "@/lib/prisma";
import { FIRMS, SCHOOLS } from "@/lib/firms";
import { AlumniFilters } from "@/components/alumni-filters";
import { AlumniCard } from "@/components/alumni-card";

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
      { name: { contains: q } },
      { currentTitle: { contains: q } },
      { grcInvolvement: { contains: q } },
    ];
  }

  const [alumni, offices, practiceAreas] = await Promise.all([
    prisma.alumni.findMany({
      where,
      orderBy: [{ willingToChat: "desc" }, { name: "asc" }],
    }),
    prisma.alumni
      .findMany({
        where: { publishedToDirectory: true, office: { not: null } },
        select: { office: true },
        distinct: ["office"],
        orderBy: { office: "asc" },
      })
      .then((r) => r.map((o) => o.office).filter(Boolean) as string[]),
    prisma.alumni
      .findMany({
        where: { publishedToDirectory: true, practiceArea: { not: null } },
        select: { practiceArea: true },
        distinct: ["practiceArea"],
        orderBy: { practiceArea: "asc" },
      })
      .then((r) => r.map((o) => o.practiceArea).filter(Boolean) as string[]),
  ]);

  const hasFilters = firm || school || yearFrom || yearTo || office || practiceArea || q;

  return (
    <div>
      {/* Header */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display text-3xl font-bold text-white">Alumni Directory</h1>
          <p className="text-columbia-blue/80 mt-2">
            {alumni.length} verified alumni{hasFilters ? " matching your filters" : " across top consulting firms"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AlumniFilters
          firms={FIRMS}
          schools={[...SCHOOLS]}
          offices={offices}
          practiceAreas={practiceAreas}
          currentFilters={searchParams}
        />

        {alumni.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-navy">No alumni found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {hasFilters ? "Try adjusting your filters." : "No verified alumni in the directory yet."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumni.map((a) => (
              <AlumniCard key={a.id} alumni={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
