# Heritage of Hope Foundation — Website Design & Architecture Plan

> **Document Type:** Design Specification + Site Architecture + Asset Inventory  
> **Prepared For:** Heritage of Hope Foundation  
> **Version:** 1.0  
> **Date:** April 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Deployment](#2-tech-stack--deployment)
3. [Visual Design System](#3-visual-design-system)
4. [Site Architecture](#4-site-architecture)
5. [Page-by-Page Design Specification](#5-page-by-page-design-specification)
6. [Component Library](#6-component-library)
7. [Asset Requirements](#7-asset-requirements)
8. [Credibility & Trust Architecture](#8-credibility--trust-architecture)
9. [Forms & Integrations](#9-forms--integrations)
10. [SEO & Accessibility](#10-seo--accessibility)
11. [Build Phases & Priority Order](#11-build-phases--priority-order)
12. [Checklist Before Launch](#12-checklist-before-launch)

---

## 1. Project Overview

### About the Organization
**Heritage of Hope Foundation** is a registered NGO operating out of Sukantapally, Subhas Gram, West Bengal (PIN 700147), dedicated to improving the lives of children and women in underserved communities through education, healthcare, and essential resources.

### Website Goals (Equal Priority)
- **Donor Conversion** — Make it easy and trustworthy to donate via UPI, bank transfer, or QR
- **Volunteer Recruitment** — Attract local and remote volunteers to ongoing programs
- **Credibility & Showcase** — Demonstrate real impact with photos, registration proof, and partner affiliations

### Target Audience
| Audience | Primary Need | Design Priority |
|---|---|---|
| First-time donors | Trust, transparency, ease of payment | High credibility signals, simple donate flow |
| Repeat supporters | Updates, impact proof | Activity feed, impact numbers |
| Volunteers | What to do, how to apply | Clear roles, simple form |
| Journalists / Institutions | Legitimacy, contact info | Registration docs, partner logos |
| General public | Awareness | Engaging visuals, program descriptions |

---

## 2. Tech Stack & Deployment

### Recommended Stack
| Layer | Technology | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast, component-based, easy to maintain |
| Styling | Tailwind CSS | Rapid UI development, responsive by default |
| Routing | React Router v6 | Clean multi-page navigation |
| Contact Form | Formspree (free tier) | No backend needed, 50 submissions/month free |
| Image Hosting | Cloudinary (free tier) | Optimized delivery, 25GB free storage |
| Deployment | Netlify (free tier) | CI/CD from GitHub, free SSL, custom domain support |
| Version Control | GitHub | Free, enables Netlify auto-deploy |
| Analytics | Google Analytics 4 | Free, tracks donor funnel and page performance |

### Deployment Flow
```
Local Dev (Vite)
    ↓ git push
GitHub Repository
    ↓ auto-trigger
Netlify Build
    ↓
Live Site (https://heritageofhope.netlify.app)
    ↓ (optional later)
Custom Domain (e.g., heritageofhopefoundation.org)
```

### Estimated Cost
| Item | Cost |
|---|---|
| Hosting (Netlify) | ₹0 / month |
| Domain name (.org) | ~₹800–1200 / year |
| Cloudinary images | ₹0 (free tier) |
| Formspree forms | ₹0 (free tier) |
| **Total Year 1** | **~₹1000** |

---

## 3. Visual Design System

### Color Palette
| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Deep Blue | `#1A4F8A` | Headers, nav, buttons, links |
| Accent | Warm Amber | `#F5A623` | CTAs, highlights, badges |
| Secondary | Soft Teal | `#2A9D8F` | Program cards, section dividers |
| Background | Off White | `#F9F9F9` | Page backgrounds |
| Surface | Pure White | `#FFFFFF` | Cards, modals |
| Text Primary | Charcoal | `#1C1C1C` | Body text |
| Text Secondary | Medium Gray | `#6B7280` | Captions, meta text |
| Danger/Alert | Coral Red | `#E76F51` | Urgent campaigns |

### Typography
| Role | Font | Weight | Size |
|---|---|---|---|
| Display Heading (H1) | Poppins | 700 Bold | 48–64px |
| Section Heading (H2) | Poppins | 600 SemiBold | 32–40px |
| Sub-heading (H3) | Poppins | 500 Medium | 22–28px |
| Body Text | Inter | 400 Regular | 16–18px |
| Caption / Meta | Inter | 400 Regular | 12–14px |
| Button Text | Poppins | 600 SemiBold | 14–16px |

> Both fonts are free on Google Fonts. Load only the weights listed above to keep page speed high.

### Spacing System (8px base grid)
- `xs` = 4px, `sm` = 8px, `md` = 16px, `lg` = 24px, `xl` = 32px, `2xl` = 48px, `3xl` = 64px

### Border Radius
- Cards: `12px`, Buttons: `8px`, Badges: `999px` (pill), Images: `16px`

### Elevation / Shadow
- Card hover: `0 4px 24px rgba(0,0,0,0.10)`
- Modal: `0 8px 40px rgba(0,0,0,0.18)`

### Iconography
- Use **Lucide React** (free, consistent, tree-shakeable)
- Key icons needed: Heart, Users, BookOpen, Droplet (blood), Sun, Cloud, Award, MapPin, Phone, Mail, ArrowRight, ExternalLink

---

## 4. Site Architecture

```
heritageofhopefoundation.org/
│
├── / ................................. Home
├── /about ............................. About Us
│   └── /about#registration ............ Legal & Registration (anchor)
├── /our-work .......................... Programs Overview
│   ├── /our-work/kishalaya-pathsala ... Kishalaya Pathsala (School)
│   ├── /our-work/health-camps ......... Health Checkup Camps
│   ├── /our-work/blood-donation ........ Blood Donation Drives
│   ├── /our-work/winter-programme ..... Winter Welfare Programme
│   ├── /our-work/monsoon-event ........ Monsoon Event
│   └── /our-work/bornporichoy ......... Bornporichoy (Literacy)
├── /impact ............................ Impact & Reports
├── /gallery ........................... Photo Gallery
├── /get-involved ...................... Donate + Volunteer + Partner
│   ├── /get-involved#donate ........... Donation Section
│   ├── /get-involved#volunteer ........ Volunteer Form
│   └── /get-involved#partner .......... Partner With Us
└── /contact ........................... Contact Page
```

### Navigation Structure
**Primary Nav (Desktop):** Home | About | Our Work ▾ | Impact | Gallery | Get Involved | Contact

**Mobile Nav:** Hamburger menu → full-screen overlay with same links

**Footer Nav:** About | Programs | Gallery | Donate | Volunteer | Contact | Privacy Policy

---

## 5. Page-by-Page Design Specification

---

### 5.1 Home Page `/`

**Purpose:** First impression. Establish trust, communicate mission, drive donations.

#### Section 1 — Hero
- Full-width banner, height: 90vh on desktop / 70vh on mobile
- Background: High-quality photo of children at Kishalaya Pathsala (with overlay gradient)
- **Headline:** "Lighting Lives, One Step at a Time"
- **Sub-headline:** "Heritage of Hope Foundation works in underserved communities of West Bengal providing education, healthcare, and essential resources."
- **CTA Buttons:** [Donate Now — Amber] [See Our Work — Outlined White]
- **Trust badge strip** below headline: "Registered NGO | Govt. of West Bengal | Est. 2024"

#### Section 2 — Impact Stats Bar
- Full-width colored band (Deep Blue background)
- 4 animated counters:
  - Children Reached: **150+**
  - Events Conducted: **12+**
  - Volunteer Partners: **3+**
  - Communities Served: **2+**
- Update these numbers as the NGO grows

#### Section 3 — Mission Pillars
- 3-column card layout
- **Education** (BookOpen icon) — Kishalaya Pathsala, Bornporichoy
- **Healthcare** (Heart icon) — Health camps, Blood donation
- **Welfare** (Users icon) — Winter drives, clothing, monsoon support
- Each card links to `/our-work`

#### Section 4 — Programs Snapshot
- Heading: "What We Do"
- 3 featured program cards with photo thumbnail, title, one-line description, "Learn More →" link
- Featured programs: Kishalaya Pathsala, Health Camps, Winter Programme

#### Section 5 — Credibility Strip
- Logos of partner organizations: B.P. Poddar Hospital, OCWE
- Text: "In collaboration with trusted institutions"
- Govt. of West Bengal registration badge

#### Section 6 — Recent Activity
- 2–3 cards showing most recent events (pulled from Facebook or manually updated)
- Each card: photo thumbnail, event name, date, short description

#### Section 7 — Donate CTA Banner
- High-contrast full-width section (Amber background)
- Headline: "Your Small Gift Creates Big Change"
- Sub-text: "₹199 gifts one child new clothes. ₹500 supports a month of learning materials."
- [Donate Now] button → `/get-involved#donate`

#### Section 8 — Footer
*(See Component Library — Footer)*

---

### 5.2 About Page `/about`

**Purpose:** Build deep trust. Tell the story. Show the team and legal standing.

#### Section 1 — Our Story
- Split layout: text left, photo right
- Founding narrative: when it started, why, who, where
- Key quote from founder in a styled blockquote

#### Section 2 — Mission & Vision
- Two-column card layout
- **Mission:** Improve lives of children and women in underserved communities
- **Vision:** A Bengal where every child has access to education and healthcare

#### Section 3 — Core Values
- 4 value cards: Compassion, Transparency, Community, Empowerment

#### Section 4 — Our Team
- Grid of team member cards (photo + name + role)
- Minimum 3 cards required (see Asset Requirements)

#### Section 5 — Legal & Registration `#registration`
- **Heading:** "Legally Registered & Transparent"
- Display items:
  - Scanned image of Govt. of West Bengal Trust Registration Certificate (A.R.A.-II)
  - Registration Number (prominently)
  - Date of registration
  - Issuing authority name
  - "View Full Certificate" → opens PDF in new tab
- Side panel: "Why this matters" — short explanation of what NGO registration means for donors

#### Section 6 — Partners & Affiliations
- Logo grid: B.P. Poddar Hospital, OCWE, TGA Day Care Centre
- Short 1-line description of each partnership

---

### 5.3 Our Work — Programs Index `/our-work`

**Purpose:** Show the breadth of the NGO's programs with visual impact.

- Filterable card grid (filter by: Education | Health | Welfare)
- Each card: hero image, program name, category badge, short description, "Read More →"
- 6 program cards total

---

### 5.4 Individual Program Pages `/our-work/[program-name]`

**Template layout (same structure for all 6):**

1. **Hero** — Full-width program photo with program name overlay
2. **Overview** — What this program is, who it serves
3. **Impact Numbers** — Specific to this program (e.g., "47 children enrolled in Kishalaya Pathsala")
4. **How It Works** — 3–4 step process (visual timeline or numbered steps)
5. **Photo Gallery** — 6–9 photos from this program's events
6. **Partners for this program** — if applicable
7. **CTA** — "Support This Program" → `/get-involved#donate`

---

### 5.5 Impact Page `/impact`

**Purpose:** Data-driven proof of work for skeptical donors and institutional partners.

#### Sections:
1. **Headline Stats** — Large animated numbers (same as homepage but more detailed)
2. **Program-wise Breakdown** — Table or bar chart: each program vs. people reached
3. **Fund Utilization** — Pie chart: how donations are used (% breakdown)
4. **Stories of Change** — 2–3 short anonymized beneficiary stories with photo
5. **Annual Summary** — Downloadable PDF (even a 1-page summary counts)
6. **Our Partners' Words** — Testimonial quotes from OCWE, B.P. Poddar, etc.

---

### 5.6 Gallery Page `/gallery`

**Purpose:** Emotional connection through authentic photos.

- Filter bar: All | Education | Health | Welfare | Events
- Year filter: 2024 | 2025
- Masonry grid layout
- Lightbox on click (full-screen photo viewer)
- Lazy loading for performance

---

### 5.7 Get Involved Page `/get-involved`

**Purpose:** Convert interest into action — donations, volunteering, partnerships.

#### Section 1 — Donate `#donate`
- Heading: "Make a Difference Today"
- **Donation impact ladder:**
  - ₹199 → New clothes for one child
  - ₹500 → One month of learning materials
  - ₹1000 → Health camp support for a family
  - ₹5000 → Sponsor a child's full year of learning
- **UPI QR Code** — large, scannable image
- **Bank Transfer Details** (in a styled card):
  - Account Name: Heritage of Hope Foundation
  - Bank: State Bank of India, Ruby Park Branch
  - Account No: 43107075580
  - IFSC: SBIN0008438
- "After donating, email us your UTR for a receipt": heritageofhopefoundation@gmail.com
- Note: "80G tax exemption — check with us for current status"

#### Section 2 — Volunteer `#volunteer`
- Short pitch: "We need passionate people, not just funds"
- Roles available: Teaching support, Event coordination, Photography, Social media, Healthcare assistance
- **Volunteer Interest Form** (via Formspree):
  - Name, Email, Phone, Location, Area of Interest (dropdown), Availability, Message
- Expected response time: 3–5 business days

#### Section 3 — Partner With Us `#partner`
- For organizations, hospitals, corporates
- Benefits of partnering: CSR credit, co-branding, impact reports
- **Partner Inquiry Form** (via Formspree):
  - Organization name, Contact person, Email, Phone, Type of partnership, Message

---

### 5.8 Contact Page `/contact`

- **Contact card:** Phone (084201 19790), Email (heritageofhopefoundation@gmail.com)
- **Address card:** Sukantapally, Subhas Gram, West Bengal 700147
- **Google Maps embed** pinned to Subhas Gram area
- **Social links:** Facebook page link
- **General contact form** (via Formspree): Name, Email, Subject, Message
- Response time notice: "We typically respond within 2 business days"

---

## 6. Component Library

These are reusable components to build once and use across all pages.

### 6.1 Navbar
- Logo (left) + nav links (center/right) + [Donate Now] button (amber, always visible)
- Sticky on scroll with slight drop shadow
- Mobile: hamburger → slide-in drawer

### 6.2 Footer
- **Column 1:** Logo + 1-line mission statement + social icons
- **Column 2:** Quick links (About, Our Work, Impact, Gallery)
- **Column 3:** Contact info (phone, email, address)
- **Column 4:** Donate CTA + UPI QR (small)
- **Bottom bar:** © 2024 Heritage of Hope Foundation | Registered NGO, Govt. of West Bengal | Reg. No. [XXXXX] | Privacy Policy

### 6.3 Program Card
- Photo thumbnail (16:9 ratio)
- Category badge (pill)
- Program title
- 2-line description
- "Learn More →" link

### 6.4 Impact Counter
- Large number (animated count-up on scroll)
- Icon above
- Label below

### 6.5 Donation Impact Card
- Rupee amount (large, bold amber)
- "=" symbol
- What it buys (descriptive text)

### 6.6 Team Member Card
- Circular photo
- Name
- Role/designation

### 6.7 Testimonial Card
- Quote text
- Attribution: Name, Organization
- Organization logo (small)

### 6.8 Gallery Lightbox
- Masonry grid
- Click → full-screen overlay with left/right navigation

### 6.9 Section CTA Banner
- Full-width, alternating between Deep Blue and Amber backgrounds
- Headline + sub-text + button

### 6.10 Credibility Badge
- Shield icon
- "Registered NGO" text
- "Govt. of West Bengal"
- Use in: Hero, Footer, About page

---

## 7. Asset Requirements

This section lists every asset needed, how many, and what format.

---

### 7.1 Photography

#### Hero / Banner Images
| Asset | Count | Specs | Notes |
|---|---|---|---|
| Homepage hero photo | 1 | Min 1920×1080px, JPG | Children at Kishalaya Pathsala or group event; must be bright, emotive |
| About page hero | 1 | Min 1920×600px, JPG | Team or community photo |
| Our Work index hero | 1 | Min 1920×600px, JPG | Wide program photo |
| Impact page hero | 1 | Min 1920×600px, JPG | Candid beneficiary photo |
| Get Involved hero | 1 | Min 1920×600px, JPG | Volunteers or donation event |
| **Total hero images** | **5** | | |

#### Program Hero Images (one per program page)
| Program | Count | Specs |
|---|---|---|
| Kishalaya Pathsala | 1 | Min 1920×600px |
| Health Camps | 1 | Min 1920×600px |
| Blood Donation | 1 | Min 1920×600px |
| Winter Programme | 1 | Min 1920×600px |
| Monsoon Event | 1 | Min 1920×600px |
| Bornporichoy | 1 | Min 1920×600px |
| **Total program heroes** | **6** | |

#### Gallery Photos (for `/gallery` and program pages)
| Category | Min Count | Recommended | Specs |
|---|---|---|---|
| Education / Kishalaya | 8 | 12 | Min 800×600px, JPG/WebP |
| Health Camps | 6 | 10 | Min 800×600px |
| Blood Donation | 5 | 8 | Min 800×600px |
| Winter Programme | 6 | 10 | Min 800×600px |
| Monsoon Event | 4 | 8 | Min 800×600px |
| Bornporichoy | 4 | 6 | Min 800×600px |
| General / Miscellaneous | 4 | 6 | Min 800×600px |
| **Total gallery photos** | **37 min** | **60 recommended** | |

> You already have many of these from Facebook posts. Export them at original resolution.

#### Team Photos
| Asset | Count | Specs | Notes |
|---|---|---|---|
| Team member headshots | Min 3, ideally 6–8 | 400×400px, JPG | Square crop, consistent background preferred |

#### Beneficiary Story Photos
| Asset | Count | Specs | Notes |
|---|---|---|---|
| Story photos (anonymized if needed) | 2–3 | Min 600×400px | Must have consent; can blur faces if needed |

---

### 7.2 Branding Assets

| Asset | Count | Format | Notes |
|---|---|---|---|
| Primary logo (color) | 1 | SVG + PNG (transparent bg) | You already have this |
| Primary logo (white version) | 1 | SVG + PNG | For dark backgrounds (footer, hero overlay) |
| Primary logo (dark/black version) | 1 | SVG + PNG | For light print use |
| Favicon | 1 | 32×32px ICO or PNG | Cropped from logo icon |
| OG / Social share image | 1 | 1200×630px JPG | Shown when link shared on WhatsApp/Facebook |

---

### 7.3 Legal & Credibility Documents

| Asset | Format | Notes |
|---|---|---|
| Trust Registration Certificate (WB Govt.) | Scanned PDF + JPG preview | Already visible on Facebook — get clean scan |
| Registration Number | Text string | Display prominently on site |
| 80G / 12A certificate | PDF | If available; if not, note "applied for" |
| Annual Report / Fund Summary | PDF | Even a 1-page simple summary works |
| Bank account details confirmation | Text | Account name, number, IFSC, branch |

---

### 7.4 Partner Assets

| Asset | Count | Format | Notes |
|---|---|---|---|
| B.P. Poddar Hospital logo | 1 | PNG (transparent bg) | Request from their communications team |
| OCWE logo | 1 | PNG (transparent bg) | Request from OCWE |
| TGA Day Care Centre logo | 1 | PNG (transparent bg) | Request from TGA |
| Partner testimonial quotes | 2–3 | Text | Written quotes from partner reps |

---

### 7.5 Icons & Illustrations

| Asset | Source | Notes |
|---|---|---|
| UI icons (Heart, BookOpen, etc.) | Lucide React | Already in tech stack, no separate file needed |
| Program illustrations (optional) | unDraw.co (free) | Adds warmth; download SVG for Education, Health, Community themes |
| Donation campaign graphics | Re-use from Facebook posts | Already designed; export as PNG |
| UPI QR Code | Generate fresh | Use the bank's/UPI's official QR generator for accuracy |

---

### 7.6 Written Content

| Content Piece | Word Count | Owner |
|---|---|---|
| Homepage headline + sub-headline | 30–50 words | You / Claude can draft |
| About / Our Story narrative | 300–500 words | Founder input required |
| Mission & Vision statements | 50 words each | Founder input required |
| Program descriptions (×6) | 150–200 words each | You / Claude can draft from Facebook posts |
| Beneficiary stories (×2–3) | 100–150 words each | Field team input required |
| Volunteer role descriptions (×5) | 50 words each | You can draft |
| Team member bios (×3–8) | 30–50 words each | Each member |
| Fund utilization breakdown | % figures | Finance/founder input |
| Impact numbers | Verified figures | Field records |

---

## 8. Credibility & Trust Architecture

### Placement Strategy

| Credibility Signal | Primary Location | Secondary Location | Footer |
|---|---|---|---|
| Registration number | About#registration | — | ✅ Every page |
| Registration certificate | About#registration | — | — |
| Bank details | Get Involved#donate | — | — |
| Partner logos | Home (strip) | About (section) | ✅ Small logos |
| Impact numbers | Home (stats bar) | Impact page | — |
| Govt. registration badge | Home hero | About page | ✅ |
| Testimonials | Impact page | Home (optional) | — |
| Fund utilization chart | Impact page | Get Involved | — |
| Annual report PDF | Impact page | About | — |

### Trust-Building Copy Principles
- Always explain **what your money does** before asking for it
- Show **real photos** of real events, not stock images
- Display **exact numbers** (47 children, not "many children")
- Make bank details and registration **easy to find**, not buried
- Add a **"Receipt Policy"** note: donors can email UTR for acknowledgment

---

## 9. Forms & Integrations

### Formspree Setup
1. Create free account at formspree.io
2. Create 3 forms: General Contact, Volunteer Interest, Partner Inquiry
3. Each form gets a unique endpoint URL
4. All submissions go to heritageofhopefoundation@gmail.com

### Google Analytics 4
- Track: Page views, Donate button clicks, Form submissions, Gallery interactions
- Set up conversion goal: "Donate button click"

### Google Maps Embed
- Embed map centered on Subhas Gram / Sukantapally area
- Free, no API key needed for basic embed

### Cloudinary (Image CDN)
- Upload all photos to Cloudinary
- Use responsive image URLs (auto-format, auto-quality)
- Keeps site fast even with 60+ photos

---

## 10. SEO & Accessibility

### SEO Basics
| Element | Implementation |
|---|---|
| Page titles | Unique per page: "Heritage of Hope Foundation — Education & Healthcare NGO, West Bengal" |
| Meta descriptions | 150–160 chars per page |
| OG tags | Title, description, image (1200×630px) for WhatsApp/Facebook sharing |
| Sitemap | Auto-generated via Vite plugin |
| Robots.txt | Allow all |
| Alt text | Every image must have descriptive alt text |

### Accessibility
- All buttons and links have visible focus states
- Color contrast ratio minimum 4.5:1 for body text
- Images have alt text
- Forms have proper labels
- Site is keyboard-navigable
- Mobile responsive (tested at 375px, 768px, 1280px, 1440px)

---

## 11. Build Phases & Priority Order

### Phase 1 — Foundation (Week 1–2)
- [ ] Set up React + Vite + Tailwind project
- [ ] Design system (colors, fonts, spacing) in `tailwind.config.js`
- [ ] Build reusable components: Navbar, Footer, Button, Card
- [ ] Build Home page (all 8 sections)
- [ ] Build Get Involved page (Donate section)
- [ ] Deploy to Netlify (draft URL)

### Phase 2 — Credibility Layer (Week 2–3)
- [ ] Build About page (Story, Team, Registration, Partners)
- [ ] Upload registration certificate PDF
- [ ] Integrate partner logos
- [ ] Build Contact page + Formspree form

### Phase 3 — Programs (Week 3–4)
- [ ] Build Our Work index page
- [ ] Build 6 individual program pages (using template)
- [ ] Upload and optimize all program photos via Cloudinary

### Phase 4 — Impact & Gallery (Week 4–5)
- [ ] Build Impact page (stats, fund chart, stories)
- [ ] Build Gallery page (masonry grid + lightbox)
- [ ] Upload all 60 gallery photos

### Phase 5 — Polish & Launch (Week 5–6)
- [ ] SEO meta tags on all pages
- [ ] Google Analytics integration
- [ ] Mobile responsiveness audit (all pages)
- [ ] Accessibility audit
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Connect custom domain (if purchased)
- [ ] Final content review with NGO team
- [ ] Go live

---

## 12. Checklist Before Launch

### Content
- [ ] All placeholder text replaced with real content
- [ ] All team photos uploaded and credited
- [ ] Registration certificate uploaded and visible
- [ ] UPI QR code tested and working
- [ ] Bank details verified and accurate
- [ ] All program descriptions reviewed by NGO team
- [ ] Impact numbers verified against field records

### Technical
- [ ] Site loads in under 3 seconds (test via PageSpeed Insights)
- [ ] All images compressed (use WebP format)
- [ ] All forms tested — submissions reach email
- [ ] All links working (no 404s)
- [ ] Favicon showing in browser tab
- [ ] SSL certificate active (Netlify provides this free)
- [ ] Google Analytics firing correctly
- [ ] Mobile layout tested on Android + iOS

### Legal & Trust
- [ ] Registration number in footer
- [ ] Privacy Policy page (simple, 1-page) published
- [ ] Donation receipt process documented and communicated
- [ ] Partner logos used with permission

---

*This document is a living specification. Update it as the NGO grows, new programs launch, or design decisions change.*

---

**Prepared with Heritage of Hope Foundation**  
*"One step at a time."*