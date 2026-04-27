# Privacy & Verification Model

## Core Principle

**No alumni data is visible to GRC members without explicit opt-in from the alumni themselves.**

## Data Sources

| Source | How it enters | Visible immediately? |
|--------|--------------|---------------------|
| `LINKEDIN_SEED` | Admin runs harvester locally | **No** — invisible until claimed |
| `SELF_ENROLLED` | Alumni fills out `/onboarding` form | **Yes** — they're opting in |
| `REFERRAL` | Alumni arrives via referral link | **Yes** — they're opting in |
| `ADMIN_ADDED` | Admin manually creates profile | Configurable |

## LinkedIn Seed Privacy Flow

1. Harvester saves profiles with `publishedToDirectory=false` and `verifiedByAlumni=false`
2. Seeded profiles are **never shown** on `/alumni` or any public-facing page
3. Admin reviews seeds in the admin panel
4. Admin generates a personalized claim link (JWT-signed, 30-day expiry)
5. Admin sends the link to the alumni via email or LinkedIn message
6. Alumni clicks the link, sees their pre-filled info, and can:
   - Correct any information
   - Toggle "willing to chat" on or off
   - Choose to publish their profile
7. Only after explicit confirmation: `verifiedByAlumni=true`, `publishedToDirectory=true`

## Removal Rights

- Every published profile has a "Remove me from directory" button
- Every outreach email includes a one-click removal link
- Removal sets `publishedToDirectory=false` and `willingToChat=false` immediately
- Alumni data is soft-deleted (hidden, not destroyed) for audit purposes

## Access Control

- Only authenticated @columbia.edu users can view the directory
- The directory page only shows alumni where `publishedToDirectory=true`
- Alumni detail pages return 404 for non-published profiles
- Admin panel requires `role=ADMIN`

## Data Minimization

- No LinkedIn data is scraped at runtime — only during the one-time seed
- The harvester stores only: name, title, firm, office, grad year, LinkedIn URL
- No photos, connections, activity, or private data is harvested
- Columbia email is collected during claim/onboarding for verification only

## Quarterly Updates

- Verified alumni receive a quarterly "Is your info still current?" email
- One-click confirm or update
- If no response after 2 quarters, profile is flagged for admin review
