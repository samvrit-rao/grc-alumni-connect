# GRC Harvester — LinkedIn Seed Tool

A CLI tool that seeds the GRC Alumni Connect database by searching LinkedIn for Columbia alumni at target consulting firms. This tool runs **locally on the admin's machine** and is NOT part of the deployed app.

## Risk Disclosure

**READ THIS BEFORE RUNNING.**

- This tool uses the [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server) which automates LinkedIn browsing via Patchright (a Playwright fork).
- **LinkedIn's Terms of Service prohibit automated access.** Using this tool puts your personal LinkedIn account at risk of restrictions or bans.
- The admin who runs this tool accepts full personal responsibility for their account.
- Risk is low at low volumes (25–50 profiles/session) but real at higher volumes.
- If you encounter a CAPTCHA, rate limit warning, or account restriction — **stop immediately**.

## Prerequisites

1. **Node.js 18+** and npm/pnpm
2. **Python 3.10+** with `uvx` (install via `pip install uvx` or `pipx install uv`)
3. **LinkedIn MCP server**: runs via `uvx linkedin-scraper-mcp@latest`
4. **Authenticated LinkedIn session**: The MCP server uses your browser's LinkedIn cookies. You must be logged into LinkedIn in a Chromium-based browser.

## Setup

```bash
cd packages/harvester
npm install

# Copy the root .env or create one with:
# DATABASE_URL="file:../../prisma/dev.db"
# CLAIM_TOKEN_SECRET="your-secret"
# NEXTAUTH_URL="http://localhost:3000"
```

## Usage

### Harvest profiles

```bash
# Harvest all firms (up to 50 profiles total)
npm run harvest

# Harvest a specific firm
npm run harvest -- --firm mckinsey

# Limit to 25 profiles
npm run harvest -- --firm bcg --max 25

# Preview without writing to DB
npm run harvest:dry -- --firm bain
```

### Generate claim invite links (post-harvest)

```bash
npm run harvest:invite -- --firm mckinsey
```

This outputs a claim URL for each unverified seed at that firm. Send each alumni their link via email or LinkedIn DM.

## Recommended Cadence

- **One firm per day**, max 25-50 profiles per session
- **Never run during LinkedIn HQ business hours** (Pacific time)
- **Max 1-2 sessions per day**
- Wait at least 4 hours between sessions
- Monitor your LinkedIn account for any warnings
- **Stop immediately** if you see a CAPTCHA or warning

## Rate Limiting

Built-in safeguards:
- 8–15 second random delay between profile fetches
- Hard cap at 50 profiles per run (configurable via `--max`)
- 1-hour wall time limit — the tool exits automatically

## Logs

All runs are logged to `packages/harvester/logs/[timestamp].log` for audit purposes.

## What happens after harvesting

1. Seeded profiles land in the DB with `source=LINKEDIN_SEED`, `verifiedByAlumni=false`, `publishedToDirectory=false`
2. They are **completely invisible** to GRC members
3. Admin reviews in `/admin` and generates claim links
4. Each alumni receives a personal claim link to verify their profile
5. Only after opt-in does their profile become visible
