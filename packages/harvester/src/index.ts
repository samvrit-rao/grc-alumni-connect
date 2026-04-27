#!/usr/bin/env node

import "dotenv/config";
import { program } from "commander";
import { PrismaClient } from "@prisma/client";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Firm list (mirrors the app's lib/firms.ts) ──────────────
const FIRMS = [
  { slug: "mckinsey", searchName: "McKinsey & Company" },
  { slug: "bcg", searchName: "Boston Consulting Group" },
  { slug: "bain", searchName: "Bain & Company" },
  { slug: "deloitte", searchName: "Deloitte Consulting" },
  { slug: "ey-parthenon", searchName: "EY-Parthenon" },
  { slug: "pwc-strategy", searchName: "Strategy&" },
  { slug: "kpmg", searchName: "KPMG Advisory" },
  { slug: "oliver-wyman", searchName: "Oliver Wyman" },
  { slug: "cornerstone", searchName: "Cornerstone Research" },
  { slug: "lek", searchName: "L.E.K. Consulting" },
  { slug: "kearney", searchName: "Kearney" },
  { slug: "analysis-group", searchName: "Analysis Group" },
  { slug: "cra", searchName: "Charles River Associates" },
];

// ── CLI Setup ──────────────
program
  .name("grc-harvester")
  .description("Seed GRC Alumni Connect from LinkedIn via MCP")
  .option("--firm <slug>", "Harvest a specific firm only")
  .option("--max <n>", "Max profiles to fetch (default 50)", "50")
  .option("--dry-run", "Preview without DB writes")
  .parse();

const opts = program.opts();
const MAX_PROFILES = parseInt(opts.max);
const DRY_RUN = !!opts.dryRun;
const FIRM_FILTER = opts.firm as string | undefined;
const START_TIME = Date.now();
const ONE_HOUR = 60 * 60 * 1000;

// ── Logger ──────────────
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),
    new transports.File({
      filename: path.join(__dirname, "..", "logs", `${timestamp}.log`),
    }),
  ],
});

// ── Helpers ──────────────
function randomDelay(minSec: number, maxSec: number): Promise<void> {
  const ms = (minSec + Math.random() * (maxSec - minSec)) * 1000;
  return new Promise((r) => setTimeout(r, ms));
}

function extractGradYear(education: { startDate?: string; endDate?: string }[]): number | null {
  for (const edu of education) {
    if (edu.endDate) {
      const year = parseInt(edu.endDate.split("-")[0] || edu.endDate);
      if (year > 1990 && year < 2030) return year;
    }
  }
  return null;
}

function isColumbia(schoolName: string): boolean {
  const lower = schoolName.toLowerCase();
  return (
    lower.includes("columbia") ||
    lower.includes("barnard") ||
    lower.includes("columbia university")
  );
}

// ── Main harvest flow ──────────────
async function main() {
  logger.info("Starting GRC Harvester", { dryRun: DRY_RUN, maxProfiles: MAX_PROFILES, firmFilter: FIRM_FILTER });

  const prisma = new PrismaClient();

  // Connect to LinkedIn MCP server
  logger.info("Connecting to LinkedIn MCP server...");
  const transport = new StdioClientTransport({
    command: "uvx",
    args: ["linkedin-scraper-mcp@latest"],
  });
  const client = new Client({ name: "grc-harvester", version: "1.0.0" }, {});
  await client.connect(transport);
  logger.info("Connected to LinkedIn MCP server");

  const firmsToHarvest = FIRM_FILTER
    ? FIRMS.filter((f) => f.slug === FIRM_FILTER)
    : FIRMS;

  if (firmsToHarvest.length === 0) {
    logger.error(`Unknown firm: ${FIRM_FILTER}`);
    process.exit(1);
  }

  let totalFetched = 0;
  let totalNew = 0;
  let totalSkipped = 0;

  for (const firm of firmsToHarvest) {
    if (totalFetched >= MAX_PROFILES) break;
    if (Date.now() - START_TIME > ONE_HOUR) {
      logger.warn("1-hour wall time reached, stopping");
      break;
    }

    logger.info(`Searching: Columbia University + ${firm.searchName}`);

    // Search for people
    let searchResults;
    try {
      searchResults = await client.callTool({
        name: "search_people",
        arguments: {
          keywords: `Columbia University ${firm.searchName}`,
        },
      });
    } catch (err) {
      logger.error(`Search failed for ${firm.slug}`, { error: String(err) });
      continue;
    }

    // Parse results
    const profiles = Array.isArray(searchResults.content)
      ? searchResults.content
      : [];

    logger.info(`Found ${profiles.length} results for ${firm.slug}`);

    for (const profile of profiles) {
      if (totalFetched >= MAX_PROFILES) break;
      if (Date.now() - START_TIME > ONE_HOUR) break;

      // Rate limit: 8-15 second random delay
      await randomDelay(8, 15);

      const profileUrl = typeof profile === "object" && profile !== null
        ? (profile as Record<string, unknown>).url || (profile as Record<string, unknown>).linkedinUrl || (profile as Record<string, unknown>).text
        : String(profile);

      if (!profileUrl || typeof profileUrl !== "string") {
        logger.warn("Skipping profile with no URL");
        continue;
      }

      // Check if already in DB
      const existing = await prisma.alumni.findUnique({
        where: { linkedinUrl: String(profileUrl) },
      });
      if (existing) {
        logger.info(`Skipping duplicate: ${profileUrl}`);
        totalSkipped++;
        totalFetched++;
        continue;
      }

      // Fetch full profile
      logger.info(`Fetching profile: ${profileUrl}`);
      let profileData;
      try {
        profileData = await client.callTool({
          name: "get_person_profile",
          arguments: { url: String(profileUrl) },
        });
      } catch (err) {
        logger.error(`Profile fetch failed: ${profileUrl}`, { error: String(err) });
        continue;
      }

      totalFetched++;

      // Parse profile data
      const data = profileData.content?.[0];
      if (!data || typeof data !== "object") {
        logger.warn(`Empty profile data for ${profileUrl}`);
        continue;
      }

      const parsed = data as Record<string, unknown>;
      const name = String(parsed.name || parsed.full_name || "Unknown");
      const title = String(parsed.title || parsed.headline || "");
      const location = String(parsed.location || "");
      const education = Array.isArray(parsed.education) ? parsed.education : [];

      // Verify Columbia affiliation
      const columbiaEdu = education.find((e: Record<string, unknown>) =>
        isColumbia(String(e.school || e.institution || ""))
      );
      if (!columbiaEdu) {
        logger.info(`Skipping non-Columbia: ${name}`);
        continue;
      }

      const gradYear = extractGradYear(education as { startDate?: string; endDate?: string }[]);

      if (DRY_RUN) {
        logger.info(`[DRY RUN] Would create: ${name} - ${title} at ${firm.searchName}`, {
          linkedinUrl: profileUrl,
          gradYear,
          office: location,
        });
      } else {
        try {
          await prisma.alumni.create({
            data: {
              name,
              currentFirm: firm.slug,
              currentTitle: title || null,
              office: location || null,
              gradYear,
              linkedinUrl: String(profileUrl),
              source: "LINKEDIN_SEED",
              verifiedByAlumni: false,
              publishedToDirectory: false,
            },
          });
          totalNew++;
          logger.info(`Created: ${name} at ${firm.searchName}`);
        } catch (err) {
          // Likely duplicate constraint
          logger.warn(`Failed to create ${name}`, { error: String(err) });
          totalSkipped++;
        }
      }
    }
  }

  logger.info("Harvest complete", {
    totalFetched,
    totalNew,
    totalSkipped,
    durationMinutes: Math.round((Date.now() - START_TIME) / 60000),
  });

  await client.close();
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
