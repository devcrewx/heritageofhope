# Heritage of Hope Admin — Complete Editing Guide

A page-by-page walkthrough of **every editable field** across the entire admin website.  
Each section covers: what the admin field is called, where it appears on the public site, and how to edit it.

---

## Table of Contents

1. [Home Page Editor (`/admin/home`)](#1-home-page-editor)
2. [About Page Editor (`/admin/about`)](#2-about-page-editor)
3. [Our Work Page Editor (`/admin/our-work`)](#3-our-work-page-editor)
4. [Impact Page Editor (`/admin/impact`)](#4-impact-page-editor)
5. [Gallery Manager (`/admin/gallery`)](#5-gallery-manager)
6. [Get Involved Page Editor (`/admin/get-involved`)](#6-get-involved-page-editor)
7. [Contact Page Editor (`/admin/contact`)](#7-contact-page-editor)
8. [Team Editor (`/admin/team`)](#8-team-editor)
9. [Partners Editor (`/admin/partners`)](#9-partners-editor)
10. [Programs Editor (`/admin/programs`)](#10-programs-editor)
11. [Activity Posts Editor (`/admin/activity-posts`)](#11-activity-posts-editor)
12. [Documents Editor (`/admin/documents`)](#12-documents-editor)
13. [Thank You Page Editor (`/admin/thank-you`)](#13-thank-you-page-editor)
14. [Not Found (404) Page Editor (`/admin/not-found`)](#14-not-found-404-page-editor)
15. [Settings (`/admin/settings`)](#15-settings)
16. [Change Password (`/admin/change-password`)](#16-change-password)

---

## 1. Home Page Editor

**URL:** `/admin/home`  
**Subtitle:** "Edit hero, stats, mission section, and donation CTA."

### Tabs

| Tab Label | Tab Key | What it contains |
|---|---|---|
| **Hero Section** | `hero` | Hero image, text, CTA buttons, certificate thumbnail |
| **Impact Stats** | `stats` | Number stats with labels |
| **Mission Section** | `mission` | Section heading |
| **Donation CTA** | `cta` | Call-to-action headline, body, button |
| **Showcase Images** | `showcase` | Up to 6 photos with bilingual captions |
| **Page Labels** | `labels` | All section eyebrow + heading text |

---

### Tab: Hero Section

Edits the large hero panel at the top of the public Home page.

#### Hero Photo

The large image displayed on the right side of the hero panel.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Hero Photo" | Click the upload area to add or replace. Click × to delete. |
| Format | JPEG / PNG / WebP. Auto-resized to 1920px max dimension. |

#### Text Fields

| Admin Label | Public Location | Example |
|---|---|---|
| **Eyebrow Label (EN)** | Small line above the headline | `"Welcome to"` |
| **Eyebrow Label (BN)** | Same, in Bengali | `"স্বাগতম"` |
| **Hero Headline (EN)** | Large heading | `"Heritage of Hope Foundation"` |
| **Hero Headline (Bangla)** | Large heading, Bengali | `"হেরিটেজ অফ হোপ ফাউন্ডেশন"` |
| **Hero Intro Paragraph (EN)** | Supporting text below headline | `"Working to create lasting change..."` |
| **Hero Intro Paragraph (Bangla)** | Same, in Bengali | `"দীর্ঘস্থায়ী পরিবর্তন..."` |
| **Hero Footnote (EN)** | Small text below trust badges | `"Registered under Societies Registration Act"` |
| **Hero Footnote (BN)** | Same, in Bengali | `"সোসাইটিজ রেজিস্ট্রেশন আইনে নিবন্ধিত"` |

#### Hero Image Details

| Admin Label | Public Location | Example |
|---|---|---|
| **Photo Caption (EN)** | Text caption below the hero photo | `"Community learning in action"` |
| **Photo Caption (Bangla)** | Same, in Bengali | `"সম্প্রদায়ের শিক্ষা কার্যক্রম"` |

#### Registration Certificate Thumbnail

A small thumbnail image (~120×120px) displayed below the hero photo.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Registration Certificate Thumbnail" | Click upload area to add/replace. Click × to delete. |

| Admin Label | Example |
|---|---|
| **Cert Caption (EN)** | `"Registration proof available on About page"` |
| **Cert Caption (BN)** | `"নিবন্ধনের প্রমাণ 'আমাদের কথা' পাতায়"` |

#### Hero CTA Buttons

| Admin Label | Public Location | Example |
|---|---|---|
| **Primary CTA Label (EN)** | "Support a Program" button text | `"Support a Program"` |
| **Primary CTA Label (BN)** | Same, in Bengali | `"সহায়তা করুন"` |
| **Secondary CTA Label (EN)** | "Explore Our Work" button text | `"Explore Our Work"` |
| **Secondary CTA Label (BN)** | Same, in Bengali | `"আমাদের কাজ দেখুন"` |

> **Save button:** Click **"Save Hero"** after editing text (images save automatically on upload).

---

### Tab: Impact Stats

Manages the numbered stats row (e.g., "200+ Children Supported").

| Admin Field | Public Display |
|---|---|
| **Value** (text input, placeholder `"e.g., 200+"`) | The large number |
| **Label in English** (placeholder `"Label in English"`) | Text below the number |
| **Label in Bengali** (optional, placeholder `"Label in Bengali (optional)"`) | Bengali version |

Each stat has 3 inputs (Value, EN label, BN label). Use **"Add New Stat"** to create a new stat row. Use **"Delete"** to remove one.

> **Note:** Stats are **shared** — changes here also affect the Impact page.

---

### Tab: Mission Section

| Admin Label | Public Location |
|---|---|
| **Mission Section Heading (EN)** | Heading above the 3 featured program cards | `"Our Mission"` |
| **Mission Section Heading (Bangla)** | Same, in Bengali | `"আমাদের লক্ষ্য"` |

> The actual program cards (images + text) are managed in **Programs Editor** (`/admin/programs`).

---

### Tab: Donation CTA

| Admin Label | Hint | Example |
|---|---|---|
| **CTA Headline (EN)** | "Main call-to-action heading" | `"Support Our Cause"` |
| **CTA Headline (Bangla)** | Same, in Bengali | `"আমাদের লক্ষ্যে সহায়তা করুন"` |
| **CTA Body Text (EN)** | "Supporting text for the donation section" | `"Your contribution helps us reach more communities."` |
| **CTA Body Text (Bangla)** | Same, in Bengali | `"আপনার অবদান আমাদের আরও সম্প্রদায়ে পৌঁছাতে সাহায্য করে।"` |
| **CTA Button Label (EN)** | "Text for the 'Donate now' button" | `"Donate Now"` |
| **CTA Button Label (BN)** | Same, in Bengali | `"এখনই দান করুন"` |

---

### Tab: Showcase Images

**Public location:** Right column of the activity section on the Home page.  
These are the photos with a single caption underneath (e.g., "Learning Space").  
Up to 6 images.

| Admin Field | Public Display |
|---|---|
| Image upload | The photo |
| **Label (English)** | The caption below the photo |
| **Label (Bangla)** | Bengali caption |

**How to manage:**
- **Add:** Click upload area for any empty slot
- **Replace:** Click upload area for an occupied slot
- **Delete:** Click × on the image preview
- **Edit caption:** Type in the Label (English) / Label (Bangla) fields
- **Save labels:** Click **"Save Showcase Labels"**

---

### Tab: Page Labels

Edits all section eyebrow and heading labels on the Home page.

| Admin Label | Public Location | Example |
|---|---|---|
| **Stats Section Eyebrow (EN)** | Small text above stats | `"Our Impact"` |
| **Stats Section Eyebrow (Bangla)** | Same, in Bengali | `"আমাদের প্রভাব"` |
| **Stats Section Heading (EN)** | Stats section heading | `"By the Numbers"` |
| **Stats Section Heading (Bangla)** | Same, in Bengali | `"সংখ্যায় আমাদের অগ্রগতি"` |
| **Pillar Section Eyebrow (EN)** | Small text above mission cards | `"Our Mission"` |
| **Pillar Section Eyebrow (Bangla)** | Same, in Bengali | `"আমাদের লক্ষ্য"` |
| **Activity Section Eyebrow (EN)** | Small text above activity posts | `"Recent Activities"` |
| **Activity Section Eyebrow (Bangla)** | Same, in Bengali | `"সাম্প্রতিক কার্যক্রম"` |
| **Activity Section Heading (EN)** | Activity section heading | `"From the Field"` |
| **Activity Section Heading (Bangla)** | Same, in Bengali | `"মাঠ থেকে"` |
| **Donation Section Eyebrow (EN)** | Small text above donation CTA | `"Get Involved"` |
| **Donation Section Eyebrow (Bangla)** | Same, in Bengali | `"অংশগ্রহণ করুন"` |

---

## 2. About Page Editor

**URL:** `/admin/about`  
**Subtitle:** "Update the public About page text content in structured bilingual fields."

### Tabs

| Tab Label | What it contains |
|---|---|
| **Page Intro** | Hero photo, page title, intro paragraph |
| **Page Labels** | All section eyebrow + heading labels |
| **Our Story** | Story heading + body text |
| **Mission & Vision** | Mission statement + vision statement |
| **Core Values** | 4 value cards (title + description each) |
| **Registration** | Certificate image + registration body text |

---

### Tab: Page Intro

#### Hero Photo

**Public location:** Image displayed on the right side of the About page intro section.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Hero Photo" | Click upload area to add/replace. Click × to delete. |

#### Text Fields

| Admin Label | Public Location | Example |
|---|---|---|
| **Page Title (EN)** | Large heading | `"About Us"` |
| **Page Title (Bangla)** | Same, in Bengali | `"আমাদের কথা"` |
| **Intro Paragraph (EN)** | Text below the title | `"Heritage of Hope Foundation..."` |
| **Intro Paragraph (Bangla)** | Same, in Bengali | `"হেরিটেজ অফ হোপ ফাউন্ডেশন..."` |

---

### Tab: Page Labels

| Admin Label | Public Location | Example |
|---|---|---|
| **Page Eyebrow (EN)** | Small text above page title | `"About"` |
| **Page Eyebrow (Bangla)** | Same, in Bengali | `"আমাদের কথা"` |
| **Story Section Label (EN)** | Small text above story section | `"Our Journey"` |
| **Story Section Label (Bangla)** | Same, in Bengali | `"আমাদের যাত্রা"` |
| **Mission Label (EN)** | Small text above mission statement | `"Our Mission"` |
| **Mission Label (Bangla)** | Same, in Bengali | `"আমাদের লক্ষ্য"` |
| **Vision Label (EN)** | Small text above vision statement | `"Our Vision"` |
| **Vision Label (Bangla)** | Same, in Bengali | `"আমাদের দৃষ্টি"` |
| **Values Section Eyebrow (EN)** | Small text above values | `"Core Values"` |
| **Values Section Eyebrow (Bangla)** | Same, in Bengali | `"মূল মূল্যবোধ"` |
| **Values Section Heading (EN)** | Values section heading | `"What Guides Us"` |
| **Values Section Heading (Bangla)** | Same, in Bengali | `"যা আমাদের পথ দেখায়"` |
| **Registration Section Eyebrow (EN)** | Small text above registration section | `"Registration"` |
| **Registration Section Eyebrow (Bangla)** | Same, in Bengali | `"নিবন্ধন"` |
| **Registration Section Heading (EN)** | Registration section heading | `"Official Registration"` |
| **Registration Section Heading (Bangla)** | Same, in Bengali | `"সরকারি নিবন্ধন"` |
| **Certificate Label (EN)** | Text above the certificate image | `"Registration Certificate"` |
| **Certificate Label (Bangla)** | Same, in Bengali | `"নিবন্ধন সনদ"` |
| **Partners Label (EN)** | Small text above partners section | `"Our Partners"` |
| **Partners Label (Bangla)** | Same, in Bengali | `"আমাদের অংশীদার"` |
| **Team Section Eyebrow (EN)** | Small text above team section | `"Our Team"` |
| **Team Section Eyebrow (Bangla)** | Same, in Bengali | `"আমাদের টিম"` |
| **Team Section Heading (EN)** | Team section heading | `"Meet the Team"` |
| **Team Section Heading (Bangla)** | Same, in Bengali | `"টিমের সাথে পরিচিত হন"` |
| **Documents Section Label (EN)** | Small text above documents section | `"Documents"` |
| **Documents Section Label (Bangla)** | Same, in Bengali | `"নথিপত্র"` |
| **Documents Section Heading (EN)** | Documents section heading | `"Certificates & Reports"` |
| **Documents Section Heading (Bangla)** | Same, in Bengali | `"সনদ ও প্রতিবেদন"` |

---

### Tab: Our Story

| Admin Label | Example |
|---|---|
| **Story Heading (EN)** | `"Our Story"` |
| **Story Heading (Bangla)** | `"আমাদের গল্প"` |
| **Story Body (EN)** | Multi-paragraph text about the foundation's origin |
| **Story Body (Bangla)** | Same, in Bengali |

---

### Tab: Mission & Vision

| Admin Label | Example |
|---|---|
| **Mission Statement (EN)** | `"To empower underserved communities..."` |
| **Mission Statement (Bangla)** | `"অসহায় সম্প্রদায়কে ক্ষমতায়িত করা..."` |
| **Vision Statement (EN)** | `"A world where every child has access..."` |
| **Vision Statement (Bangla)** | `"একটি বিশ্ব যেখানে প্রতিটি শিশুর..."` |

---

### Tab: Core Values

4 value cards, each with:

| Admin Label | Example |
|---|---|
| **Value {N} Title (EN)** | `"Integrity"` |
| **Value {N} Title (Bangla)** | `"সততা"` |
| **Value {N} Description (EN)** | A paragraph explaining the value |
| **Value {N} Description (Bangla)** | Same, in Bengali |

---

### Tab: Registration

#### Certificate Image

**Public location:** The registration certificate image displayed on the About page.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Certificate Image" | Click upload area to add/replace. Click × to delete. |

#### Text Fields

| Admin Label | Example |
|---|---|
| **Registration Body Text (EN)** | Paragraph explaining the registration status |
| **Registration Body Text (Bangla)** | Same, in Bengali |

---

### Image Summary: About Page

| Public Section | Image Source | Managed In |
|---|---|---|
| Hero image (right of intro) | About Editor → Page Intro tab → "Hero Photo" | `/admin/about` |
| Registration certificate image | About Editor → Registration tab → "Certificate Image" | `/admin/about` |
| Team member photos (cards) | Team Editor → each member has a "Photo" field | `/admin/team` |
| Partner logos | Partners Editor → each partner has a "Logo" field | `/admin/partners` |
| Program images (on Our Work page) | Programs Editor → each program has a "Program Image" | `/admin/programs` |

---

## 3. Our Work Page Editor

**URL:** `/admin/our-work`  
**Subtitle:** "This controls the public Our Work page text sections. Program cards still use the shared program content."

No tabs — all sections are stacked vertically.

---

### Intro Section

#### Hero Photo

**Public location:** Hero panel at the top of the Our Work page.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Hero Photo" | Click upload area to add/replace. Click × to delete. |

#### Text Fields

| Admin Label | Example |
|---|---|
| **Page Title (EN)** | `"Our Work"` |
| **Page Title (Bangla)** | `"আমাদের কাজ"` |
| **Page Intro (EN)** | Paragraph summarizing the foundation's work |
| **Page Intro (Bangla)** | Same, in Bengali |

---

### Focus Tags

3 tags shown in a summary mini-panel:

| Admin Label | Example |
|---|---|
| **Tag 1 (EN)** | `"Education"` |
| **Tag 1 (Bangla)** | `"শিক্ষা"` |
| **Tag 2 (EN)** | `"Healthcare"` |
| **Tag 2 (Bangla)** | `"স্বাস্থ্য"` |
| **Tag 3 (EN)** | `"Community Welfare"` |
| **Tag 3 (Bangla)** | `"সম্প্রদায় কল্যাণ"` |

---

### Approach Section

| Admin Label | Example |
|---|---|
| **Section Heading (EN)** | `"Our Approach"` |
| **Section Heading (Bangla)** | `"আমাদের পদ্ধতি"` |
| **Step 1 (EN)** | `"Identify local needs through community engagement"` |
| **Step 1 (Bangla)** | Bengali version of Step 1 |
| **Step 2 (EN)** | `"Design targeted programs"` |
| **Step 2 (Bangla)** | Bengali version of Step 2 |
| **Step 3 (EN)** | `"Implement with local partners"` |
| **Step 3 (Bangla)** | Bengali version of Step 3 |
| **Step 4 (EN)** | `"Measure impact and iterate"` |
| **Step 4 (Bangla)** | Bengali version of Step 4 |

---

### Join Mission Box

| Admin Label | Example |
|---|---|
| **Body Text (EN)** | `"Join us in making a difference"` |
| **Body Text (Bangla)** | Bengali version |
| **Button Label (EN)** | `"Get Involved"` |
| **Button Label (Bangla)** | Bengali version |

---

### Page Labels

| Admin Label | Example |
|---|---|
| **Page Eyebrow (EN)** | `"Our Work"` |
| **Page Eyebrow (Bangla)** | `"আমাদের কাজ"` |
| **Approach Section Label (EN)** | `"How We Work"` |
| **Approach Section Label (Bangla)** | Bengali version |
| **Focus Section Label (EN)** | `"Our Focus Areas"` |
| **Focus Section Label (Bangla)** | Bengali version |
| **Join Section Label (EN)** | `"Join Our Mission"` |
| **Join Section Label (Bangla)** | Bengali version |

---

### Showcase Photos

**Public location:** Photo grid section on the Our Work page. Up to 6 images with labels.

**Note:** These use **text input** for image URLs (no file upload widget). You must paste a Cloudinary URL manually.

| Admin Field | How to manage |
|---|---|
| **Image URL** (text input) | Paste a direct Cloudinary URL (e.g., `https://res.cloudinary.com/...`) |
| **Label (EN)** | Caption text in English |
| **Label (BN)** | Caption text in Bengali |

**How to add an image:**
1. Upload the image in Gallery Manager (`/admin/gallery`) first
2. Open the uploaded image in a browser tab and copy its URL
3. Paste the URL into the **Image URL** field
4. Click **"Save Showcase Photos"**

---

### Image Summary: Our Work Page

| Public Section | Image Source | Managed In |
|---|---|---|
| Hero image (top panel) | OurWork Editor → Intro Section → "Hero Photo" | `/admin/our-work` |
| Showcase photos (grid) | OurWork Editor → Showcase Photos → text URL | `/admin/our-work` |
| Program cards (in the main content) | Programs Editor | `/admin/programs` |

---

## 4. Impact Page Editor

**URL:** `/admin/impact`  
**Subtitle:** "Update the shared impact stats, fund allocation, testimonial, and annual report."

### Tabs

| Tab Label | What it contains |
|---|---|
| **Page Hero** | Page title, sub-headline, hero promise |
| **Impact Stats** | Same stats as Home page — shared |
| **Fund Allocation** | Percentage breakdown with bilingual categories |
| **Community Feedback** | A testimonial quote |
| **Annual Report** | Report body text |
| **Page Labels** | Section labels |

---

### Tab: Page Hero

| Admin Label | Example |
|---|---|
| **Page Title (EN)** | `"Our Impact"` |
| **Page Title (Bangla)** | `"আমাদের প্রভাব"` |
| **Sub-headline (EN)** | `"Transparency in action"` |
| **Sub-headline (Bangla)** | Bengali version |
| **Hero Promise (EN)** | `"100% of your donations go directly to programs"` |
| **Hero Promise (Bangla)** | Bengali version |

---

### Tab: Impact Stats

Same stats grid as the Home page. Each row has:

| Field | Example |
|---|---|
| **Value** | `"200+"` |
| **Label (EN)** | `"children supported"` |
| **Label (BN)** | `"সাহায্যপ্রাপ্ত শিশু"` |

Buttons: **Add** (new stat), **Delete** (remove), **Save Stats** (save changes).

---

### Tab: Fund Allocation

A percentage breakdown of how funds are used. Each row has:

| Field | Example |
|---|---|
| Category (EN) | `"Education"` |
| Category (BN) | `"শিক্ষা"` |
| Percentage (number) | `45` |
| Sort Order (number) | `0` |

> **Important:** Percentages across all rows must **total exactly 100%** before saving. A live counter shows the current total.

---

### Tab: Community Feedback

| Admin Label | Example |
|---|---|
| **Testimonial Quote (EN)** | `"The foundation changed our community's future..."` |
| **Testimonial Quote (Bangla)** | Bengali version |

---

### Tab: Annual Report

| Admin Label | Example |
|---|---|
| **Annual Report Body (EN)** | Text describing the report or a message from the director |
| **Annual Report Body (Bangla)** | Bengali version |

---

### Tab: Page Labels

| Admin Label | Example |
|---|---|
| **Page Eyebrow (EN)** | `"Impact"` |
| **Page Eyebrow (Bangla)** | `"প্রভাব"` |
| **Promise Label (EN)** | `"Our Promise"` |
| **Promise Label (Bangla)** | Bengali version |
| **Fund Section Eyebrow (EN)** | `"Where Your Money Goes"` |
| **Fund Section Eyebrow (Bangla)** | Bengali version |
| **Fund Section Heading (EN)** | `"Fund Allocation"` |
| **Fund Section Heading (Bangla)** | Bengali version |
| **Feedback Label (EN)** | `"Community Voices"` |
| **Feedback Label (Bangla)** | Bengali version |
| **Report Label (EN)** | `"Annual Report"` |
| **Report Label (Bangla)** | Bengali version |

> **Note:** The Impact page has **no image fields** — it's text + stats only.

---

## 5. Gallery Manager

**URL:** `/admin/gallery`  
**Subtitle:** "Upload and manage gallery photos"

### Page Content Section

Edits text visible on the public Gallery page.

| Admin Label | Example |
|---|---|
| **Page Eyebrow (EN)** | `"Gallery"` |
| **Page Eyebrow (Bangla)** | `"গ্যালারি"` |
| **Page Heading (EN)** | `"Photo Gallery"` |
| **Page Heading (Bangla)** | `"ফটো গ্যালারি"` |
| **Page Intro (EN)** | Introductory paragraph |
| **Page Intro (Bangla)** | Bengali version |
| **Filter Section Label (EN)** | Text above filter chips | `"Browse by category"` |
| **Filter Section Label (Bangla)** | Bengali version |
| **Filter Section Text (EN)** | Additional filter section text |
| **Filter Section Text (Bangla)** | Bengali version |
| **Filter Chip Labels** | Individual filter chip text |
| → **All (EN)** | `"All"` |
| → **All (BN)** | `"সব"` |
| → **Education (EN)** | `"Education"` |
| → **Education (BN)** | `"শিক্ষা"` |
| → **Healthcare (EN)** | `"Healthcare"` |
| → **Healthcare (BN)** | `"স্বাস্থ্য"` |
| → **Welfare (EN)** | `"Welfare"` |
| → **Welfare (BN)** | `"কল্যাণ"` |
| **Filter Row Aria Label (EN)** | Accessibility label | `"Filter gallery by category"` |
| **Filter Row Aria Label (BN)** | Accessibility label, Bengali | `"ফিল্টার আরিয়া লেবেল"` |

> **Save:** Click **"Save Page Content"** .

### Upload Photos Section

**Public location:** The `/gallery` page — all photos displayed in a filterable grid.

| Admin Field | Public Display |
|---|---|
| **Category** (dropdown) | Determines which filter tab the photo appears under (Gallery / Team / Events / Programs) |
| **Alt Text EN** | Accessibility text for the image (English) |
| **Alt Text BN** | Accessibility text for the image (Bengali) |
| Image files | The photo itself |

**How to upload:**
1. Select **Category** from dropdown
2. Enter **Alt Text** (EN and/or BN)
3. Drag-drop or click to select image(s) — up to 5 at once, JPG/PNG/WebP, max 5MB each
4. Click **"Upload N Image(s)"**

**How to edit an existing photo:**
- **Edit alt text / category:** Click **Edit** ✏ → change fields → **"Save"**
- **Reorder:** Click **▲/▼** arrows
- **Delete:** Click **Delete** 🗑 → confirm dialog

---

## 6. Get Involved Page Editor

**URL:** `/admin/get-involved`

### Tabs

| Tab Label | What it contains |
|---|---|
| **Donation Tiers** | Donation amount rows with bilingual labels |
| **Bank Details** | Account info + specimen cheque image |
| **UPI / Payment** | UPI QR code image |
| **Volunteer Section** | Heading, description, volunteer roles |
| **Partner Section** | Partnership photo, heading, description |
| **Page Labels** | All section labels, form labels, UPI labels |

---

### Tab: Donation Tiers

Each tier has:

| Field | Example |
|---|---|
| Amount (number) | `500` |
| Label (EN) | `"feeds a family for a week"` |
| Label (BN) | `"একটি পরিবারকে এক সপ্তাহ খাওয়ায়"` |

Use **Add Tier** (bottom of section) to create a new row.  
Click **Delete** (red button) to remove a tier.  
Click **"Save Tiers"** to save changes.

---

### Tab: Bank Details

#### Specimen Cheque Image

**Public location:** A sample cheque image shown for reference in the bank details section.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Specimen Cheque Image" | Click upload area to add/replace. Click × to delete. |

#### Text Fields

| Admin Label | Example |
|---|---|
| **Account Name (EN)** | `"Heritage of Hope Foundation"` |
| **Account Name (BN)** | Bengali version |
| **Bank & Branch (EN)** | `"State Bank of India, XYZ Branch"` |
| **Bank & Branch (BN)** | Bengali version |
| **Account Number (English only)** | `"43107075580"` |
| **IFSC Code (English only)** | `"SBIN0008438"` |

---

### Tab: UPI / Payment

#### UPI QR Code

**Public location:** The QR code image displayed on the Get Involved page for UPI donations.

| Admin Field | How it's managed |
|---|---|
| **Label:** "UPI QR Code" | Click upload area to add/replace. Uploaded at 600px max dimension, quality 100 (must be scan-friendly). Click × to delete. |

> No text fields on this tab. The QR image uploads immediately.

---

### Tab: Volunteer Section

| Admin Label | Example |
|---|---|
| **Section Heading (EN)** | `"Volunteer With Us"` |
| **Section Heading (Bangla)** | Bengali version |
| **Section Description (EN)** | Paragraph about volunteering |
| **Section Description (Bangla)** | Bengali version |

#### Volunteer Roles Sub-section

Each role has:

| Field | Example |
|---|---|
| **Role Title (EN)** | `"Teaching Support"` |
| **Role Title (Bangla)** | `"শিক্ষাদানে সহায়তা"` |
| **Role Description (EN)** | Description of the role |
| **Role Description (Bangla)** | Bengali version |
| **Sort Order** (number) | Controls display order (0 = first, 1 = second, etc.) |

Use **Add Role** to create a new one. **Delete** to remove.

---

### Tab: Partner Section

#### Partnership Photo

**Public location:** Image displayed in the partnership section of the Get Involved page.

| Admin Field | How it's managed |
|---|---|
| **Label:** "Partnership Photo" | Click upload area to add/replace. Click × to delete. |

#### Text Fields

| Admin Label | Example |
|---|---|
| **Partner Heading (EN)** | `"Partner With Us"` |
| **Partner Heading (Bangla)** | Bengali version |
| **Partner Description (EN)** | Paragraph about partnerships |
| **Partner Description (Bangla)** | Bengali version |

---

### Tab: Page Labels

Contains 3 sub-sections:

#### Page-Level Labels

| Admin Label | Example |
|---|---|
| **Page Eyebrow (EN)** | `"Get Involved"` |
| **Page Eyebrow (Bangla)** | Bengali version |
| **Donation Section Label (EN)** | Small text above donation section |
| **Donation Section Heading (EN)** | Heading for donation section |
| **Payment Section Label (EN)** | Small text above UPI/payment section |
| **Payment Section Heading (EN)** | Heading for UPI/payment section |
| **Volunteer Section Label (EN)** | Small text above volunteer section |
| **Volunteer Section Heading (EN)** | Heading for volunteer section |
| **Volunteer Form Label (EN)** | Label for the volunteer form section |
| **Volunteer Form Heading (EN)** | Heading for the volunteer form |
| **Partner Section Label (EN)** | Small text above partner section |
| **Partner Section Heading (EN)** | Heading for partner section |
| **Partner Section Subtitle (EN)** | Subtitle for partner section |
| **Partner Form Label (EN)** | Label for the partner form section |
| **Partner Form Heading (EN)** | Heading for the partner form |
| **Bank Details Header (EN)** | Heading for bank details section |
| **Specimen Cheque Modal Title (EN)** | Title of the cheque image popup |
| **View Cheque Button Label (EN)** | "View Cheque" button text |

(Each of the above also has a Bengali counterpart.)

#### Volunteer Form Labels

| Admin Label | Example |
|---|---|
| **Name Label** | `"Full Name"` |
| **Email Label** | `"Email Address"` |
| **Phone Label** | `"Phone Number"` |
| **Phone Validation Message** | `"Please enter a valid 10-digit phone number"` |
| **Interest Label** | `"Area of Interest"` |
| **Interest Placeholder** | `"Select your interest"` |
| **Availability Label** | `"Availability"` |
| **Availability Placeholder** | `"When can you volunteer?"` |
| **Weekends Option** | `"Weekends"` |
| **Weekdays Option** | `"Weekdays"` |
| **Occasionally Option** | `"Occasionally"` |
| **Message Label** | `"Message"` |
| **Submit Button** | `"Submit Application"` |
| **Submitting Text** | `"Submitting..."` |
| **Error Message** | `"Failed to submit. Please try again."` |

(Each has English and Bengali versions.)

#### Partner Form Labels

Same structure as Volunteer Form Labels but for the partner inquiry form:

| Admin Label | Example |
|---|---|
| **Organization Name Label** | `"Organization Name"` |
| **Contact Person Label** | `"Contact Person"` |
| **Email Label** | `"Email Address"` |
| **Phone Label** | `"Phone Number"` |
| **Phone Validation Message** | Same pattern |
| **Partnership Type Label** | `"Type of Partnership"` |
| **Partnership Type Placeholder** | `"Select partnership type"` |
| **CSR Option** | `"CSR"` |
| **Hospital / Medical Option** | `"Hospital / Medical"` |
| **Institution / School Option** | `"Institution / School"` |
| **Other Option** | `"Other"` |
| **Message Label** | `"Message"` |
| **Submit Button** | `"Submit Inquiry"` |
| **Submitting Text** | `"Submitting..."` |
| **Error Message** | `"Failed to submit. Please try again."` |

(Each has English and Bengali versions.)

#### UPI Labels

| Admin Label | Example |
|---|---|
| **UPI Button Label (EN)** | `"Pay via UPI"` |
| **UPI Button Label (BN)** | `"UPI এর মাধ্যমে পেমেন্ট"` |
| **Mobile Hint (EN)** | `"Open your UPI app to scan"` |
| **Mobile Hint (BN)** | `"স্ক্যান করতে আপনার UPI অ্যাপ খুলুন"` |
| **Fallback Hint (EN)** | `"If scanning fails, you can pay using the UPI ID below"` |
| **Fallback Hint (BN)** | Bengali version |
| **QR Hint (EN)** | `"Scan this QR code to donate"` |
| **QR Hint (BN)** | Bengali version |

---

### Image Summary: Get Involved Page

| Public Section | Image Source | Managed In |
|---|---|---|
| UPI QR code | GetInvolved Editor → UPI/Payment tab → "UPI QR Code" | `/admin/get-involved` |
| Specimen cheque image | GetInvolved Editor → Bank Details tab → "Specimen Cheque Image" | `/admin/get-involved` |
| Partnership photo | GetInvolved Editor → Partner Section tab → "Partnership Photo" | `/admin/get-involved` |

---

## 7. Contact Page Editor

**URL:** `/admin/contact`  
**Subtitle:** "These values power the public Contact page and footer."

No tabs — all sections stacked vertically.

---

### Contact Information Section

| Admin Label | Example |
|---|---|
| **Phone Number** | `"+91 08420119790"` |
| **Email Address** | `"heritageofhopefoundation@gmail.com"` |
| **Address** | `"Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB"` |
| **Facebook Page URL** | `"https://facebook.com/..."` |

#### Contact Page Copy Sub-section

| Admin Label | Example |
|---|---|
| **Page Title (EN)** | `"We'd love to hear from you."` |
| **Page Title (BN)** | `"আমরা আপনার কথা শুনতে চাই।"` |
| **Page Intro (EN)** | `"Reach out to us for inquiries..."` |
| **Page Intro (BN)** | Bengali version |
| **Response Time Label (EN)** | `"Response time"` |
| **Response Time Label (BN)** | `"প্রতিক্রিয়া সময়"` |
| **Response Time Value (EN)** | `"Usually within 2 business days"` |
| **Response Time Value (BN)** | Bengali version |
| **Form Label (EN)** | `"Contact form"` |
| **Form Label (BN)** | `"যোগাযোগ ফর্ম"` |
| **Form Heading (EN)** | `"Send us a direct message"` |
| **Form Heading (BN)** | `"সরাসরি বার্তা পাঠান"` |

---

### Contact Form Labels Section

Each field has English + Bengali inputs:

| Admin Label | Example (EN) |
|---|---|
| **Name Label** | `"Name"` |
| **Name Placeholder** | `"Your name"` |
| **Email Label** | `"Email"` |
| **Email Placeholder** | `"you@example.com"` |
| **Subject Label** | `"Subject"` |
| **Message Label** | `"Message"` |
| **Message Placeholder** | `"Tell us how you want to help"` |
| **Submit Button** | `"Send message"` |
| **Submitting Text** | `"Sending..."` |
| **Error Message** | `"Failed to submit form. Please try again."` |

---

### Mosaic Images Section

**Public location:** The photo strip at the bottom of the Contact page (right column).  
4 image slots, each with a caption.

| Admin Field | Public Display |
|---|---|
| Image upload (slot 1–4) | The photo in the mosaic |
| **Label (EN)** | Caption below the photo |
| **Label (BN)** | Bengali caption |

**How to manage:**
- **Add:** Click upload area for any empty slot
- **Replace:** Click upload area for an occupied slot
- **Delete:** Click × on the image preview
- **Edit caption:** Type in the Label fields
- **Save labels:** Click **"Save Mosaic Labels"**

---

### Page Content Labels Section

| Admin Label | Example |
|---|---|
| **Page Eyebrow (EN)** | `"Contact"` |
| **Page Eyebrow (BN)** | `"যোগাযোগ"` |
| **Facebook Section Eyebrow (EN)** | `"Featured from Facebook"` |
| **Facebook Section Eyebrow (BN)** | `"ফেসবুক থেকে"` |
| **Facebook Section Heading (EN)** | `"Recent moments from the page"` |
| **Facebook Section Heading (BN)** | `"সাম্প্রতিক মুহূর্ত"` |
| **Visit Facebook Button Label (EN)** | `"Visit Official Facebook Page →"` |
| **Visit Facebook Button Label (BN)** | Bengali version |
| **Map Iframe Title (EN)** | `"Heritage of Hope Foundation location"` |
| **Map Iframe Title (BN)** | Bengali version |
| **Google Maps Embed URL** | `"https://www.google.com/maps?q=..."` (single text input) |

---

### Image Summary: Contact Page

| Public Section | Image Source | Managed In |
|---|---|---|
| Mosaic images (bottom strip) | Contact Editor → Mosaic Images section | `/admin/contact` |
| Activity posts (left column, posts 4–6) | Activity Posts Editor | `/admin/activity-posts` |

---

## 8. Team Editor

**URL:** `/admin/team`

Manages team member cards shown on the About page.

**Public location:** The "Meet the Team" section on the About page — each member appears as a card with photo, name, and role.

| Admin Field | Public Display |
|---|---|
| **Name \*** | The person's name on the card |
| **Role (English)** | Role/title text (English) |
| **Role (Bengali)** | Role/title text (Bengali) |
| **Photo** | The person's photo on the card |

**How to manage:**
- **Add:** Click **"Add Member"** → fill form → choose photo → click **"Add Member"**
- **Replace photo (edit):** Click **Edit** ✏ → upload new photo → **"Update Member"** (leave photo empty to keep current)
- **Delete:** Click **Delete** 🗑 → confirm
- **Reorder:** **▲/▼** arrows

---

## 9. Partners Editor

**URL:** `/admin/partners`

Manages partner logos shown on the About page.

**Public location:** Partner logos displayed in the About page partners section.

| Admin Field | Public Display |
|---|---|
| **Partner Name \*** | Displayed as a pill/badge |
| **Logo** | The partner's logo image |
| **Active (show on public site)** | Checkbox — unchecked partners are hidden from the site |

**How to manage:**
- **Add:** Click **"Add Partner"** → fill name → upload logo → click **"Add Partner"**
- **Replace logo (edit):** Click **Edit** ✏ → upload new logo → **"Update Partner"**
- **Delete:** Click **Delete** 🗑 → confirm
- **Reorder:** **▲/▼** arrows
- **View:** Opens logo in a new tab

---

## 10. Programs Editor

**URL:** `/admin/programs`

Manages featured program cards. These serve dual purpose:
- **Home page (Mission Pillars):** The top 3 programs (by sort order) appear as pillar cards
- **Our Work page:** All programs appear as program cards

**Public location:** Home page (pillar section) and Our Work page (program grid).

| Admin Field | Public Display |
|---|---|
| **Slug \*** | URL-friendly identifier (not shown publicly) |
| **Title (EN)** | Card heading |
| **Title (BN)** | Card heading (Bengali) |
| **Category (EN)** | Pill/category label on the card |
| **Category (BN)** | Bengali category |
| **Description (EN)** | Card description text |
| **Description (BN)** | Bengali description |
| **Highlight (EN)** | A standout stat or phrase |
| **Highlight (BN)** | Bengali highlight |
| **Program Image** | The card image — required when creating |

**How to manage:**
- **Add:** Click **"Add Program"** → fill form → upload image → click **"Create"**
- **Replace image (edit):** Click **Edit** ✏ → upload new image → **"Update"** (leave photo empty to keep current)
- **Delete:** Click **Delete** 🗑 → confirm
- **Reorder:** **▲/▼** arrows (top 3 = Home page pillars)

---

## 11. Activity Posts Editor

**URL:** `/admin/activity-posts`

Manages activity posts that appear as a Facebook-style feed.

**Public location:** 
- **Home page** — left column of the activity section (first 4 posts, sorted by sort order)
- **Contact page** — left column of the Facebook section (posts 4–6, i.e., `slice(3,6)`)

Each post displays as a card with: thumbnail image → date → title → excerpt (body text).

| Admin Field | Public Display |
|---|---|
| **Date \*** | The date line (e.g., `2026-01-04`) |
| **Title (English) \*** | The heading |
| **Title (Bengali)** | Bengali heading |
| **Body (English)** | The description/excerpt text |
| **Body (Bengali)** | Bengali description |
| **Photo** | The thumbnail image on the left of the card |
| **Published** checkbox | Uncheck to hide from the site (kept as draft) |

**How to manage:**
- **Add:** Fill form at top → choose date → pick photo → enter title/body → check Published → **"Create Post"**
- **Replace photo (edit):** Click **Edit** ✏ → upload new photo → **"Update Post"**
- **Delete:** Click **Delete** 🗑 → confirm
- **Reorder:** **▲/▼** arrows
- **Publish/Unpublish:** Uncheck "Published" checkbox → **"Update Post"**

---

## 12. Documents Editor

**URL:** `/admin/documents`

Manages PDF documents (trust certificates, reports) shown on the About page.

**Public location:** "Certificates & Reports" section on the About page.

| Admin Field | Public Display |
|---|---|
| **Title (English) \*** | Document name in the list |
| **Title (Bengali)** | Bengali document name |
| **Description (English)** | Short description below the title |
| **Description (Bengali)** | Bengali description |
| **Date** | Shown alongside the document |
| **PDF File** | The downloadable PDF. A preview thumbnail is auto-generated from the first page. |

**How to manage:**
- **Add:** Click **"New Document"** → fill form → upload PDF → **"Create document"**
- **Replace PDF (edit):** Click **Edit** ✏ → upload new PDF → **"Update document"**
- **Delete:** Click **Delete** 🗑 → confirm (removes PDF + preview from Cloudinary)
- **Download:** Click **"Download PDF"** link
- **Reorder:** **▲/▼** arrows

---

## 13. Thank You Page Editor

**URL:** `/admin/thank-you`  
**Subtitle:** "Edit the text shown after a form is submitted successfully."

No tabs. All fields are bilingual:

| Admin Label | Example |
|---|---|
| **Page Eyebrow (EN)** | `"Thank You"` |
| **Page Eyebrow (Bangla)** | `"ধন্যবাদ"` |
| **Page Heading (EN)** | `"We've received your message!"` |
| **Page Heading (Bangla)** | Bengali version |
| **Page Body (EN)** | `"We'll get back to you within 2 business days."` |
| **Page Body (Bangla)** | Bengali version |
| **Button Label (EN)** | `"Back to Home"` |
| **Button Label (Bangla)** | Bengali version |

> **Save:** Click **"Save"** .

---

## 14. Not Found (404) Page Editor

**URL:** `/admin/not-found`  
**Subtitle:** "Edit the text shown when a visitor lands on a page that does not exist."

No tabs. All fields are bilingual:

| Admin Label | Example |
|---|---|
| **Page Eyebrow (shown before heading) (EN)** | `"404"` |
| **Page Eyebrow (Bangla)** | `"৪০৪"` |
| **Page Heading (EN)** | `"Page Not Found"` |
| **Page Heading (Bangla)** | Bengali version |
| **Page Body (EN)** | `"The page you are looking for does not exist or has been moved."` |
| **Page Body (Bangla)** | Bengali version |
| **Button Label (EN)** | `"Go Home"` |
| **Button Label (Bangla)** | Bengali version |

> **Save:** Click **"Save"** .

---

## 15. Settings

**URL:** `/admin/settings`  
**Subtitle:** "Manage the shared site identity, trust badges, contact details, and footer copy used across the public site."

### Brand Identity Section

#### NGO Logo

**Public location:** Header (top-left) and footer of every page.

| Admin Field | How it's managed |
|---|---|
| **Label:** "NGO Logo" | Click upload area to add/replace. Click × to delete. |

#### Text Fields

| Admin Label | Hint | Example |
|---|---|---|
| **NGO Name** (single text) | "Shown in the public header and footer" | `"Heritage of Hope Foundation"` |
| **Navbar Subtitle (EN)** | "Short line under the brand name in the public header" | `"Building brighter futures"` |
| **Navbar Subtitle (Bangla)** | Same, in Bengali | Bengali version |
| **Footer Mission Line (EN)** | "Short mission statement used in the public footer" | `"Empowering communities through education..."` |
| **Footer Mission Line (Bangla)** | Same, in Bengali | Bengali version |
| **Donate Button Label (EN)** | "Text for the header donate button" | `"Donate"` |
| **Donate Button Label (Bangla)** | Bengali version | `"দান করুন"` |
| **Facebook Link Text (EN)** | "Text for the footer Facebook follow link" | `"Follow us on Facebook"` |
| **Facebook Link Text (Bangla)** | Bengali version | Bengali version |

### Contact Details Section

| Admin Label | Type | Example |
|---|---|---|
| **Phone Number** | Single text | `"+91 08420119790"` |
| **Email Address** | Single text | `"heritageofhopefoundation@gmail.com"` |
| **Facebook Page URL** | Single text | `"https://facebook.com/..."` |
| **Address (EN)** | Bilingual | `"Sukantapally, Subhas Gram..."` |
| **Address (BN)** | Bilingual | Bengali version |
| **Contact Card Phone Label (EN)** | Bilingual | `"Phone"` |
| **Contact Card Phone Label (BN)** | Bilingual | `"ফোন"` |
| **Contact Card Email Label (EN)** | Bilingual | `"Email"` |
| **Contact Card Email Label (BN)** | Bilingual | `"ইমেল"` |
| **Contact Card Address Label (EN)** | Bilingual | `"Address"` |
| **Contact Card Address Label (BN)** | Bilingual | `"ঠিকানা"` |

### Trust Badges Section

**Public location:** Trust strip in the Home page hero area.

| Field | Example |
|---|---|
| **English (e.g., Est. 2005)** | `"Est. 2005"` |
| **Bangla** | `"প্রতিষ্ঠিত ২০০৫"` |

Each badge has two inputs (EN + BN). Use **"Remove"** to delete a badge, **"+ Add Badge"** to add a new row.

### Navigation Labels Section

Bilingual text for each header navigation link:

| EN Label | BN Label | Default (EN) | Default (BN) |
|---|---|---|---|
| **Home** | **Home (Bangla)** | `"Home"` | `"হোম"` |
| **About** | **About (Bangla)** | `"About"` | `"আমাদের কথা"` |
| **Our Work** | **Our Work (Bangla)** | `"Our Work"` | `"আমাদের কাজ"` |
| **Impact** | **Impact (Bangla)** | `"Impact"` | `"প্রভাব"` |
| **Gallery** | **Gallery (Bangla)** | `"Gallery"` | `"গ্যালারি"` |
| **Get Involved** | **Get Involved (Bangla)** | `"Get Involved"` | `"অংশগ্রহণ"` |
| **Contact** | **Contact (Bangla)** | `"Contact"` | `"যোগাযোগ"` |

### Accessibility Labels Section

| Admin Label | Example (EN) |
|---|---|
| **Hamburger Menu Aria Label** | `"Toggle navigation menu"` |
| **Hamburger Menu Aria Label (Bangla)** | Bengali version |
| **Navigation Aria Label** | `"Main navigation"` |
| **Navigation Aria Label (Bangla)** | Bengali version |

> **Save:** Click **"Save Settings"** .

---

### Image Summary: Every Page

| Page | Public Section | Image Type | Managed In | Admin URL |
|---|---|---|---|---|
| **Home** | Hero panel (right side) | Hero photo | HomeEditor → Hero Section | `/admin/home` |
| **Home** | Below hero photo | Cert thumbnail | HomeEditor → Hero Section | `/admin/home` |
| **Home** | Activity section (left column) | Activity post thumbnails (with date/title/body) | Activity Posts Editor | `/admin/activity-posts` |
| **Home** | Activity section (right column) | Showcase images (with single caption) | HomeEditor → Showcase Images | `/admin/home` |
| **Home** | Mission pillar cards (top 3) | Program images | Programs Editor | `/admin/programs` |
| **About** | Intro section (right side) | Hero photo | AboutEditor → Page Intro | `/admin/about` |
| **About** | Registration section | Certificate image | AboutEditor → Registration | `/admin/about` |
| **About** | Team section | Team member photos | Team Editor | `/admin/team` |
| **About** | Partners section | Partner logos | Partners Editor | `/admin/partners` |
| **About** | Documents section | PDF preview thumbnails | Documents Editor | `/admin/documents` |
| **Our Work** | Hero panel | Hero photo | OurWorkEditor → Intro Section | `/admin/our-work` |
| **Our Work** | Photo grid | Showcase photos (URL text input) | OurWorkEditor → Showcase Photos | `/admin/our-work` |
| **Our Work** | Program cards | Program images | Programs Editor | `/admin/programs` |
| **Gallery** | Filterable grid | Gallery photos by category | Gallery Manager | `/admin/gallery` |
| **Get Involved** | UPI section | QR code | GetInvolvedEditor → UPI/Payment | `/admin/get-involved` |
| **Get Involved** | Bank section | Specimen cheque | GetInvolvedEditor → Bank Details | `/admin/get-involved` |
| **Get Involved** | Partner section | Partnership photo | GetInvolvedEditor → Partner Section | `/admin/get-involved` |
| **Contact** | Bottom mosaic strip | Mosaic images (4 slots) | ContactEditor → Mosaic Images | `/admin/contact` |
| **Contact** | Facebook section | Activity post thumbnails | Activity Posts Editor | `/admin/activity-posts` |
| **All pages** | Header + footer | NGO logo | Settings → Brand Identity | `/admin/settings` |

---

## 16. Change Password

**URL:** `/admin/change-password`  
**Subtitle:** "Update the password for the currently signed-in admin account."

| Field | Details |
|---|---|
| **Current Password** | Your existing password |
| **New Password** | Min 8 characters |
| **Confirm New Password** | Must match New Password |

> **Save:** Click **"Update Password"** .

---

## General Rules That Apply Everywhere

1. **Supported image formats:** JPEG, PNG, WebP
2. **Max file size:** 10MB (Gallery: 5MB, Documents/PDF: 15MB)
3. **Automatic resizing on upload:** Hero images → 1920px max, Gallery/Programs → 1200px max, UPI QR → 600px max
4. **Replace = Delete + Upload:** Uploading a new image for an occupied slot deletes the old one from Cloudinary first
5. **Delete is permanent:** Removes from both database AND Cloudinary — cannot be undone
6. **Image uploads are immediate** (no "Save" button needed for the image itself). Text fields always need the section's **"Save"** button
7. **After any change:** The public site cache updates within ~60 seconds. Refresh the public page to see changes.

---

## Quick Reference: Admin Page URLs

| Page | URL |
|---|---|
| Home Editor | `/admin/home` |
| About Editor | `/admin/about` |
| Our Work Editor | `/admin/our-work` |
| Impact Editor | `/admin/impact` |
| Gallery Manager | `/admin/gallery` |
| Get Involved Editor | `/admin/get-involved` |
| Contact Editor | `/admin/contact` |
| Team Editor | `/admin/team` |
| Partners Editor | `/admin/partners` |
| Programs Editor | `/admin/programs` |
| Activity Posts Editor | `/admin/activity-posts` |
| Documents Editor | `/admin/documents` |
| Thank You Editor | `/admin/thank-you` |
| Not Found (404) Editor | `/admin/not-found` |
| Settings | `/admin/settings` |
| Change Password | `/admin/change-password` |
