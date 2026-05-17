# Admin Panel — Full Architecture & Build Plan
**Heritage of Hope Foundation Website**
Planned: May 2026

---

## Table of Contents

1. [Why Not WYSIWYG](#1-why-not-wysiwyg)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [What Is Editable — Full Inventory](#4-what-is-editable--full-inventory)
5. [Database Schema](#5-database-schema)
6. [API Design](#6-api-design)
7. [Admin Panel — Section by Section](#7-admin-panel--section-by-section)
8. [Authentication & Security](#8-authentication--security)
9. [Image & File Upload Flow](#9-image--file-upload-flow)
10. [Frontend Integration](#10-frontend-integration)
11. [Bilingual Content Strategy](#11-bilingual-content-strategy)
12. [Build Phases](#12-build-phases)
13. [File & Folder Structure](#13-file--folder-structure)
14. [Environment Variables](#14-environment-variables)
15. [Deployment Plan](#15-deployment-plan)

---

## 1. Why Not WYSIWYG

A WYSIWYG editor (TipTap, Quill, Slate) lets users author arbitrary HTML.
For this site that is the wrong tool because:

- Every section is a **typed component** — a stat card, a document card, a donation tier.
  The client does not need to author HTML. They need to update specific values inside
  pre-designed components.
- A WYSIWYG editor would let them accidentally break font sizes, paste raw HTML,
  delete wrapper divs, or destroy the visual hierarchy.
- The site has a consistent design system. A free-form editor bypasses it entirely.

**Use structured field editing instead.**
Each editable item is a typed field: `text`, `number`, `image_upload`, `pdf_upload`,
`url`, `toggle`, `richtext` (only for the 2–3 fields that genuinely need paragraph text).
The frontend always renders the same React components — just with different data from
the database. The client never sees HTML.

This is the same model Sanity and Contentful use. You are building a lightweight
custom version of it, purpose-built for exactly this site's structure.

---

## 2. System Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   Public website        │     │   Admin panel           │
│   React + Vite          │     │   React + Vite          │
│   heritageofhope.org    │     │   admin.heritageofhope  │
│                         │     │   .org  (or /admin)     │
└────────────┬────────────┘     └────────────┬────────────┘
             │  HTTPS GET                    │  HTTPS GET/POST/PATCH/DELETE
             │  (public API)                 │  (protected API, JWT required)
             ▼                               ▼
┌────────────────────────────────────────────────────────┐
│              Express.js REST API                       │
│              node/src — hosted on Railway (free tier)  │
│                                                        │
│  Middleware stack:                                     │
│  cors → helmet → rate-limit → json → jwt-verify        │
│  (jwt-verify only on /admin/* routes)                  │
└──────────────┬────────────────────────┬────────────────┘
               │                        │
               ▼                        ▼
┌──────────────────────┐   ┌────────────────────────────┐
│  PostgreSQL          │   │  Cloudinary                │
│  Supabase free tier  │   │  Images + PDFs             │
│  (500MB, generous    │   │  25GB free storage         │
│  for this use case)  │   │  Auto-resize, WebP convert │
└──────────────────────┘   └────────────────────────────┘
```

### Why two separate frontends

The admin panel should live at a different subdomain or route from the public site.
This means:

- The admin panel JS bundle is **never served to public visitors**.
  No chance of accidental exposure of admin UI code.
- The public site build stays lean and fast.
- Netlify can serve both from the same repository via separate build configs.

Recommended: `admin.heritageofhopefoundation.org` or `/admin` path with a separate
Netlify site pointed at `packages/admin`.

---

## 3. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Public frontend | React 18 + Vite + Tailwind | Already built |
| Admin frontend | React 18 + Vite + Tailwind + **React Hook Form** | Consistent with public site; RHF for all forms |
| Admin UI components | **shadcn/ui** (free, copy-paste) | Pre-built form fields, dialogs, tables, toasts |
| API server | **Express.js** on Node 20 | Simple, well-known, zero config |
| ORM | **Prisma** | Type-safe DB access, auto-migration, great DX |
| Database | **PostgreSQL on Supabase** (free tier) | Hosted, 500MB, real Postgres, no ops overhead |
| Auth | **JWT** (jsonwebtoken) + **bcrypt** | No third-party auth needed for 1–3 admin users |
| File upload | **Multer** (server) + **Cloudinary SDK** | Handles multipart uploads, stores to CDN |
| PDF upload | Same Cloudinary pipeline | Cloudinary supports PDF as `raw` resource type |
| Email (forms) | **Nodemailer** + Gmail App Password | Free, reliable for low volume |
| Deployment — API | **Railway** (free tier, $5 credit/month) | Always-on Node server, no cold starts |
| Deployment — Admin | **Netlify** (same account as public site) | Second site, free tier |
| Deployment — DB | **Supabase** (free tier) | Included in stack |

### Estimated running cost
| Service | Cost |
|---|---|
| Railway (API server) | $0–5/month (within free credit) |
| Supabase (database) | $0/month (free tier) |
| Cloudinary (media) | $0/month (free tier) |
| Netlify (both frontends) | $0/month |
| **Total** | **$0–5/month** |

---

## 4. What Is Editable — Full Inventory

Mapped from all 7 pages of the live site.

### Home page
| Field | Type | Notes |
|---|---|---|
| Eyebrow label ("LIGHTING LIVES…") | text | Short caps label |
| Hero headline | text | Large display heading |
| Hero intro paragraph | text | 1–2 sentences |
| Trust badges | text × 3 | "Registered NGO", "Est. 2024", "Govt. of West Bengal" |
| Stats: 4 numbers | number × 4 | 200+, 15+, 3+, 5+ |
| Stats: 4 labels | text × 4 | "children supported" etc. |
| Stats section eyebrow | text | "OUR FOOTPRINT SO FAR" |
| Mission section heading | text | "What we do on the ground" |
| Mission photo grid | image × 6 | The 6 program photos in the 2×3 grid |
| Donation CTA headline | text | "Your small gift creates big change." |
| Donation CTA body | text | Supporting sentence |
| Activity feed posts | post[] | See activity_posts table |

### About page
| Field | Type | Notes |
|---|---|---|
| Page title | text | "Rooted in community. Driven by impact." |
| Page intro | text | 1–2 sentences |
| Hero photo | image | Group/team photo right side |
| Our story body | richtext | 2–4 paragraphs |
| Mission statement | text | 1 sentence |
| Vision statement | text | 1 sentence |
| Core values | value[] | 4 cards: title + description each |
| Team members | member[] | Photo + name + role, n entries |
| Documents | document[] | 6 slots: title, date, description, pdf, view/download |
| Partners list | partner[] | Name + logo, n entries |
| Registration section body | text | Short paragraph |
| Registration certificate image | image | The scanned cert shown on page |

### Our Work page
| Field | Type | Notes |
|---|---|---|
| Page intro | text | "Initiatives designed for real-world impact." |
| Focus tags | text[] | "Education", "Healthcare", "Welfare" |
| Program photos | image × 6 | The 2-row 3-column photo grid |
| Approach heading | text | "How we execute programs" |
| Approach steps | text[] | 4 numbered steps |
| Join the mission box | text | Body text + button label |

### Impact page
| Field | Type | Notes |
|---|---|---|
| Page headline | text | "Transparency and measurable change." |
| Stats | shared with Home | Same 4 stats — single source of truth |
| Fund allocation | allocation[] | Category + % — must sum to 100 |
| Community feedback quote | text | The testimonial paragraph |
| Annual report text | text | The "being compiled" notice |

### Gallery page
| Field | Type | Notes |
|---|---|---|
| Gallery photos | gallery_item[] | URL + category tag + display order |
| Filter categories | text[] | "Education", "Healthcare", "Welfare" |
| Each photo alt text | text | For accessibility + SEO |

### Get Involved page
| Field | Type | Notes |
|---|---|---|
| Page headline | text | "Join us in making a difference." |
| Page intro | text | 1–2 sentences |
| Donation tiers | tier[] | 4 rows: amount (₹) + label |
| UPI QR code image | image | The Google Pay QR photo |
| Bank: account name | text | "Heritage of Hope Foundation" |
| Bank: bank name | text | "State Bank of India, Ruby Park Branch" |
| Bank: account number | text | "43107075580" |
| Bank: IFSC | text | "SBIN0008438" |
| Volunteer heading | text | "People matter more than perfection" |
| Volunteer role cards | role[] | 5 cards: title + description |
| Partner section body | text | Short pitch |
| Partner section image | image | The partnership photo |

### Contact page
| Field | Type | Notes |
|---|---|---|
| Phone | text | "+91 08420119790" |
| Email | text | "heritageofhopefoundation@gmail.com" |
| Address | text | Full address string |
| Facebook page URL | url | Link used by "Visit Official Facebook Page" button |
| Contact Facebook posts | post[] | 3 posts shown — same activity_posts table |

---

## 5. Database Schema

```sql
-- Key-value store for singleton page content
-- (hero text, mission, vision, donation CTA, etc.)
CREATE TABLE site_content (
  id          SERIAL PRIMARY KEY,
  page        VARCHAR(50)  NOT NULL,  -- 'home', 'about', 'contact' etc.
  section     VARCHAR(100) NOT NULL,  -- 'hero', 'stats', 'cta' etc.
  field_key   VARCHAR(100) NOT NULL,  -- 'headline', 'body', 'eyebrow' etc.
  value_en    TEXT,
  value_bn    TEXT,
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(page, section, field_key)
);

-- Shared impact stats (used on both Home and Impact pages)
CREATE TABLE impact_stats (
  id         SERIAL PRIMARY KEY,
  value      VARCHAR(20) NOT NULL,  -- "200+", "15+" etc.
  label_en   VARCHAR(100) NOT NULL,
  label_bn   VARCHAR(100),
  sort_order INTEGER DEFAULT 0
);

-- Gallery photos
CREATE TABLE gallery_items (
  id         SERIAL PRIMARY KEY,
  url        TEXT NOT NULL,          -- Cloudinary URL
  public_id  TEXT NOT NULL,          -- Cloudinary public_id for deletion
  alt_en     VARCHAR(200),
  alt_bn     VARCHAR(200),
  category   VARCHAR(50),            -- 'education', 'healthcare', 'welfare'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents (trust cert, 12A, 80G, DARPAN, CSR, awards)
CREATE TABLE documents (
  id          SERIAL PRIMARY KEY,
  title_en    VARCHAR(200) NOT NULL,
  title_bn    VARCHAR(200),
  description_en TEXT,
  description_bn TEXT,
  date        DATE,
  pdf_url     TEXT,                  -- Cloudinary raw URL
  pdf_public_id TEXT,
  preview_img_url TEXT,              -- Optional thumbnail
  sort_order  INTEGER DEFAULT 0
);

-- Team members
CREATE TABLE team_members (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role_en    VARCHAR(100),
  role_bn    VARCHAR(100),
  photo_url  TEXT,
  photo_public_id TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Core values (4 cards on About page)
CREATE TABLE core_values (
  id           SERIAL PRIMARY KEY,
  title_en     VARCHAR(100) NOT NULL,
  title_bn     VARCHAR(100),
  description_en TEXT,
  description_bn TEXT,
  sort_order   INTEGER DEFAULT 0
);

-- Partners
CREATE TABLE partners (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  logo_url    TEXT,
  logo_public_id TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INTEGER DEFAULT 0
);

-- Donation tiers
CREATE TABLE donation_tiers (
  id         SERIAL PRIMARY KEY,
  amount     INTEGER NOT NULL,      -- in INR, e.g. 199
  label_en   VARCHAR(200) NOT NULL,
  label_bn   VARCHAR(200),
  sort_order INTEGER DEFAULT 0
);

-- Fund allocation (pie/bar chart on Impact page)
CREATE TABLE fund_allocation (
  id           SERIAL PRIMARY KEY,
  category_en  VARCHAR(100) NOT NULL,
  category_bn  VARCHAR(100),
  percentage   INTEGER NOT NULL,    -- must sum to 100 across all rows
  sort_order   INTEGER DEFAULT 0
);

-- Volunteer role cards
CREATE TABLE volunteer_roles (
  id             SERIAL PRIMARY KEY,
  title_en       VARCHAR(100) NOT NULL,
  title_bn       VARCHAR(100),
  description_en TEXT,
  description_bn TEXT,
  sort_order     INTEGER DEFAULT 0
);

-- Activity feed posts (used on Home and Contact pages)
CREATE TABLE activity_posts (
  id         SERIAL PRIMARY KEY,
  date       DATE NOT NULL,
  title_en   VARCHAR(200) NOT NULL,
  title_bn   VARCHAR(200),
  body_en    TEXT,
  body_bn    TEXT,
  photo_url  TEXT,
  photo_public_id TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users (1–3 people max)
CREATE TABLE admin_users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(200) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) DEFAULT 'editor',  -- 'superadmin' | 'editor'
  created_at    TIMESTAMP DEFAULT NOW(),
  last_login    TIMESTAMP
);

-- Audit log (optional but recommended)
CREATE TABLE audit_log (
  id          SERIAL PRIMARY KEY,
  admin_id    INTEGER REFERENCES admin_users(id),
  action      VARCHAR(100),   -- 'UPDATE', 'DELETE', 'UPLOAD' etc.
  table_name  VARCHAR(100),
  record_id   INTEGER,
  note        TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 6. API Design

### Public routes (no auth required)
```
GET  /api/content/:page          → all site_content for a page
GET  /api/stats                  → impact_stats
GET  /api/gallery                → gallery_items (sorted)
GET  /api/documents              → documents list
GET  /api/team                   → team_members
GET  /api/values                 → core_values
GET  /api/partners               → active partners
GET  /api/donation-tiers         → donation_tiers
GET  /api/fund-allocation        → fund_allocation
GET  /api/volunteer-roles        → volunteer_roles
GET  /api/activity-posts         → published activity_posts
POST /api/forms/contact          → save + email contact form
POST /api/forms/volunteer        → save + email volunteer form
POST /api/forms/partner          → save + email partner inquiry
```

### Protected routes (JWT required — admin only)
```
POST   /api/admin/login

PATCH  /api/admin/content/:page/:section/:field_key
PATCH  /api/admin/stats/:id
POST   /api/admin/stats
DELETE /api/admin/stats/:id

POST   /api/admin/gallery         (multipart — photo upload)
PATCH  /api/admin/gallery/:id     (reorder, category, alt text)
DELETE /api/admin/gallery/:id     (also deletes from Cloudinary)

POST   /api/admin/documents       (multipart — PDF + optional preview)
PATCH  /api/admin/documents/:id
DELETE /api/admin/documents/:id

POST   /api/admin/team            (multipart — photo upload)
PATCH  /api/admin/team/:id
DELETE /api/admin/team/:id
PATCH  /api/admin/team/reorder    (bulk sort_order update)

PATCH  /api/admin/values/:id
PATCH  /api/admin/values/reorder

POST   /api/admin/partners        (multipart — logo upload)
PATCH  /api/admin/partners/:id
DELETE /api/admin/partners/:id

PATCH  /api/admin/donation-tiers/:id
POST   /api/admin/donation-tiers
DELETE /api/admin/donation-tiers/:id

PATCH  /api/admin/fund-allocation/:id    (validate sum = 100)
PATCH  /api/admin/fund-allocation/batch  (update all at once)

PATCH  /api/admin/volunteer-roles/:id

POST   /api/admin/activity-posts         (multipart — photo)
PATCH  /api/admin/activity-posts/:id
DELETE /api/admin/activity-posts/:id
PATCH  /api/admin/activity-posts/reorder

GET    /api/admin/forms/submissions      (view contact/volunteer/partner inbox)
GET    /api/admin/audit-log
POST   /api/admin/users/change-password
```

---

## 7. Admin Panel — Section by Section

### 7.1 Login screen

Single page, no sidebar.

Fields: Email, Password, "Sign in" button.
On success: store JWT in `localStorage`, redirect to `/admin/dashboard`.
On failure: show inline error ("Invalid credentials").
No "Forgot password" flow needed — superadmin resets via database directly for now.

---

### 7.2 Dashboard home `/admin`

Layout: sidebar (persistent) + main content area.

**Sidebar items:**
- Dashboard
- Site Settings
- Home Page
- About Page
- Our Work
- Impact
- Gallery
- Get Involved
- Contact
- Activity Posts
- Form Submissions
- Change Password
- Sign Out

**Dashboard content:**
- "Last updated" timestamp per page section
- Quick stats: gallery photo count, document count, post count
- Any pending form submissions (badge count)

---

### 7.3 Site Settings `/admin/settings`

Simple vertical form. Fields:

- NGO name (text)
- Tagline shown in navbar subtitle (text)
- Phone number (text)
- Email address (text)
- Address (textarea)
- Facebook page URL (url)
- "Registered NGO" badge text (text)
- Est. year (text)
- Footer mission line (text)

Save button at bottom. Single PATCH call to `site_content` for each field.

---

### 7.4 Home Page Editor `/admin/home`

Divided into collapsible accordion sections:

**Hero section:**
- Eyebrow label (text input)
- Headline (text input, large)
- Intro paragraph (textarea)
- Trust badge 1, 2, 3 (3 text inputs)
- [Save Hero]

**Impact Stats:**
Table with 4 rows. Each row: value input + EN label input + BN label input.
Add row button. Delete row button.
[Save Stats]

**Mission section:**
- Section heading (text input)
- 6 image slots for the photo grid. Each: current image preview + "Replace image" upload button.
[Save Images]

**Donation CTA:**
- CTA headline (text input)
- CTA body (textarea)
[Save CTA]

---

### 7.5 About Page Editor `/admin/about`

**Page intro:**
- Title (text input)
- Intro paragraph (textarea)
- Hero photo (image upload with preview)
[Save]

**Our Story:**
- Body text (richtext — TipTap minimal: bold, italic, paragraph, bullet list only)
  This is one of the only 3 fields that uses richtext.
[Save Story]

**Mission & Vision:**
- Mission statement (text input)
- Vision statement (text input)
[Save]

**Core Values:**
4 card rows. Each: EN title, BN title, EN description, BN description.
Fixed 4 rows — no add/delete (the design always shows 4).
[Save Values]

**Team Members:**
Dynamic list. Each entry:
- Photo (image upload with preview, 400×400 crop)
- Name (text input)
- Role EN (text input)
- Role BN (text input)
- Delete button
Add member button at bottom.
Drag handles for reordering.
[Save Team]

**Documents:**
6 fixed slots. Each slot:
- Title EN / BN (text inputs)
- Date (date picker)
- Description EN / BN (textarea)
- PDF file (upload button — shows current filename if uploaded)
- Preview image (optional upload)
[Save Documents]

**Partners:**
Dynamic list. Each entry:
- Logo (image upload, shown as small preview)
- Name (text input)
- Active toggle
- Delete button
Add partner button.
[Save Partners]

---

### 7.6 Impact Editor `/admin/impact`

**Stats:** Shared component — same UI as Home stats. Editing here updates both pages.
Note: show "These stats also appear on the Home page" in a callout.

**Fund Allocation:**
4 rows (fixed). Each: category EN, category BN, percentage (number input).
Running total shown live: "Total: 95% — must equal 100%".
Save button disabled if total ≠ 100.
[Save Allocation]

**Community Feedback:**
- Quote text EN (textarea)
- Quote text BN (textarea)
[Save]

**Annual Report:**
- Body text EN (textarea)
- Body text BN (textarea)
[Save]

---

### 7.7 Gallery Manager `/admin/gallery`

Layout: grid of photo cards + upload panel.

**Upload area:**
Drag-and-drop zone or click-to-browse.
Accepts: JPG, PNG, WebP. Max 5MB per file. Multi-file upload supported.
After upload: each new photo appears with fields:
- Category dropdown (Education / Healthcare / Welfare)
- Alt text EN (text input)
- Alt text BN (text input)
[Save all new photos]

**Existing photos:**
Masonry or uniform grid. Each card:
- Photo thumbnail
- Category badge
- Edit button (opens inline: change category, alt text)
- Delete button (with confirm dialog: "This will permanently delete the photo. Are you sure?")

**Reorder:**
"Reorder mode" toggle. When active, drag-and-drop handles appear.
[Save order]

---

### 7.8 Get Involved Editor `/admin/get-involved`

**Donation Tiers:**
4 rows (can add/delete). Each: ₹ amount (number) + label EN + label BN.
[Save Tiers]

**UPI / Payment:**
- UPI QR image (image upload with large preview — must be scannable)
- "Pay via UPI app" button deep link URL (text input)
[Save Payment]

**Bank Details:**
4 text fields: Account name, Bank name + branch, Account number, IFSC.
[Save Bank Details]

**Volunteer Section:**
- Section heading EN / BN (text inputs)
- 5 volunteer role cards. Each: title EN/BN + description EN/BN.
[Save Volunteer]

**Partner Section:**
- Section heading EN / BN
- Body text EN / BN (textarea)
- Partnership photo (image upload with preview)
[Save Partner Section]

---

### 7.9 Activity Posts `/admin/activity-posts`

This section manages the feed shown on Home ("Stories, updates and event photos")
and Contact ("Recent moments from the page").

**Post list:**
Table view. Columns: Date | Title | Published | Actions (Edit / Delete).
Sorted by date descending.

**Add / Edit post (modal or drawer):**
Fields:
- Date (date picker)
- Title EN (text input)
- Title BN (text input)
- Body EN (textarea)
- Body BN (textarea)
- Photo (image upload with preview)
- Published toggle (unpublished posts are hidden on the public site)
[Save Post]

**Delete:** Confirm dialog. Also deletes photo from Cloudinary.

---

### 7.10 Form Submissions Inbox `/admin/submissions`

View-only table. Tabs: Contact | Volunteer | Partner Inquiry.

Each row: Date | Name | Email | Subject/Role/OrgName | Message preview | "View full" button.
"View full" opens a modal with all fields.
No reply-from-admin needed — the client replies via their email client.

---

### 7.11 Change Password `/admin/change-password`

Fields: Current password | New password | Confirm new password.
Validates: new ≠ current, min 8 chars, passwords match.
PATCH `/api/admin/users/change-password`.

---

## 8. Authentication & Security

### Login flow
1. Admin submits email + password to `POST /api/admin/login`
2. Server fetches user by email, runs `bcrypt.compare(password, hash)`
3. On success: returns `{ token: JWT, expiresIn: '7d' }`
4. Admin frontend stores token in `localStorage`
5. Every subsequent admin request includes `Authorization: Bearer <token>`
6. Express middleware `verifyJWT` validates on every `/api/admin/*` route

### JWT payload
```json
{
  "sub": 1,
  "email": "admin@heritageofhope.org",
  "role": "superadmin",
  "iat": 1716000000,
  "exp": 1716604800
}
```

### Security rules
- Passwords hashed with `bcrypt` (cost factor 12)
- JWT secret stored in `.env`, never committed to git
- Admin routes return `401` for missing/invalid token
- Admin routes return `403` for insufficient role
- Rate limit login endpoint: 5 attempts per 15 minutes per IP
- HTTPS enforced on all deployed endpoints
- CORS restricted to `heritageofhopefoundation.org` and `admin.heritageofhopefoundation.org`
- Cloudinary upload from server only — never expose Cloudinary credentials to the browser
- All form inputs sanitized with `express-validator` before DB write
- PDF and image uploads scanned for MIME type mismatch (Multer + file-type library)

---

## 9. Image & File Upload Flow

```
Browser (admin panel)
  │
  │  POST /api/admin/gallery  (multipart/form-data)
  │  file: <binary>
  │  category: "education"
  │  alt_en: "Children at Kishalaya Pathsala"
  ▼
Express server (Multer)
  │  Stores file in memory (memoryStorage — no disk write)
  │
  ▼
Cloudinary SDK
  │  cloudinary.uploader.upload_stream(buffer, {
  │    folder: "heritage-of-hope/gallery",
  │    resource_type: "image",
  │    transformation: [{ width: 1200, crop: "limit" }, { quality: "auto:good" }]
  │  })
  │
  ▼
Cloudinary returns { secure_url, public_id }
  │
  ▼
PostgreSQL INSERT into gallery_items
  (url: secure_url, public_id: public_id, ...)
  │
  ▼
API returns { id, url, ... } to admin panel
  │
  ▼
Admin panel shows new photo in grid ✓
```

### Deletion flow
```
DELETE /api/admin/gallery/:id
  → fetch public_id from DB
  → cloudinary.uploader.destroy(public_id)
  → DELETE from gallery_items WHERE id = :id
  → return { deleted: true }
```

### PDF upload (for documents)
Same flow. Cloudinary resource_type: `"raw"` for PDFs.
Folder: `heritage-of-hope/documents`.
No transformation applied (PDFs served as-is).

### Image size recommendations (enforced server-side)
| Type | Max upload size | Cloudinary transformation |
|---|---|---|
| Gallery photo | 8MB | width 1200, quality auto |
| Team headshot | 4MB | width 400, height 400, crop fill, gravity face |
| Document preview | 4MB | width 600, quality auto |
| Hero photos | 8MB | width 1920, quality auto |
| Partner logos | 2MB | width 300, quality auto |
| UPI QR code | 2MB | width 600, quality 100 (no compression — must be scannable) |

---

## 10. Frontend Integration

### How the public site reads from the API

Replace all hardcoded content objects in `content.js` with API calls.

```js
// Before (hardcoded)
export const heroContent = {
  headline: "Education, healthcare and dignity...",
  intro: "Heritage of Hope Foundation works across..."
}

// After (API-driven)
// web/src/hooks/usePageContent.js
export function usePageContent(page) {
  const [content, setContent] = useState({})
  useEffect(() => {
    fetch(`${API_BASE}/api/content/${page}`)
      .then(r => r.json())
      .then(data => setContent(flattenContent(data)))
  }, [page])
  return content
}
```

### Language-aware content

The public site already has a language toggle. After this change:

```js
const { lang } = useLanguage()  // 'en' | 'bn'

// API returns both languages
// { headline_en: "...", headline_bn: "..." }

const headline = content[`headline_${lang}`] || content.headline_en
```

### Caching strategy

The public site should cache API responses for performance.
Use `stale-while-revalidate` pattern:

```js
// Content changes rarely — cache for 5 minutes, revalidate in background
const CACHE_TTL = 5 * 60 * 1000

// Or use React Query for elegant cache management:
import { useQuery } from '@tanstack/react-query'

const { data } = useQuery({
  queryKey: ['content', 'home'],
  queryFn: () => fetch('/api/content/home').then(r => r.json()),
  staleTime: 5 * 60 * 1000,
})
```

---

## 11. Bilingual Content Strategy

Every content table has `_en` and `_bn` field pairs.
The admin panel shows both language fields side by side for every text field.

Layout in admin forms:
```
[ English                    ] [ বাংলা                      ]
  Hero headline (EN)             Hero headline (BN)
```

### Required vs optional Bengali fields
Some fields are required in both languages. Some are English-only acceptable.

| Section | Bengali required |
|---|---|
| Hero headline + intro | Yes |
| Stats labels | Yes |
| Program descriptions | Yes |
| Donation tier labels | Yes |
| Activity post title + body | Yes |
| Document title | Yes |
| Team member role | Yes |
| Alt text for images | Recommended, not required |
| Bank details | No (numbers are language-agnostic) |
| IFSC, account number | No |

The admin panel should show a yellow border on BN fields that are empty
when their EN counterpart is filled — a gentle reminder, not a blocker.

---

## 12. Build Phases

### Phase 1 — Backend foundation (Week 1)
- [x] Initialise Express project at `packages/api`
- [x] Set up Prisma with all schema tables
- [x] Connect to Supabase Postgres (pooler endpoint)
- [x] Implement all public GET routes (replaces hardcoded `content.js`)
- [x] Seed database with current site content
- [x] Deploy API (to Render instead of Railway — free tier, always-on)
- [x] Update public site to read from API (replace `content.js` calls)
- [x] Verify public site works end-to-end with real data

### Phase 2 — Auth + admin shell (Week 1–2)
- [x] Implement `POST /api/admin/login` with JWT
- [x] Implement `verifyJWT` middleware (hardened across all admin routes)
- [x] Create first admin user via seed script (admin@heritageofhope.org / Welcome@123)
- [x] Initialise admin panel project at `packages/admin`
- [x] Build login screen
- [x] Build persistent sidebar + layout
- [x] Build Dashboard home
- [x] Wire JWT storage + logout

### Phase 3 — Text content editors (Week 2)
- [x] Site Settings page
- [x] Home page editor (hero, stats, CTA) — API routes exist, tested via PATCH
- [x] About page editor (story, mission/vision, values)
- [x] Impact editor (stats shared, fund allocation, testimonial)
- [x] Get Involved editor (donation tiers, bank details, volunteer section)
- [x] Contact editor (phone, email, address)
- [x] All PATCH API routes for text content — implemented for all pages
- [x] Bilingual field pairs for all above

### Phase 4 — Media management (Week 3)
- [x] Cloudinary account setup + API keys in `.env` (set on Render)
- [x] Multer + Cloudinary upload pipeline (working, tested)
- [x] Gallery manager (upload, category, alt text, delete, reorder) — tested end-to-end
- [x] Team member photo upload — API route implemented
- [x] Document PDF upload + preview image — API route implemented
- [x] Partner logo upload — API route implemented
- [x] Activity post photo upload — API route implemented
- [x] Hero photo replacement (Home, About, Our Work, Get Involved)
- [x] UPI QR code upload

### Phase 5 — Rich list editors (Week 3–4)
- [x] Activity posts (add, edit, delete, publish toggle, reorder) — API routes exist
- [x] Team members (add, delete, reorder) — API routes exist
- [x] Documents (all 6 slots editable) — API routes exist
- [x] Partners (add, delete, active toggle, reorder) — API routes exist
- [x] Volunteer roles (5 cards editable) — API routes exist

### Phase 6 — Form submissions inbox (Week 4)
- [x] Contact form submissions table — GET /api/admin/forms/submissions implemented
- [x] Volunteer form submissions table — same endpoint handles all types
- [x] Partner inquiry submissions table — same endpoint handles all types
- [ ] Nodemailer email notification on new submission — NOT VERIFIED (using Web3Forms fallback)

### Phase 7 — Polish + deploy (Week 4–5)
- [ ] Audit log for all admin write operations — schema exists, usage unknown
- [x] Change password flow — POST /api/admin/users/change-password implemented
- [x] Input validation on all admin form fields
- [x] Error states, loading states, success toasts throughout
- [x] Confirm dialogs on all delete actions
- [x] Deploy admin panel to Netlify — live at rococo-sherbet-6244e2.netlify.app
- [x] Set up admin subdomain — separate Netlify site (subdomain TBD)
- [x] Final end-to-end test: public site reflects every admin change — verified via E2E tests
- [ ] Handoff: write 1-page "How to use the admin panel" guide for client — NOT STARTED

---

## 13. File & Folder Structure

```
heritage-of-hope/
├── packages/
│   ├── web/                     ← Public website (already exists)
│   │   └── src/
│   │       ├── hooks/
│   │       │   └── usePageContent.js   ← new
│   │       └── ...
│   │
│   ├── admin/                   ← Admin panel (new)
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── Login.jsx
│   │       │   ├── Dashboard.jsx
│   │       │   ├── Settings.jsx
│   │       │   ├── HomeEditor.jsx
│   │       │   ├── AboutEditor.jsx
│   │       │   ├── ImpactEditor.jsx
│   │       │   ├── GalleryManager.jsx
│   │       │   ├── GetInvolvedEditor.jsx
│   │       │   ├── ActivityPosts.jsx
│   │       │   └── Submissions.jsx
│   │       ├── components/
│   │       │   ├── Layout.jsx          ← sidebar + header shell
│   │       │   ├── BilingualField.jsx  ← EN+BN field pair
│   │       │   ├── ImageUploader.jsx   ← drag-drop upload
│   │       │   ├── PdfUploader.jsx
│   │       │   ├── SortableList.jsx    ← drag-to-reorder
│   │       │   └── ConfirmDialog.jsx
│   │       ├── hooks/
│   │       │   ├── useAuth.js
│   │       │   └── useApi.js
│   │       └── lib/
│   │           └── api.js             ← fetch wrapper with JWT header
│   │
│   └── api/                     ← Express server (new)
│       └── src/
│           ├── routes/
│           │   ├── public/
│           │   │   ├── content.js
│           │   │   ├── gallery.js
│           │   │   ├── documents.js
│           │   │   └── forms.js
│           │   └── admin/
│           │       ├── auth.js
│           │       ├── content.js
│           │       ├── gallery.js
│           │       ├── documents.js
│           │       ├── team.js
│           │       ├── partners.js
│           │       ├── posts.js
│           │       └── submissions.js
│           ├── middleware/
│           │   ├── verifyJWT.js
│           │   ├── uploadMiddleware.js ← Multer config
│           │   └── validateInput.js
│           ├── lib/
│           │   ├── cloudinary.js
│           │   ├── mailer.js
│           │   └── prisma.js
│           ├── prisma/
│           │   └── schema.prisma
│           └── index.js
│
├── .env.example
└── package.json                 ← monorepo root (pnpm workspaces)
```

---

## 14. Environment Variables

```bash
# packages/api/.env

# Database
DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DB?schema=public"

# JWT
JWT_SECRET="a-long-random-string-change-this"
JWT_EXPIRY="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Gmail App Password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="heritageofhopefoundation@gmail.com"
SMTP_PASS="your-gmail-app-password"
NOTIFY_EMAIL="heritageofhopefoundation@gmail.com"

# CORS origins
ALLOWED_ORIGINS="https://heritageofhopefoundation.org,https://admin.heritageofhopefoundation.org"

# Environment
NODE_ENV="production"
PORT=3001
```

```bash
# packages/web/.env
VITE_API_BASE="https://api.heritageofhopefoundation.org"
```

```bash
# packages/admin/.env
VITE_API_BASE="https://api.heritageofhopefoundation.org"
```

---

## 15. Deployment Plan

| Service | What deploys | How |
|---|---|---|
| Render | `packages/api` | Connect GitHub → auto-deploy on push to `main` (service deployed on Render) |
| Netlify site 1 | `packages/web` | Existing — already live |
| Netlify site 2 | `packages/admin` | New Netlify site, same repo, base dir = `packages/admin` |
| Supabase | PostgreSQL | Hosted, connect via `DATABASE_URL` |
| Cloudinary | Media storage | API credentials in Render environment variables |

### Custom domains
| Domain | Points to |
|---|---|
| `heritageofhopefoundation.org` | Netlify site 1 |
| `admin.heritageofhopefoundation.org` | Netlify site 2 |
| `api.heritageofhopefoundation.org` | Railway service |

### First admin user creation
After deploy, run once via Railway console:
```bash
node scripts/createAdmin.js \
  --email admin@heritageofhopefoundation.org \
  --password "choose-a-strong-one"
```
This hashes the password and inserts into `admin_users`.

---

## Client Handoff Checklist

Before handing over to the NGO team:
- [ ] Admin login credentials delivered securely (not over email) — PENDING
- [ ] 1-page "How to update the website" PDF written for the client — PENDING
- [x] All existing site content seeded into database correctly — seed.js run
- [x] All existing photos uploaded to Cloudinary and linked — completed via bulk Cloudinary relink on 2026-05-17
- [ ] All 6 documents (trust cert, DARPAN, 12A, 80G, CSR, awards) uploaded as PDFs — PENDING
- [ ] Client has tested: updating a stat, uploading a gallery photo, adding an activity post — PENDING
- [ ] Client knows: change password on first login — PENDING (no docs yet)
- [ ] Developer contact noted for bug reports — PENDING

---

*Document prepared for Heritage of Hope Foundation website project.*
*Admin panel to be built as a companion to the existing public site.*

## 16. Current project status (updated 2026-05-17)

Summary: most feature work and deploys are complete. Remaining items below were verified against the repo and deployment actions performed on 2026-05-17.

- [ ] Nodemailer email notification on new form submission — NOT VERIFIED (Web3Forms fallback currently in use)
- [ ] Audit log: schema exists but full audit logging of all admin write operations not enabled/verified
- [ ] 1-page "How to use the admin panel" guide for the client — NOT STARTED
- [ ] Deliver admin login credentials to client securely — PENDING
- [x] Ensure all existing photos uploaded to Cloudinary and linked in DB — completed via bulk upload and verification on 2026-05-17
- [ ] Upload all 6 official documents (trust cert, DARPAN, 12A, 80G, CSR, awards) as PDFs — PENDING
- [ ] Client verification: test updating a stat, uploading a gallery photo, adding an activity post — PENDING (recommended step)
- [ ] Add developer contact & handoff notes for bug reports — PENDING
- [ ] Post-deploy monitoring / regression sign-off (health endpoints, logs) — RECOMMENDED

Notes:
- API and static frontends deployed: API live on Render, public and admin sites deployed to Netlify (admin: rococo-sherbet-6244e2.netlify.app, web: cheery-praline-30b4a8.netlify.app).
- Admin build issues in `ImpactEditor.jsx` and `ProgramsEditor.jsx` were fixed and committed (fix commit present).
- Content wiring for `heroImage` and UPI QR has been added and is served by the API.
