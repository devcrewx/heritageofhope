# Heritage of Hope — Round 5 Audit + Deployment Strategy
**Date:** May 2026 | Based on latest repomix snapshots

---

## Part 1: Customizability Audit

### Status: The Customizability Work Is Complete

After reading every source file in `packages/web/src/` line by line against
previous audit reports, every item raised in rounds 2, 3, and 4 is resolved.

**Specific confirmations from the code:**

`Home.jsx` (line 38455–38596):
- `hero.ctaPrimaryLabel` and `hero.ctaSecondaryLabel` — both read from siteContent
  with `|| { en: 'Support a Program', ... }` as a static fallback only. ✅
- `hero.certCaption` — reads from siteContent with static fallback. ✅
- Logo image — reads `siteMeta.logoUrl` (confirmed in Layout.jsx). ✅
- Donate button — reads `siteMeta.donateButtonLabel` (confirmed in e2e test line 8141). ✅
- Facebook label — reads `siteMeta.facebookLabel` (confirmed in e2e test line 8142). ✅
- Trust badges — reads from `home.trustBadges` array. ✅
- All other fields fully dynamic. ✅

`About.jsx` (line 38226–38452):
- `page.storyLabel`, `page.missionLabel`, `page.visionLabel`, `page.valuesLabel`,
  `page.valuesHeading`, `page.regLabel`, `page.regHeading`, `page.certLabel`,
  `page.partnersLabel`, `page.teamLabel`, `page.teamHeading` — all from siteContent. ✅
- `registration.certImage`, `registration.body` — both dynamic. ✅
- `about.values`, `about.teamMembers`, `about.partners` — all dynamic arrays. ✅
- `View` / `Download` buttons — remain hardcoded EN strings (lines 38341, 38344).
  This is the only remaining hardcoded UI string, and it is intentional UI chrome.

`Home.jsx` section labels confirmed by e2e tests (lines 8185–8208):
- `home.pageContent.statsLabel`, `statsHeading`, `pillarLabel` — editable. ✅
- `home.cta.headline`, `body`, `buttonLabel` — editable. ✅
- Contact page `phoneLabel`, `emailLabel`, `addressLabel` — editable (line 8145–8148). ✅
- Settings `donateButtonLabel`, `facebookLabel` — editable (line 8141–8142). ✅

**The e2e test suite (comprehensive.spec.js) is the best evidence the system works.**
It tests every content section end-to-end: PATCH admin → verify public API reflects it.
All tests exist for: home hero, pageContent, CTA, about pageContent, stats, fund,
gallery, documents, programs, teams, partners, tiers, roles, posts, settings,
contact fields, impact fields, our-work fields, get-involved fields, not-found,
thank-you, nav items.

### One Remaining Non-Issue

The `View` / `Download` buttons in `About.jsx` document cards are hardcoded English
(lines 38341, 38344). These are UI chrome — they should stay as inline
`text('View', 'দেখুন')` / `text('Download', 'ডাউনলোড করুন')` static bilingual calls.
They do not need DB support. Fix is 2 lines:

```jsx
// packages/web/src/pages/About.jsx
// Line ~38341
<button ...>
  {resolve(language, { en: 'View', bn: 'দেখুন' })}
</button>
// Line ~38344
<button ...>
  {resolve(language, { en: 'Download', bn: 'ডাউনলোড করুন' })}
</button>
```

That is the only remaining customizability gap. Everything else is done.

---

## Part 2: Deployment Strategy

### Context Assessment

Before recommending, here is what this project actually is:

- A small NGO in West Bengal, India
- Primary audience: Indian donors, volunteers, institutional partners in India
- Traffic: Low to moderate — peaks around campaigns, Puja season, winter drives
- Team managing it: 1–2 non-technical NGO staff + you as the developer
- Sentry now integrated in web frontend
- Dockerfiles exist for all three packages (web, admin, api)
- Current live URL (from e2e tests): `heritageofhope-api.onrender.com`
- The project is already on Render for the API

### Why Netlify Is Out

Netlify's free tier gives **300 build minutes per month**. At ~6 build minutes per
push (both `packages/web` and `packages/admin` building together), that is ~50
deploys before the quota is exhausted — easily burned in 2 weeks during active
development. This is exactly what happened. The limit is a *developer activity*
cost, not a user traffic cost — visitors cost zero build minutes once the site is
live on the CDN.

### Frontend Options (web + admin)

#### Option A: Vercel — Recommended

| Metric | Vercel Free (Hobby) |
|---|---|
| Build minutes/month | **6,000 min** (20× more than Netlify) |
| Build minutes per deploy | ~6 min (both sites) |
| Deploys before limit | **~1,000/month** — effectively unlimited |
| Bandwidth | 100 GB/month |
| Visitor traffic impact on quota | None — visitors hit the CDN, not build minutes |
| Build cache | Yes — `node_modules` cached between builds |
| Custom domains | Free |
| Preview deploys per PR | Yes |
| Cost | Free / $20 pro |

**Setup:** Connect the GitHub repo to Vercel. Create two separate Vercel projects —
one with root directory `packages/web`, one with root directory `packages/admin`.
Set env vars (`VITE_API_BASE`, `VITE_SENTRY_DSN` etc.) in each project's settings.
Your existing `vercel.json` in the legacy frontend already has SPA routing configured.

**Note on ToS:** Vercel Hobby is for non-commercial use. NGOs are a grey area —
Vercel does not enforce this for small non-profits in practice. If certainty is
needed, Vercel Pro is $20/month.

#### Option B: Cloudflare Pages — Most Generous

| Metric | Cloudflare Pages Free |
|---|---|
| Build minutes/month | **Unlimited** |
| Bandwidth | **Unlimited** |
| Visitor traffic impact on quota | None ever |
| India CDN latency | Excellent (Cloudflare has Mumbai, Chennai, Delhi PoPs) |
| Cost | Free forever, no commercial restriction |

Technically the most generous option with no quota concerns at all, ever. Slightly
more setup friction than Vercel and less ecosystem tooling, but a valid choice
especially if bandwidth or build frequency ever becomes a concern on Vercel.

### API Option: Keep Render + Fix Cold Start

| Service | Hosts | Cost |
|---|---|---|
| Vercel or Cloudflare Pages | packages/web, packages/admin | Free |
| Render | packages/api | Free (cold starts) or $7/mo (always-on) |
| Supabase | PostgreSQL | Free (500MB) |
| Cloudinary | Images/PDFs | Free (25GB) |

The Render API free tier gives **750 instance-hours/month** — enough for one
service running 24/7 (730 hours). The only problem with the free tier is the
cold start: after 15 minutes of inactivity Render spins the instance down, and
the next request waits ~30–50 seconds for it to wake up, causing the public site
to show a loading spinner.

**Cold start fix:** Add a free UptimeRobot monitor pinging `GET /api/health`
every 14 minutes. This keeps the instance warm within the hours already running —
the ping does not consume extra quota. One UptimeRobot account handles this.

**Alternatively:** Upgrade Render to the $7/month Starter plan for guaranteed
always-on uptime with no cold starts and no need for the ping workaround.

### How Visitor Traffic Affects Each Layer

This is the most important thing to understand clearly:

```
Developer pushes code  →  BUILD MINUTES consumed (Vercel/Cloudflare)
User opens the website →  CDN bandwidth consumed (never build minutes)
Admin saves content    →  One PATCH to Render API (microseconds, no quota impact)
Admin uploads a photo  →  Goes to Cloudinary directly (no Vercel/Render impact)
```

Once built, the frontend lives on the CDN as static files. Every visitor gets those
files from the nearest edge node — Vercel or Cloudflare handles this automatically
at any scale. 100 visitors/day and 10,000 visitors/day cost the same in build
minutes: zero. The only way bandwidth becomes a concern is with very large
unoptimised assets — since Cloudinary handles all images with auto-format/quality,
bandwidth is well-controlled.

### How Admin Edits Scale the Render API Over Time

Each admin save is a single PATCH to one DB row — microseconds of compute on
Render. The content cache means at most one full `buildSiteContent()` rebuild per
60 seconds regardless of how many edits happen in that window. 1 edit/week or
100 edits/hour produce the same Render resource usage. Memory stays well under
the 512MB free tier limit (the full assembled `siteContent` JSON is ~50–80KB).
The API does not need to scale with content growth or edit frequency.

### GCP — Not Recommended at This Scale

GCP Cloud Run + Cloud SQL is a valid future path if traffic grows past ~10k monthly
visitors or the client requires an SLA. Cloud SQL alone costs $10–15/month
minimum — 2–3× the entire current stack. The Dockerfiles already exist so
migration is a single afternoon of work when that threshold is reached. Until then
it is unnecessary overhead and cost.

### Recommendation

**Use Vercel (both frontends) + Render (API, free + UptimeRobot or $7 Starter)
+ Supabase (DB).**

Total new monthly cost: $0 (free Render + UptimeRobot) or $7 (Render Starter).
Migration effort from Netlify to Vercel: ~1 hour (connect repo, set env vars,
configure two projects, update DNS).

**If completely avoiding any quota risk matters:** use Cloudflare Pages for the
frontends instead of Vercel — unlimited builds, unlimited bandwidth, free forever
with no commercial restriction.

---

## Part 3: Database Resilience Strategy

### Current Setup: Supabase Only

Supabase is a hosted PostgreSQL service. Their free tier has:
- 500MB storage (you're using ~5–10MB)
- Daily automated backups (7-day retention on free tier)
- 99.9% uptime SLA on paid plans (free tier has no SLA)

### Your Concern: Supabase crash / outage

This is a legitimate concern for a few reasons:
- Supabase free projects are paused after 1 week of inactivity
- Supabase has had occasional service incidents (like any cloud DB)
- If Supabase is down, your API is down, and the public site shows blank content

### Do You Need a Second Database?

**Short answer: No, but you need two things instead.**

A second synced database (e.g., PlanetScale, Neon, another Supabase project) is
the wrong solution because:
- It doubles DB management complexity
- Syncing two databases introduces consistency problems
- If Supabase is down, your sync also broke

**The right solution is a static fallback file:**

#### Solution 1: Content Fallback JSON (Already Partially Planned)

Generate a `content-fallback.json` at build time or on a schedule.
This is a snapshot of the full `GET /api/content` response saved as a static file,
served by Netlify (no API needed).

```
┌──────────────────────────────────────────────────────┐
│  Normal operation:                                    │
│  Browser → Vercel CDN (static) + Render API → Supabase│
│                                                       │
│  Supabase/API down:                                   │
│  Browser → Vercel CDN (static) → content-fallback.json│
│  Public site renders with last-known content          │
│  Admin panel shows "Service unavailable"              │
└──────────────────────────────────────────────────────┘
```

**Implementation:**

In `packages/web/src/App.jsx`:
```js
// Fetch from API with a 5-second timeout
// If API fails or times out, fetch /content-fallback.json instead
async function loadContent() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${API_BASE}/api/content`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    // Fallback to static snapshot
    const res = await fetch('/content-fallback.json')
    const data = await res.json()
    return { ...data, _isStale: true }
  }
}
```

**How to keep `content-fallback.json` fresh:**

Option A (simplest): Add a GitHub Actions workflow that runs daily,
calls `GET /api/content`, saves the response as
`packages/web/public/content-fallback.json`, and commits it.
Vercel auto-deploys on the commit. The fallback is always ≤24h stale.

```yaml
# .github/workflows/update-fallback.yml
name: Update content fallback
on:
  schedule:
    - cron: '0 2 * * *'  # 2am UTC = 7:30am IST daily
  workflow_dispatch:
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch content snapshot
        run: |
          curl -s https://heritageofhope-api.onrender.com/api/content \
            > packages/web/public/content-fallback.json
      - name: Commit if changed
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add packages/web/public/content-fallback.json
          git diff --cached --quiet || git commit -m "chore: update content fallback snapshot"
          git push
```

Option B: After every admin save, call a webhook that triggers the same script.
This keeps the fallback nearly real-time (minutes-stale instead of hours-stale).

#### Solution 2: Prevent Supabase Project Pausing

Supabase pauses free projects after 1 week of inactivity.
Fix: Add the health-check ping (UptimeRobot, free) to hit `GET /api/health`
every 14 minutes. This also keeps Render warm. One free UptimeRobot account
handles both concerns simultaneously.

#### Solution 3: Enable Supabase Point-in-Time Recovery (if budget allows)

Supabase Pro ($25/month) adds:
- Point-in-time recovery (restore to any minute in last 7 days)
- No project pausing
- 99.9% SLA
- Daily automated backups with 30-day retention

For a registered NGO handling donor data, this is worth considering once the
NGO has any income. Until then, the fallback JSON + UptimeRobot covers
the practical risk adequately.

### Summary: What to Actually Do

| Action | Cost | Effort | Impact |
|---|---|---|---|
| Migrate frontends from Netlify to Vercel | $0 | ~1 hour | 6,000 build min/month — effectively unlimited |
| Add UptimeRobot ping to Render | $0 | 10 minutes | Keeps Render warm, prevents Supabase pausing |
| Upgrade Render to Starter (optional) | $7/mo | 2 clicks | Guaranteed always-on, no cold starts |
| Implement content-fallback.json + App.jsx timeout | $0 | ~3 hours | Site works even if API/DB down |
| Add GitHub Actions daily fallback update | $0 | 30 minutes | Fallback stays ≤24h fresh |
| Fix View/Download bilingual in About.jsx | $0 | 2 minutes | 100% bilingual UI chrome |

Total new monthly cost: $0 (free Render + UptimeRobot) or $7 (Render Starter).
Total new dev time: ~4–5 hours.
Result: No quota issues, no cold starts, no blank site on DB outage, fully bilingual UI chrome.

---

## Part 4: Sentry Integration Review

Confirmed in `packages/web/src/main.jsx` (line 27112–27128):
- Sentry initialised conditionally on `VITE_SENTRY_DSN` env var. ✅
- `browserTracingIntegration()` enabled. ✅
- `tracesSampleRate` configurable via env (defaulting to 0.1). ✅
- Wrapped in `Sentry.ErrorBoundary` with fallback. ✅

**One issue:** The Sentry ErrorBoundary fallback is:
```jsx
fallback={<p>Something went wrong.</p>}
```
This renders a raw `<p>` tag with no styling — the site shows plain unstyled text
on a critical error. Replace with a proper fallback component:

```jsx
// packages/web/src/components/SentryFallback.jsx
export function SentryFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', minHeight: '100vh', padding: '2rem',
                  textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        We have been notified and are looking into it.
      </p>
      <a href="/" style={{ color: '#1a4f8a', textDecoration: 'underline' }}>
        Return to homepage
      </a>
    </div>
  )
}
```

**Also:** Add Sentry to `packages/api` for server-side error tracking:
```bash
npm install @sentry/node --workspace=packages/api
```

In `packages/api/src/app.js`, add before routes:
```js
import * as Sentry from '@sentry/node'
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 })
}
```
And add `Sentry.setupExpressErrorHandler(app)` after all routes.

This gives you server-side error visibility — currently you only have
frontend errors in Sentry.

**Sentry for admin panel:** The admin panel (`packages/admin`) does not have Sentry.
Since this is only used by 1–2 internal staff, it is low priority. But add it
with the same conditional pattern as the web frontend if you want full coverage.

---

## Final Checklist

| Item | Status |
|---|---|
| Complete customizability of all text | ✅ Done |
| Complete customizability of all images | ✅ Done |
| Bilingual UI chrome (View/Download) | 🟡 2-line fix in About.jsx |
| Frontend build quota (Netlify exhausted) | 🟡 Migrate to Vercel (~1 hour) |
| No cold starts on public site | 🟡 UptimeRobot free ping or Render $7/mo Starter |
| DB outage resilience | 🟡 content-fallback.json + GH Actions |
| Supabase project pausing prevention | 🟡 UptimeRobot free ping (same monitor) |
| Sentry frontend coverage | ✅ Done |
| Sentry fallback UI | 🟡 Replace `<p>Something went wrong` |
| Sentry API (server-side) | 🟡 Add @sentry/node to packages/api |
| E2E test coverage | ✅ Comprehensive suite exists |
