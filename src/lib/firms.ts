export interface Firm {
  slug: string;
  name: string;
  shortName: string;
  logo: string; // path under /logos/
  tier: "MBB" | "Big4" | "Specialty";
}

export const FIRMS: Firm[] = [
  // MBB
  { slug: "mckinsey", name: "McKinsey & Company", shortName: "McKinsey", logo: "/logos/mckinsey.png", tier: "MBB" },
  { slug: "bcg", name: "Boston Consulting Group", shortName: "BCG", logo: "/logos/bcg.png", tier: "MBB" },
  { slug: "bain", name: "Bain & Company", shortName: "Bain", logo: "/logos/bain.png", tier: "MBB" },

  // Big 4
  { slug: "deloitte", name: "Deloitte Consulting", shortName: "Deloitte", logo: "/logos/deloitte.png", tier: "Big4" },
  { slug: "ey-parthenon", name: "EY-Parthenon", shortName: "EY-Parthenon", logo: "/logos/ey.png", tier: "Big4" },
  { slug: "pwc-strategy", name: "PwC Strategy&", shortName: "Strategy&", logo: "/logos/pwc.png", tier: "Big4" },
  { slug: "kpmg", name: "KPMG Advisory", shortName: "KPMG", logo: "/logos/kpmg.png", tier: "Big4" },

  // Specialty
  { slug: "oliver-wyman", name: "Oliver Wyman", shortName: "Oliver Wyman", logo: "/logos/oliver-wyman.png", tier: "Specialty" },
  { slug: "cornerstone", name: "Cornerstone Research", shortName: "Cornerstone", logo: "/logos/cornerstone.png", tier: "Specialty" },
  { slug: "lek", name: "L.E.K. Consulting", shortName: "L.E.K.", logo: "/logos/lek.png", tier: "Specialty" },
  { slug: "kearney", name: "Kearney", shortName: "Kearney", logo: "/logos/kearney.png", tier: "Specialty" },
  { slug: "analysis-group", name: "Analysis Group", shortName: "Analysis Group", logo: "/logos/analysis-group.png", tier: "Specialty" },
  { slug: "cra", name: "Charles River Associates", shortName: "CRA", logo: "/logos/cra.png", tier: "Specialty" },
];

export const FIRM_MAP = new Map(FIRMS.map((f) => [f.slug, f]));

export function getFirmByName(name: string): Firm | undefined {
  const lower = name.toLowerCase();
  return FIRMS.find(
    (f) =>
      f.name.toLowerCase() === lower ||
      f.shortName.toLowerCase() === lower ||
      f.slug === lower
  );
}

export const SCHOOLS = ["CC", "SEAS", "GS", "Barnard", "GSAS", "SIPA", "CBS", "Other"] as const;
export type School = (typeof SCHOOLS)[number];

export const ALUMNI_SOURCES = ["LINKEDIN_SEED", "SELF_ENROLLED", "REFERRAL", "ADMIN_ADDED"] as const;
export type AlumniSource = (typeof ALUMNI_SOURCES)[number];

export const OUTREACH_STATUSES = ["DRAFTED", "SENT", "RESPONDED"] as const;
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];
