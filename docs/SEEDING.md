# Data Seeding Strategy

## Overview

GRC Alumni Connect uses a **one-time LinkedIn seed harvest** followed by a **self-sustaining enrollment + referral loop**. The LinkedIn MCP is for initial seeding only, run locally by an admin using their own LinkedIn account.

## How the Seed Works

1. Admin runs the harvester CLI (`packages/harvester`) locally
2. The CLI connects to the [linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server) running locally
3. For each target firm, it searches for people who studied at Columbia and currently work there
4. Profiles are saved to the DB with `source=LINKEDIN_SEED`, `verifiedByAlumni=false`, `publishedToDirectory=false`
5. Seeded alumni are **invisible** to GRC members until they opt in

## Risk Acknowledgment

- LinkedIn's Terms of Service prohibit automated scraping
- The MCP uses Patchright (Playwright fork) to mimic human browsing
- Risk is low at low volume (~25-50 profiles/session), real at high volume
- The admin who runs the seed accepts personal-account risk
- **Never run during LinkedIn HQ business hours** (Pacific timezone)
- **Stop immediately** if you encounter CAPTCHAs or account warnings
- Hard-coded rate limits: 8-15 second delays, max 50 profiles/run, 1-hour wall time

## Post-Seed Verification Flow

1. Admin reviews seeded profiles in `/admin`
2. Admin generates a claim link for each alumni (JWT-signed, 30-day expiry)
3. Admin sends claim link via email or LinkedIn DM
4. Alumni clicks link → sees pre-filled profile → confirms info + toggles "willing to chat"
5. Only then: `verifiedByAlumni=true`, `publishedToDirectory=true`

This is **opt-in, not opt-out**. No seeded data is ever visible without explicit alumni consent.

## After the Seed

The app never calls LinkedIn at runtime. Growth comes from:
- **Self-enrollment**: Alumni visit `/onboarding` and add themselves
- **Referral links**: Members share referral URLs after connecting with alumni
- **Footer CTAs**: Every outreach email includes "Join the directory" links
- **Quarterly updates**: Automated emails ask verified alumni to confirm their info is current

## Recommended Seeding Plan

| Day | Firm | Expected Profiles |
|-----|------|-------------------|
| 1 | McKinsey | 20-30 |
| 2 | BCG | 15-25 |
| 3 | Bain | 15-25 |
| 4 | Deloitte | 20-30 |
| 5 | EY-Parthenon | 10-15 |
| 6 | Oliver Wyman + Kearney | 10-15 |
| 7 | Cornerstone + L.E.K. + CRA | 10-15 |
| 8 | Analysis Group + Strategy& + KPMG | 10-15 |

Total: ~110-170 seeded profiles over 8 days, well within safe limits.
