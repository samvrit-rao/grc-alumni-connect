import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Firm detection from bio text
const FIRM_PATTERNS: [RegExp, string][] = [
  [/\bMcKinsey\b/i, "mckinsey"],
  [/\bBCG\b|Boston Consulting Group/i, "bcg"],
  [/\bBain\b/i, "bain"],
  [/\bDeloitte\b/i, "deloitte"],
  [/\bEY-Parthenon\b|EY.Parthenon/i, "ey-parthenon"],
  [/\bStrategy\s*&\b|PwC.*Strategy/i, "pwc-strategy"],
  [/\bKPMG\b/i, "kpmg"],
  [/\bOliver Wyman\b/i, "oliver-wyman"],
  [/\bCornerstone\s*Research\b/i, "cornerstone"],
  [/\bL\.?E\.?K\.?\b/i, "lek"],
  [/\bKearney\b/i, "kearney"],
  [/\bAnalysis Group\b/i, "analysis-group"],
  [/\bCharles River Associates\b|\bCRA\b/i, "cra"],
];

function detectFirm(bio: string): string | null {
  for (const [pattern, slug] of FIRM_PATTERNS) {
    if (pattern.test(bio)) return slug;
  }
  return null;
}

function extractTitle(bio: string): string {
  // Take the first segment before " | " or " - " or " @ "
  const parts = bio.split(/\s*[\|–\-]\s*/);
  return parts[0]?.trim() || bio.trim();
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/import-csv.ts <path-to-csv>");
    process.exit(1);
  }

  const content = fs.readFileSync(path.resolve(csvPath), "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  const headers = parseCsvLine(lines[0]);

  const firstnameIdx = headers.indexOf("firstname");
  const lastnameIdx = headers.indexOf("lastname");
  const bioIdx = headers.indexOf("shortBio");
  const locationIdx = headers.indexOf("location");
  const linkedinIdx = headers.indexOf("linkedinUrl");

  console.log(`Found ${lines.length - 1} rows in CSV\n`);

  let imported = 0;
  let skipped = 0;
  let noFirm = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const firstname = cols[firstnameIdx]?.trim() || "";
    const lastname = cols[lastnameIdx]?.trim() || "";
    const bio = cols[bioIdx]?.trim() || "";
    const location = cols[locationIdx]?.trim() || "";
    const linkedinUrl = cols[linkedinIdx]?.trim() || "";

    if (!firstname || !linkedinUrl) {
      skipped++;
      continue;
    }

    const name = `${firstname} ${lastname}`.trim();
    const firm = detectFirm(bio);

    if (!firm) {
      // Try to detect from company name column or skip
      noFirm++;
      console.log(`  [NO FIRM] ${name}: ${bio.slice(0, 80)}`);
      continue;
    }

    const title = extractTitle(bio);

    // Check for duplicate
    const existing = await prisma.alumni.findUnique({ where: { linkedinUrl } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.alumni.create({
      data: {
        name,
        currentFirm: firm,
        currentTitle: title || null,
        office: location || null,
        linkedinUrl,
        source: "LINKEDIN_SEED",
        verifiedByAlumni: false,
        publishedToDirectory: true, // Show them since this is real data
        willingToChat: false,
      },
    });

    imported++;
    console.log(`  [OK] ${name} → ${firm} (${location})`);
  }

  console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}, No firm detected: ${noFirm}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
