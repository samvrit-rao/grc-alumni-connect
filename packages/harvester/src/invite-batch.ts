#!/usr/bin/env node

/**
 * Post-harvest invite batch: generates claim links for all unverified
 * LINKEDIN_SEED alumni at a given firm and outputs them for manual sending.
 *
 * Usage: pnpm harvest:invite --firm mckinsey
 */

import "dotenv/config";
import { program } from "commander";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const CLAIM_SECRET = process.env.CLAIM_TOKEN_SECRET || "dev-claim-secret";
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

program
  .name("harvest:invite")
  .option("--firm <slug>", "Firm slug to invite (required)")
  .parse();

const opts = program.opts();

async function main() {
  if (!opts.firm) {
    console.error("--firm is required");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  const alumni = await prisma.alumni.findMany({
    where: {
      currentFirm: opts.firm,
      source: "LINKEDIN_SEED",
      verifiedByAlumni: false,
    },
  });

  if (alumni.length === 0) {
    console.log(`No unverified seeds for firm: ${opts.firm}`);
    process.exit(0);
  }

  console.log(`\nGenerating claim links for ${alumni.length} alumni at ${opts.firm}:\n`);
  console.log("─".repeat(80));

  for (const a of alumni) {
    const token = jwt.sign(
      { alumniId: a.id, type: "claim" },
      CLAIM_SECRET,
      { expiresIn: "30d" }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.alumni.update({
      where: { id: a.id },
      data: { claimToken: token, claimTokenExpiresAt: expiresAt },
    });

    const claimUrl = `${BASE_URL}/alumni/${a.id}/claim?token=${token}`;

    console.log(`Name:     ${a.name}`);
    console.log(`Title:    ${a.currentTitle || "N/A"}`);
    console.log(`LinkedIn: ${a.linkedinUrl}`);
    console.log(`Claim:    ${claimUrl}`);
    console.log("─".repeat(80));
  }

  console.log(`\nDone. Send each alumni their claim link via email or LinkedIn message.`);
  console.log(`Links expire in 30 days.\n`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
