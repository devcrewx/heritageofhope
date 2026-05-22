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

| Admin Label | "Hero Photo" |
|---|---|
| Helper text | "This image appears in the main Home page hero panel." |
| Public location | The large image on the right side of the hero panel |
| Action | Click the upload area to add/replace; click × to delete |
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
| **Registration Certificate Thumbnail** | Small image below hero photo | Upload a small thumbnail (~120×120px) of the registration cert |

#### Hero CTA Buttons

| Admin Label | Public Location | Example |
|---|---|---|
| **Primary CTA Label (EN)** | "Support a Program" button text | `"Support a Program"` |
| **Primary CTA Label (BN)** | Same, in Bengali | `"সহায়তা করুন"` |
| **Secondary CTA Label (EN)** | "Explore Our Work" button text | `"Explore Our Work"` |
| **Secondary CTA Label (BN)** | Same, in Bengali | `"আমাদের কাজ দেখুন"` |
| **Cert Caption (EN)** | Text below certificate thumbnail | `"Registration proof available on About page"` |
| **Cert Caption (BN)** | Same, in Bengali | `"নিবন্ধনের প্রমাণ 'আমাদের কথা' পাতায়"` |

> **Save button:** Click **"Save Hero"** after editing text (images save automatically on upload).

---

### Tab: Impact Stats

Manages the numbered stats row (e.g., "200+ Children Supported").

| Admin Label | Public Location |
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

Maximum 6 images that appear in the photo mosaic on the Home page (right side, below the activity posts).

Each slot has:

| Field | Label | Example |
|---|---|---|
| Image upload | `"Image {N}"` | Upload area |
| **Label (English)** | `"Label (English)"` | `"Learning Space"` |
| **Label (Bangla)** | `"Label (Bangla)"` | `"শিক্ষা কেন্দ্র"` |

> **Save:** Click **"Save Showcase Labels"** after editing labels.

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

| Admin Label | Public Location | Example |
|---|---|---|
| **Hero Photo** | Image on the right side of the intro section | Upload area |
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

| Admin Label | Example |
|---|---|
| **Certificate Image** | Upload the registration certificate image |
| **Registration Body Text (EN)** | Paragraph explaining the registration status |
| **Registration Body Text (Bangla)** | Same, in Bengali |

---

## 3. Our Work Page Editor

**URL:** `/admin/our-work`  
**Subtitle:** "This controls the public Our Work page text sections. Program cards still use the shared program content."

No tabs — all sections are stacked vertically.

---

### Intro Section

| Admin Label | Example |
|---|---|
| **Hero Photo** | Upload area — appears in the hero panel |
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

Up to 6 photo slots. Each has:

| Field | Type |
|---|---|
| **Image URL** | Text input — paste a Cloudinary URL directly (no file upload widget) |
| **Label (EN)** | Text input |
| **Label (BN)** | Text input |

> **To add an image:** Upload the image in Gallery Manager first, then copy its Cloudinary URL and paste into the Image URL field.

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
| **Page Eyewbrow (Bangla)** | `"প্রভাব"` |
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

| Field | Type |
|---|---|
| **Category** | Dropdown: Gallery, Team, Events, Programs |
| **Alt Text EN** | Text input |
| **Alt Text BN** | Text input |
| **Image files** | Drag-drop or file picker (up to 5 files at once, JPG/PNG/WebP, max 5MB each) |
| **Upload button** | `"Upload {N} Image(s)"` |

### Editing Existing Photos

Click **Edit** ✏ on any photo to change:
- Category dropdown
- Alt text (EN/BN)

Use **▲/▼** to reorder. Click **Delete** 🗑 to permanently remove from Cloudinary + database.

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

| Admin Label | Example |
|---|---|
| **Account Name (EN)** | `"Heritage of Hope Foundation"` |
| **Account Name (BN)** | Bengali version |
| **Bank & Branch (EN)** | `"State Bank of India, XYZ Branch"` |
| **Bank & Branch (BN)** | Bengali version |
| **Account Number (English only)** | `"43107075580"` |
| **IFSC Code (English only)** | `"SBIN0008438"` |
| **Specimen Cheque Image** | Upload area — image of a sample cheque for reference |

---

### Tab: UPI / Payment

| Admin Label | Details |
|---|---|
| **UPI QR Code** | Upload a scan-friendly QR code image (600px max, quality 100) |

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

| Admin Label | Example |
|---|---|
| **Partnership Photo** | Upload area — image displayed in the partnership section |
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

4 image slots shown in the photo strip at the bottom of the Contact page.  
Each slot has:

| Field | Example |
|---|---|
| Image upload | Click to upload |
| **Label (EN)** | `"In Action"` |
| **Label (BN)** | `"সক্রিয় অবস্থায়"` |

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

## 8. Team Editor

**URL:** `/admin/team`

Manages team member cards shown on the About page.

### Add/Edit Form

| Admin Label | Details |
|---|---|
| **Name \*** | Required, bilingual not available (single text) — e.g., `"Dr. Sharma"` |
| **Role (English)** | Text — e.g., `"Founder & Director"` |
| **Role (Bengali)** | Text — e.g., `"প্রতিষ্ঠাতা ও পরিচালক"` |
| **Photo** | File input — JPG/PNG/WebP |

### Actions

| Button | What it does |
|---|---|
| **Add Member** | Creates a new team member |
| **Update Member** | Saves edits to an existing member |
| **Cancel** | Cancels editing |
| **Edit** (per row) | Opens the member in edit mode |
| **Delete** (per row) | Removes the member permanently |
| **▲/▼** (per row) | Reorder display order |

---

## 9. Partners Editor

**URL:** `/admin/partners`

Manages partner logos shown on the About page.

### Add/Edit Form

| Admin Label | Details |
|---|---|
| **Partner Name \*** | Required, e.g., `"Global Health Initiative"` |
| **Logo** | File input for the partner's logo image |
| **Active (show on public site)** | Checkbox — unchecked partners are hidden |

### Actions

| Button | What it does |
|---|---|
| **Add Partner** | Create new partner |
| **Update Partner** | Save edits |
| **Cancel** | Cancel editing |
| **Edit** (per row) | Edit a partner |
| **Delete** (per row) | Remove permanently |
| **View** (per row) | Opens logo in a new tab |
| **▲/▼** (per row) | Reorder |

---

## 10. Programs Editor

**URL:** `/admin/programs`

Manages featured program cards. These appear as mission pillar cards on the Home page and as program cards on the Our Work page.

### Add/Edit Form

| Admin Label | Details |
|---|---|
| **Slug \*** | URL-friendly identifier, e.g., `"education-initiative"` (lowercase, hyphens only) |
| **Title (EN)** | Bilingual — e.g., `"Education Initiative"` |
| **Title (BN)** | Bengali title |
| **Category (EN)** | Bilingual — e.g., `"Education"` |
| **Category (BN)** | Bengali category |
| **Description (EN)** | Bilingual, textarea — short description |
| **Description (BN)** | Bengali description |
| **Highlight (EN)** | Bilingual — a standout stat or phrase |
| **Highlight (BN)** | Bengali highlight |
| **Program Image** | Image upload — required when creating |

### Actions

| Button | What it does |
|---|---|
| **Create** | Create new program |
| **Update** | Save edits |
| **Cancel** | Cancel editing |
| **Edit** (per row) | Edit a program |
| **Delete** (per row) | Remove permanently |
| **▲/▼** (per row) | Reorder (top 3 appear as pillars on Home page) |

---

## 11. Activity Posts Editor

**URL:** `/admin/activity-posts`

Manages activity posts that appear as a Facebook-style feed on the Home page (first 4) and Contact page (posts 4–6).

### Add/Edit Form

| Admin Label | Details |
|---|---|
| **Date \*** | Date picker — required |
| **Title (English) \*** | Required, 3–150 characters |
| **Title (Bengali)** | Optional, max 150 characters |
| **Body (English)** | Textarea, max 2000 characters |
| **Body (Bengali)** | Textarea, max 2000 characters |
| **Photo** | File input for the post image |
| **Published (visible on public site)** | Checkbox — unchecked posts are drafts (hidden) |

### Actions

| Button | What it does |
|---|---|
| **Create Post** | New activity post |
| **Update Post** | Save edits |
| **Cancel** | Cancel editing |
| **Edit** (per row) | Edit a post |
| **Delete** (per row) | Remove permanently |
| **▲/▼** (per row) | Reorder |
| **Published / Draft** badge | Visual indicator of publish status |

---

## 12. Documents Editor

**URL:** `/admin/documents`

Manages PDF documents (trust certificates, reports) shown on the About page.

### Add/Edit Form

| Admin Label | Details |
|---|---|
| **Title (English) \*** | Required, 3–200 characters |
| **Title (Bengali)** | Optional, max 200 characters |
| **Description (English)** | Textarea, max 1000 characters |
| **Description (Bengali)** | Textarea, max 1000 characters |
| **Date** | Date picker |
| **PDF File** | PDF upload (max 15MB). A preview image is auto-generated from the first page. |

### Actions

| Button | What it does |
|---|---|
| **New Document** | Opens the form |
| **Create document** | Create new document |
| **Update document** | Save edits |
| **Cancel edit** | Cancel editing |
| **Edit** (per row) | Edit document |
| **Delete** (per row) | Remove permanently (deletes PDF + preview from Cloudinary) |
| **Download PDF** (per row) | Download the PDF file |
| **▲/▼** (per row) | Reorder |

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

| Admin Label | Hint | Example |
|---|---|---|
| **NGO Logo** | Upload area — shown in header and footer | Upload a logo image |
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

Bilingual badges shown in the trust strip on the Home page hero area.

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
