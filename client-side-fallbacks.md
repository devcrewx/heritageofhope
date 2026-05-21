# Client-Side Fallback Inventory — Heritage of Hope

**Purpose:** Document every fallback text, image, subsection, and document used on the frontend when the Supabase/API is unavailable.

---

## Fallback Architecture — Multi-Layer Chain

When the database or API is down, the system falls through layers in this order:

```
Supabase DB
   ↓  (query fails)
API stale in-memory cache (1 min TTL)
   ↓  (cache empty or expired)
API buildFallbackSiteContent() → staticContent.js (hardcoded EN/BN data)
   ↓  (API unreachable or returns partial data)
Client-side `||` operators in JSX → inline hardcoded values
   ↓  (all fallbacks exhausted)
resolve() returns ''  or  guard returns null (section hidden)
```

---

## Layer 1: API-Side Hardcoded Fallbacks

File: `packages/api/src/data/staticContent.js`

When the DB is down, the API `buildFallbackSiteContent()` function assembles a complete response from this static data. Everything the public site needs is covered:

| Section | Lines | What's Hardcoded |
|---------|-------|-----------------|
| **Nav items** | 7–15 | 7 nav items (Home, About, Our Work, Impact, Gallery, Get Involved, Contact) — bilingual |
| **Contact details** | 17–22 | Phone, email, address, Facebook URL |
| **Facebook posts** | 24–61 | 6 posts with dates, bilingual titles/excerpts, Cloudinary image URLs |
| **Impact metrics** | 63–68 | 4 metrics ("200+", "15+", "3+", "5+") — bilingual |
| **Showcase images** | 70–93 | Per-page sets: home (6), about (1), gallery (3), contact (4) — all Cloudinary URLs |
| **Documents** | 95–114 | 12A and 80G certificates with `pdfUrl: '#'` placeholder |
| **Our Work showcase** | 116–123 | 6 tile images — Cloudinary URLs |
| **Team members** | 125–129 | 3 members with generic photos |
| **Featured programs** | 131–180 | 6 programs with slugs, images, bilingual content — Cloudinary URLs |

**Coverage:** 100% of content sections are covered. If the DB is down but the API server is running, the public site functions with hardcoded but realistic data.

---

## Layer 2: Frontend Inline Fallbacks (`||` in JSX)

These are used when the API returns data but a specific field is missing/undefined, or when the entire API response is missing.

### Layout (`packages/web/src/components/Layout.jsx`)

| Line | Field | Fallback Value |
|------|-------|---------------|
| 34 | `siteMeta` | `{}` |
| 108 | Logo `alt` + brand name | `'Heritage of Hope Foundation'` |
| 110 | Logo image URL | `'https://res.cloudinary.com/.../profile_pic.webp'` |
| 112 | Brand name in header | `'Heritage of Hope Foundation'` |
| 113 | Nav subtitle | `'Registered NGO \| West Bengal'` / `'নিবন্ধিত সংস্থা \| পশ্চিমবঙ্গ'` |
| 123 | Hamburger aria-label | `'Open navigation'` / `'মেনু খুলুন'` |
| 133 | Nav aria-label | `'Primary navigation'` / `'প্রধান মেনু'` |
| 159 | Donate button | `'Donate Now'` / `'সহযোগিতার হাত বাড়িয়ে দিন'` |
| 169 | Footer org name | `'Heritage of Hope Foundation'` |
| 171 | Footer mission | Bilingual static text |
| 174 | Facebook URL | `'https://facebook.com/heritageofhope...'` |
| 178 | Facebook label | `'Follow us on Facebook'` / `'ফেসবুকে আমাদের সঙ্গে থাকুন'` |

### Home (`packages/web/src/pages/Home.jsx`)

| Line | Field | Fallback Value |
|------|-------|---------------|
| 22 | CTA primary label | `'Support a Program'` / `'সহায়তা করুন'` |
| 25 | CTA secondary label | `'Explore Our Work'` / `'আমাদের কাজ দেখুন'` |
| 49 | Cert caption | `'Registration proof available on About page'` / `'নিবন্ধনের প্রমাণ "আমাদের কথা" পাতায়'` |

### Contact (`packages/web/src/pages/Contact.jsx`)

| Line | Field | Fallback Value |
|------|-------|---------------|
| 32 | Phone meta label | `'Phone'` / `'ফোন'` |
| 38 | Email meta label | `'Email'` / `'ইমেল'` |
| 44 | Address meta label | `'Address'` / `'ঠিকানা'` |
| 53 | Map iframe title | `'Heritage of Hope Foundation location'` / `'হেরিটেজ অফ হোপ ফাউন্ডেশনের অবস্থান'` |
| 54 | Map embed URL | `'https://www.google.com/maps?q=...'` |
| 128 | Facebook button | `'Visit Official Facebook Page →'` / `'অফিসিয়াল ফেসবুক পেজ দেখুন →'` |

### Gallery (`packages/web/src/pages/Gallery.jsx`)

| Line | Field | Fallback Value |
|------|-------|---------------|
| 12 | Filter: All chip | `'All'` / `'সব'` |
| 13 | Filter: Education chip | `'Education'` / `'শিক্ষা'` |
| 14 | Filter: Healthcare chip | `'Healthcare'` / `'স্বাস্থ্য'` |
| 15 | Filter: Welfare chip | `'Welfare'` / `'কল্যাণ'` |
| 46 | Filter aria-label | `'Gallery categories'` / `'ছবির বিভাগ'` |

### Get Involved (`packages/web/src/pages/GetInvolved.jsx`)

| Line | Field | Fallback Value |
|------|-------|---------------|
| 36 | Bank section label | `'Bank details'` / `'ব্যাংক তথ্য'` |
| 42 | Cheque modal title | `'Specimen cheque'` / `'নমুনা চেক'` |
| 43 | Cheque button label | `'View specimen cheque'` / `'চেক দেখুন'` |

### Our Work (`packages/web/src/pages/OurWork.jsx`)

| Line | Field | Fallback Value |
|------|-------|---------------|
| 26 | Focus label | `'Focus areas'` / `'ফোকাস এরিয়া'` |

### Other Pages

| Page | Fallback Pattern |
|------|-----------------|
| About.jsx:9 | `about.pageContent \|\| {}` — all sub-fields safe through `resolve()` returning `''` |
| Impact.jsx:8 | `impact.pageContent \|\| {}` — same pattern |
| NotFound.jsx:6 | `siteContent?.notFound?.pageContent \|\| {}` — renders empty page with Layout shell |
| ThankYou.jsx:6 | `siteContent?.thankYou?.pageContent \|\| {}` — same pattern |

---

## Layer 3: Guarded Sections (Hidden When Data Missing)

These sections simply don't render if their data is empty — no crash, just a shorter page:

| Page | Section | Guard |
|------|---------|-------|
| Home | Trust badges | `home.trustBadges?.length > 0 ? ... : null` |
| Home | Impact metrics | `home.impactMetrics?.length > 0 ? ... : null` |
| Home | Featured programs | `home.featuredPrograms?.length > 0 ? ... : null` |
| Home | Facebook posts | `home.facebookPosts?.length > 0 ? ... : null` |
| Home | Showcase images | `home.showcaseImages?.length > 0 ? ... : null` |
| About | Documents | `documents?.length > 0 ? ... : null` |
| About | Core values | `about.values?.length > 0 ? ... : null` |
| About | Partners | `about.partners?.length > 0 ? ... : null` |
| About | Team members | `about.teamMembers?.length > 0 ? ... : null` |
| Contact | Facebook posts | `contact.facebookPosts?.length > 0 ? ... : null` |
| Contact | Mosaic images | `contact.mosaicImages?.length > 0 ? ... : null` |
| Gallery | Items | `gallery.items ? ... : []` (returns empty array) |
| Get Involved | Donation tiers | `getInvolved.donationTiers?.length > 0 ? ... : null` |
| Get Involved | Volunteer roles | `volunteer.roles?.length > 0 ? ... : null` (in dropdown) |
| Impact | Impact metrics | `impact.impactMetrics?.length > 0 ? ... : null` |
| Impact | Fund allocation | `impact.fundAllocation?.length > 0 ? ... : null` |
| Our Work | Showcase images | `ourWork.showcaseImages?.length > 0 ? ... : null` |
| Our Work | Focus tags | `ourWork.focusTags?.length > 0 ? ... : \|` (pipe separator) |
| Our Work | Approach steps | `approach.steps?.length > 0 ? ... : null` |

**Total guarded sections: 19** — all safe, none crash.

---

## Layer 4: `resolve()` i18n Function (`packages/web/src/utils/i18n.js`)

The `resolve(language, value)` function is the final safety net for all bilingual text:

```js
if (value === null || value === undefined) return ''        // null/undefined → ''
value[language] ?? value.en ?? value.bn                      // prefer language, fallback en→bn
typeof localized === 'string' || typeof localized === 'number' ? localized : ''
```

Every `resolve(language, page.heading)` call is guaranteed to return at least `''` — never `null`, never `undefined`, never crashes.

---

## Identified Gaps (Risky Fallbacks)

These are places where a failed API/Database call would result in a broken visual element:

### Broken Images (6 instances)

| # | File:Line | Missing Field | UI Impact |
|---|-----------|--------------|-----------|
| 1 | Home.jsx:40 | `hero.heroImage` | Hero section shows broken image |
| 2 | Home.jsx:46 | `hero.regCertThumb` | Cert thumbnail broken |
| 3 | About.jsx:180 | `registration.certImage` | Registration section broken image |
| 4 | GetInvolved.jsx:74 | `getInvolved.upiImage` | UPI QR code missing |
| 5 | GetInvolved.jsx:200 | `partnerSection.image` | Partner section photo missing |
| 6 | DocumentModal.jsx:54 | `downloadUrl` | Document preview image broken |

### English-Only Text (1 instance)

| # | File:Line | Issue |
|---|-----------|-------|
| 1 | web3forms.js:64 | `'Network error. Please try again.'` — hardcoded English only, no Bengali variant |

### Missing Client-Side Fallback File

| # | Detail |
|---|--------|
| 1 | `AGENTS.md` documents `packages/web/src/content.js` as a client-side fallback when API is unreachable — **this file does not exist**. When the API server itself is down (not just the DB), the public site enters an error state with no bundled fallback content to display. |

---

## API Health Check Reliability

**Before the fix:** `/api/health` returned `{ ok: true }` even when Postgres was disconnected — a misleading signal for Render's health checker.

**After the fix:** `/api/health` now pings the database via `prisma.$queryRaw\`SELECT 1\`` and returns:

| Scenario | Response |
|----------|----------|
| API + DB both up | `{ ok: true, database: "connected" }` |
| API up, DB down | `{ ok: false, database: "disconnected" }` |

Render's load balancer will see `ok: false` and automatically restart the service.

---

## Deploy Scenario Simulation

### Scenario: API running, DB down
1. API catches DB query errors
2. Returns `buildFallbackSiteContent()` — complete hardcoded content
3. Public site sees normal functioning pages with slightly stale/static data
4. No crashes, no broken UI (images use Cloudinary URLs which are CDN-independent)
5. Admin panel login fails (can't authenticate without DB) — users redirected to login

### Scenario: API server down
1. Frontend `loadSiteContent()` fetch fails
2. `contentError` state is set, `siteContent` stays `null`
3. Layout renders error screen with retry button — **no bundled fallback content**
4. This is the weak point: `content.js` does not exist despite being documented

### Scenario: API + DB both healthy
1. Normal operation, all data served from Supabase
2. In-memory cache refreshes every 60 seconds
3. 30-second frontend polling keeps the public site in sync

---

## Summary

| Metric | Count |
|--------|-------|
| Pages with safe empty-state rendering | 10/10 |
| Guarded sections (hidden when empty) | 19 |
| Inline text fallbacks (`\|\|`) | ~30 bilingual |
| Broken image risks | 6 |
| English-only text risks | 1 |
| Missing fallback file | 1 (`content.js`) |
| Full API outage fallback | **Partial** — API-side works, client-side needs `content.js` |

The app is **structurally safe** — no crash paths. The visual quality during an outage ranges from "normal" (DB down, API up) to "error screen with retry button" (API server itself down).
