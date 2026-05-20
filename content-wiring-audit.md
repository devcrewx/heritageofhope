# Heritage of Hope — Complete Content Wiring Audit

**Purpose:** Every text, image, caption, label, and piece of information on every public page → trace its origin (admin DB, Cloudinary, hardcoded) → confirm admin editability.

---

## 1. Shared Shell — Layout (Layout.jsx)

### Header

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `orgName` (brand name + aria-label) | SiteContent `siteMeta.orgName` | ✅ Settings → `org_name` field | Type new name, Save |
| `logoUrl` | SiteContent `siteMeta.logoUrl` | ✅ Settings → Logo upload | Upload new image → Cloudinary URL stored |
| `navSubtitle` (below brand name) | SiteContent `siteMeta.navSubtitle` | ✅ Settings → `navbar_subtitle` (bilingual) | Edit EN/BN, Save |
| Nav items (Home, About, ...) | `siteContent.navItems` — hardcoded in `siteContentContract.js` + `staticContent.js` | ❌ No NavItemsEditor exists. Items are fixed. | Would need: new DB model + admin CRUD API + frontend editor component + navItems to use DB |
| Language toggle label (`EN`/`বাংলা`) | Hardcoded `navCopy` object in Layout.jsx:36-38 | ❌ Hardcoded object, no DB field | Would need: DB field + Settings field + component reads it |
| "Donate Now" button text | Hardcoded `navCopy[language].donate` in Layout.jsx:162 | ❌ Hardcoded | Would need: DB field (e.g. `settings.donate_button_label`) + component reads from siteMeta |
| Hamburger aria-label ("Open navigation") | Hardcoded `text('Open navigation', 'মেনু খুলুন')` in Layout.jsx:127 | ❌ Hardcoded | Low-priority — accessibility label |

### Footer

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `orgName` | `siteMeta.orgName` | ✅ Settings → `org_name` | Same as header |
| `footerMission` | `siteMeta.footerMission` | ✅ Settings → `footer_mission` (bilingual) | Edit EN/BN, Save |
| "Follow us on Facebook" link text | Hardcoded `text('Follow us on Facebook', 'ফেসবুকে আমাদের সঙ্গে থাকুন')` Layout.jsx:182 | ❌ Hardcoded bilingual text() | Would need: DB field (e.g. `settings.facebook_label` bilingual) + component reads it |
| Facebook URL | `siteMeta.facebookUrl` (fallback: hardcoded literal in Layout.jsx:178) | ✅ Settings → `facebook_url` | Paste URL, Save |
| `phone` | `siteMeta.phone` | ✅ Settings → `phone` | Type, Save |
| `email` | `siteMeta.email` | ✅ Settings → `email` | Type, Save |
| `address` | `siteMeta.address` (bilingual) | ✅ Settings → `address` (bilingual) | Edit EN/BN, Save |

---

## 2. Home Page (Home.jsx)

### Hero Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `hero.eyebrow` | SiteContent `home.hero.eyebrow` | ✅ HomeEditor → Hero tab → Eyebrow field | Edit bilingual |
| `hero.headline` | SiteContent `home.hero.headline` | ✅ HomeEditor → Hero → Headline | Edit bilingual |
| `hero.intro` | SiteContent `home.hero.intro` | ✅ HomeEditor → Hero → Intro | Edit bilingual |
| 🔴 "Support a Program" CTA button | Hardcoded string `"Support a Program"` / `"Explore Our Work"` in Home.jsx:22,25 | ❌ **HARDCODED** | Would need DB fields (e.g. `home.hero.ctaPrimaryLabel` + `home.hero.ctaSecondaryLabel` bilingual) + HomeEditor fields + siteContent transform |
| 🔴 "Registration proof available on About page" | Hardcoded `text('Registration proof...')` in Home.jsx:47 | ❌ **HARDCODED** | Would need DB field (e.g. `home.hero.certCaption`) + HomeEditor field |
| Trust badges (badge1,2,3) | `home.hero.badge1/2/3` | ✅ HomeEditor → Hero → Badge fields | Edit each |
| `hero.heroFootnote` | `home.hero.heroFootnote` | ✅ HomeEditor → Hero → Footnote | Edit bilingual |
| `hero.heroImage` | Cloudinary URL | ✅ HomeEditor → Hero → Hero image upload | Upload new image |
| `hero.regCertThumb` | Cloudinary URL | ✅ HomeEditor → Reg cert thumb upload | Upload new image |
| `hero.figcaption` | `home.hero.figcaption` | ✅ HomeEditor → Hero → Figcaption | Edit bilingual |

### Stats Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.statsLabel` | SiteContent | ✅ HomeEditor → Page Labels → Stats Label | Edit bilingual |
| `pageContent.statsHeading` | SiteContent | ✅ HomeEditor → Page Labels → Stats Heading | Edit bilingual |
| Impact metrics (value + label pairs) | `ImpactStat` model | ✅ HomeEditor → Stats tab → Add/Delete | Type value + EN/BN label, Save |

### Mission / Pillars Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.pillarLabel` | SiteContent | ✅ HomeEditor → Page Labels → Pillar Label | Edit bilingual |
| `mission.heading` | SiteContent | ✅ HomeEditor → Mission → Heading | Edit bilingual |
| Featured programs (up to 3 cards via `.slice(0,3)`) | `Program` model (from DB) | ✅ ProgramsEditor → Full CRUD | Add: fill image + EN/BN title/desc/category/highlight. Edit: modify any field. Delete: remove. Reorder: drag. DB stores up to N, home shows 3. |

### Activity Section (Facebook Posts)

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.activityLabel` | SiteContent | ✅ HomeEditor → Page Labels → Activity Label | Edit bilingual |
| `pageContent.activityHeading` | SiteContent | ✅ HomeEditor → Page Labels → Activity Heading | Edit bilingual |
| Posts (up to 4, via `.slice(0,4)`) | `ActivityPost` model (from DB) | ✅ ActivityPostsEditor → Full CRUD | Add: date, image upload, bilingual title/body, publish toggle. Edit/Delete available. |

### Showcase Images (Photo Mosaic)

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| Images (up to 6 slots) | SiteContent `home.showcase.img{i}_url` | ✅ HomeEditor → Showcase tab → 6 image slots | Each: upload image (Cloudinary) + bilingual caption. Empty slots omitted. |

### CTA Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.donationLabel` | SiteContent | ✅ HomeEditor → Page Labels → Donation Label | Edit bilingual |
| `cta.headline` | SiteContent | ✅ HomeEditor → CTA → Headline | Edit bilingual |
| `cta.body` | SiteContent | ✅ HomeEditor → CTA → Body | Edit bilingual |
| `cta.buttonLabel` | SiteContent | ✅ HomeEditor → CTA → Button Label | Edit bilingual |

---

## 3. About Page (About.jsx)

### Hero Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ AboutEditor → Page Content → Eyebrow | Edit bilingual |
| `hero.pageTitle` | SiteContent `about.intro.title` | ✅ AboutEditor → Intro → Title | Edit bilingual |
| `hero.intro` | SiteContent `about.intro.paragraph` | ✅ AboutEditor → Intro → Paragraph | Edit bilingual (textarea) |
| `hero.heroImage` | Cloudinary URL | ✅ AboutEditor → Hero image upload | Upload/Delete image |

### Documents Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.documentsLabel` | SiteContent | ✅ AboutEditor → Page Content → Documents Label | Edit bilingual |
| `pageContent.documentsHeading` | SiteContent | ✅ AboutEditor → Page Content → Documents Heading | Edit bilingual |
| Documents (cards with view/download) | `Document` model | ✅ DocumentsEditor → Full CRUD | Add: title, date, description (bilingual), PDF upload, thumbnail preview. Edit/Delete/Reorder. PDF stored in Cloudinary, viewable in DocumentModal, downloadable client-side. |

### Story Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.storyLabel` | SiteContent | ✅ AboutEditor → Page Content → Story Label | Edit bilingual |
| `story.heading` | SiteContent | ✅ AboutEditor → Story → Heading | Edit bilingual |
| `story.body` | SiteContent | ✅ AboutEditor → Story → Body | Edit bilingual (textarea) |

### Mission & Vision

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.missionLabel` | SiteContent | ✅ AboutEditor → Page Content → Mission Label | Edit bilingual |
| `about.mission` | SiteContent `about.mission.statement` | ✅ AboutEditor → Mission → Statement | Edit bilingual (textarea) |
| `pageContent.visionLabel` | SiteContent | ✅ AboutEditor → Page Content → Vision Label | Edit bilingual |
| `about.vision` | SiteContent `about.mission.vision` | ✅ AboutEditor → Mission → Vision | Edit bilingual (textarea) |

### Core Values

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.valuesLabel` | SiteContent | ✅ AboutEditor → Page Content → Values Label | Edit bilingual |
| `pageContent.valuesHeading` | SiteContent | ✅ AboutEditor → Page Content → Values Heading | Edit bilingual |
| Core values (up to 4) | SiteContent `about.values.value{i}_title/description` | ✅ AboutEditor → Values tab → 4 slots | Each slot: bilingual title + bilingual description. Empty slots omitted. |

### Registration Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.regLabel` / `regHeading` | SiteContent | ✅ AboutEditor → Page Content → Reg Label/Heading | Edit bilingual |
| `registration.body` | SiteContent `about.registration.body` | ✅ AboutEditor → Registration → Body | Edit bilingual (textarea) |
| `registration.certImage` | Cloudinary URL | ✅ AboutEditor → Cert image upload | Upload/Delete image |
| `pageContent.certLabel` | SiteContent | ✅ AboutEditor → Page Content → Cert Label | Edit bilingual |

### Partners Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.partnersLabel` | SiteContent | ✅ AboutEditor → Page Content → Partners Label | Edit bilingual |
| Partner pills | `Partner` model | ✅ PartnersEditor → CRUD | Add/Edit/Delete partner name. Names displayed as pill badges. |

### Team Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.teamLabel` / `teamHeading` | SiteContent | ✅ AboutEditor → Page Content → Team Label/Heading | Edit bilingual |
| Team members (person cards) | `TeamMember` model | ✅ TeamEditor → Full CRUD | Add: photo upload (Cloudinary), name, bilingual role. Edit/Delete/Reorder. |

---

## 4. Our Work Page (OurWork.jsx)

### Hero Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ OurWorkEditor → Page Content → Eyebrow | Edit bilingual |
| `hero.pageTitle` | SiteContent `ourWork.hero.title` | ✅ OurWorkEditor → Hero → Title | Edit bilingual |
| `hero.intro` | SiteContent `ourWork.hero.intro` | ✅ OurWorkEditor → Hero → Intro | Edit bilingual |
| 🔴 "Focus areas" label | Hardcoded `"Focus areas"` in OurWork.jsx:26 | ❌ **HARDCODED** | Would need DB field + OurWorkEditor field |
| Focus tags (3, joined by `\|`) | SiteContent `ourWork.focus.tag1/2/3` | ✅ OurWorkEditor → Page Content → Focus Tags | 3 plain text fields |

### Showcase Mosaic (6 tiles)

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| Showcase images (6 tile mosaic) | SiteContent `ourWork.showcase.img{i}_url` | ✅ OurWorkEditor → Tiles tab → 6 image slots | Upload image per slot (Cloudinary). Captions NOT rendered on frontend (alt="" in JSX). Empty slots omitted. |

### Approach Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.approachLabel` | SiteContent | ✅ OurWorkEditor → Page Content → Approach Label | Edit bilingual |
| `approach.heading` | SiteContent `ourWork.approach.heading` | ✅ OurWorkEditor → Approach → Heading | Edit bilingual |
| Approach steps (up to 4, rendered as `<ol>`) | SiteContent `ourWork.approach.step1-4` | ✅ OurWorkEditor → Approach → Step fields | 4 text fields (bilingual). Empty omitted. |

### Join Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.joinLabel` | SiteContent | ✅ OurWorkEditor → Page Content → Join Label | Edit bilingual |
| `joinBox.body` | SiteContent `ourWork.join.body` | ✅ OurWorkEditor → Join → Body | Edit bilingual (textarea) |
| `joinBox.buttonLabel` | SiteContent `ourWork.join.button` | ✅ OurWorkEditor → Join → Button Label | Edit bilingual |

---

## 5. Impact Page (Impact.jsx)

### Hero Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ ImpactEditor → Page Content → Eyebrow | Edit bilingual |
| `hero.pageTitle` | SiteContent `impact.intro.title` | ✅ ImpactEditor → Intro → Title | Edit bilingual |
| `hero.subHeadline` | SiteContent `impact.intro.paragraph` | ✅ ImpactEditor → Intro → Paragraph | Edit bilingual |
| `pageContent.promiseLabel` | SiteContent | ✅ ImpactEditor → Page Content → Promise Label | Edit bilingual |
| `hero.promise` | SiteContent `impact.hero.promise` | ✅ ImpactEditor → Hero → Promise | Edit bilingual (textarea) |

### Impact Metrics

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| Metrics (value + label pairs) | `ImpactStat` model | ✅ ImpactEditor → Stats tab → Add/Delete | Add: numeric value (auto-appends `+`), EN/BN label. Delete available. No inline edit — delete + re-add to change. |

### Fund Allocation

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.fundLabel` / `fundHeading` | SiteContent | ✅ ImpactEditor → Page Content → Fund Label/Heading | Edit bilingual |
| Allocation items (category + %) | `FundAllocation` model | ✅ ImpactEditor → Allocation tab → Add/Delete | Add: bilingual category, percentage. Delete available. Edit not implemented — delete + re-add to change. |

### Feedback & Report

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.feedbackLabel` | SiteContent | ✅ ImpactEditor → Page Content → Feedback Label | Edit bilingual |
| `testimonial.quote` | SiteContent `impact.feedback.quote` | ✅ ImpactEditor → Feedback → Quote | Edit bilingual (textarea) |
| `pageContent.reportLabel` | SiteContent | ✅ ImpactEditor → Page Content → Report Label | Edit bilingual |
| `annualReport.body` | SiteContent `impact.report.status` | ✅ ImpactEditor → Report → Status | Edit bilingual (textarea) |

---

## 6. Gallery Page (Gallery.jsx)

### Header Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ GalleryManager → Edit page labels API (saves to `gallery.pageContent`) | Edit bilingual |
| `pageContent.heading` | SiteContent | ✅ Same as above | Edit bilingual |
| `pageContent.intro` | SiteContent | ✅ Same as above | Edit bilingual |
| `pageContent.filterLabel` | SiteContent | ✅ Same as above | Edit bilingual |
| `pageContent.filterText` | SiteContent | ✅ Same as above | Edit bilingual |
| 🔴 "Gallery categories" aria-label on filter row | Hardcoded `text('Gallery categories', 'ছবির বিভাগ')` in Gallery.jsx:46 | ❌ **HARDCODED** | Low-priority — accessibility label only |

### Filter Chips

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| 🔴 Filter chip labels ("All", "Education", etc.) | Hardcoded array in Gallery.jsx:11-16 with `text()` calls | ❌ **HARDCODED** | Would need DB-driven categories. Categories also need to match `item.category` on gallery items. Complex change — requires category model + admin CRUD + filter component reads from DB. |

### Gallery Items

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| Gallery photos | `GalleryItem` model | ✅ GalleryManager → Full CRUD | **Add:** upload image (Cloudinary), EN/BN alt text, category. **Edit:** modify alt/category. **Delete.** |

---

## 7. Get Involved Page (GetInvolved.jsx)

### Hero / Bank Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ GetInvolvedEditor → Labels tab → Eyebrow | Edit bilingual |
| `hero.pageTitle` | SiteContent `getInvolved.intro.title` | ✅ GetInvolvedEditor → Labels tab → Page Title (via pageContent) | Edit bilingual |
| `hero.intro` | SiteContent `getInvolved.intro.paragraph` | ✅ GetInvolvedEditor → Labels tab → Intro (via pageContent) | Edit bilingual |
| 🔴 "Bank details" header | Hardcoded `text('Bank details', 'ব্যাংক তথ্য')` in GetInvolved.jsx:33 | ❌ **HARDCODED** | Would need DB field |
| Bank details (name, bank, A/C, IFSC) | SiteContent `getInvolved.bank.*` | ✅ GetInvolvedEditor → Bank tab | 4 text fields. Saved to DB as `bank.accountName`, `bank.bankName`, `bank.accountNumber`, `bank.ifsc`. |
| 🔴 "View specimen cheque" button | Hardcoded `text('View specimen cheque', 'চেক দেখুন')` in GetInvolved.jsx:40 | ❌ **HARDCODED** | Would need DB field |
| 🔴 "Specimen cheque" modal title | Hardcoded `text('Specimen cheque', 'নমুনা চেক')` in GetInvolved.jsx:39 | ❌ **HARDCODED** | Would need DB field |
| Specimen cheque image | SiteContent `getInvolved.bank.chequeUrl` | ✅ GetInvolvedEditor → Bank tab → Cheque image upload | Upload image (Cloudinary) |

### Donation Tiers Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.donationLabel` / `donationHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| Donation tiers (amount + label) | `DonationTier` model | ✅ GetInvolvedEditor → Donation Tiers tab → Full CRUD | **Add:** amount number + bilingual label. **Edit:** modify. **Delete.** |

### Payment / UPI Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.paymentLabel` / `paymentHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| UPI QR image | Cloudinary URL | ✅ GetInvolvedEditor → Payment tab → Upload UPI QR | Upload image |
| UPI deep link (intent URL for Pay via UPI app) | SiteContent `getInvolved.upi.intentUrl` | ✅ GetInvolvedEditor → Payment tab → UPI Intent URL (text field) | Edit URL |
| 🔴 "Pay via UPI app" link text | Hardcoded `"Pay via UPI app"` in GetInvolved.jsx:79 | ❌ **HARDCODED** | Would need DB field |
| 🔴 3 UPI hint paragraphs (QR-note) | Hardcoded strings in GetInvolved.jsx:82-84 | ❌ **HARDCODED** | Would need 3 DB textarea fields |

### Volunteer Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.volunteerLabel` / `volunteerHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `pageContent.volunteerFormLabel` / `volunteerFormHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `volunteer.heading` | SiteContent | ✅ GetInvolvedEditor → Volunteer tab → Heading | Edit bilingual |
| Volunteer roles (title + description) | `VolunteerRole` model | ✅ GetInvolvedEditor → Volunteer tab → Full CRUD | **Add:** bilingual title + description. **Edit/Delete.** Roles populate the "Area of interest" dropdown. |
| 🔴 Form labels ("Name", "Email", "Phone", "Area of interest", "Availability", "Message") | Hardcoded in GetInvolved.jsx:140-179 | ❌ **HARDCODED** | Standard form labels. To be admin-controllable, would need DB fields per label. |
| 🔴 Availability options ("Weekends", "Weekdays", "Occasionally") | Hardcoded `<option>` values in GetInvolved.jsx:171-173 | ❌ **HARDCODED** | Would need DB model for availability options |
| 🔴 Submit button "Submit volunteer interest" | Hardcoded in GetInvolved.jsx:182 | ❌ **HARDCODED** | Would need DB field |

### Partner Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.partnerLabel` / `partnerHeading` / `partnerSubtitle` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `pageContent.partnerFormLabel` / `partnerFormHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `partnerSection.body` (figcaption) | SiteContent `getInvolved.partner.description` | ✅ GetInvolvedEditor → Partner tab → Description | Edit bilingual (textarea) |
| `partnerSection.image` | Cloudinary URL | ✅ GetInvolvedEditor → Partner tab → Photo upload | Upload image |
| 🔴 Form labels ("Organization name", "Contact person", "Email", "Phone", "Type of partnership", "Message") | Hardcoded in GetInvolved.jsx:236-265 | ❌ **HARDCODED** | Standard form labels. Would need DB fields. |
| 🔴 Partnership type options ("CSR", "Hospital / Medical", "Institution / School", "Other") | Hardcoded `<option>` values in GetInvolved.jsx:256-261 | ❌ **HARDCODED** | Would need DB model |
| 🔴 Submit button "Submit partner inquiry" | Hardcoded in GetInvolved.jsx:268 | ❌ **HARDCODED** | Would need DB field |

---

## 8. Contact Page (Contact.jsx)

### Hero Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ ContactEditor → Page Content → Eyebrow | Edit bilingual |
| `contact.pageTitle` | SiteContent (`settings.contact_page_title`) | ✅ Settings → saved with key `contact_page_title` (bilingual) | Edit via Settings page |
| `contact.intro` | SiteContent (`settings.contact_page_intro`) | ✅ Settings → `contact_page_intro` (bilingual) | Edit via Settings page |
| `contact.responseLabel` | SiteContent (`settings.contact_response_label`) | ✅ Settings → `contact_response_label` (bilingual) | Edit via Settings page |
| `contact.responseValue` | SiteContent (`settings.contact_response_value`) | ✅ Settings → `contact_response_value` (bilingual) | Edit via Settings page |

### Contact Info Cards

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| 🔴 "Phone" meta label | Hardcoded `"Phone"` in Contact.jsx:31 | ❌ **HARDCODED** | Would need DB field |
| `siteMeta.phone` | Settings `phone` | ✅ Settings → `phone` | Type, Save |
| 🔴 "Email" meta label | Hardcoded `"Email"` in Contact.jsx:37 | ❌ **HARDCODED** | Would need DB field |
| `siteMeta.email` | Settings `email` | ✅ Settings → `email` | Type, Save |
| 🔴 "Address" meta label | Hardcoded `"Address"` in Contact.jsx:43 | ❌ **HARDCODED** | Would need DB field |
| `siteMeta.address` | Settings `address` (bilingual) | ✅ Settings → `address` | Edit EN/BN |

### Map & Form

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| 🔴 iframe title "Heritage of Hope Foundation location" | Hardcoded in Contact.jsx:52 | ❌ **HARDCODED** | Low-priority — accessibility attribute |
| `contact.mapEmbedUrl` | SiteContent `contact.map.embedUrl` | ✅ ContactEditor → Map Embed URL | Paste Google Maps embed URL |
| Fallback map URL in component | Hardcoded literal in Contact.jsx:53 | ❌ Fallback literal | Only shows if DB & static fallback both empty |
| `contact.formLabel` / `formHeading` | SiteContent (from `settings.contact_form_label/heading`) | ✅ Settings → `contact_form_label` / `contact_form_heading` | Edit bilingual |
| 🔴 Form labels ("Name", "Email", "Subject", "Message") | Hardcoded in Contact.jsx:92-112 | ❌ **HARDCODED** | Would need DB fields |
| 🔴 Placeholders ("Your name", "you@example.com", "Tell us how you want to help") | Hardcoded in Contact.jsx:93-111 | ❌ **HARDCODED** | Would need DB fields |
| 🔴 Submit button "Send message" | Hardcoded in Contact.jsx:115 | ❌ **HARDCODED** | Would need DB field |

### Facebook Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.facebookLabel` / `facebookHeading` | SiteContent | ✅ ContactEditor → Page Content → Facebook Label/Heading | Edit bilingual |
| 🔴 "Visit Official Facebook Page →" button | Hardcoded in Contact.jsx:127 | ❌ **HARDCODED** | Would need DB field |
| Facebook URL | `siteMeta.facebookUrl` | ✅ Settings → `facebook_url` | Paste URL |
| Posts (slots 3-5 via `.slice(3,6)`) | `ActivityPost` model (shared with home) | ✅ ActivityPostsEditor → Full CRUD | Same posts as home activity section |

### Mosaic Images

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| Images (4 slots, with figcaptions) | SiteContent `contact.mosaic.img{i}_url/labelEn/labelBn` | ✅ ContactEditor → Mosaic images → 4 slots | Each: upload image (Cloudinary) + bilingual caption. Empty slots omitted. |

---

## 9. Thank You Page (ThankYou.jsx)

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ ThankYouEditor → Page Content → Eyebrow | Edit bilingual |
| `pageContent.heading` | SiteContent | ✅ Same → Heading | Edit bilingual |
| `pageContent.body` | SiteContent | ✅ Same → Body | Edit bilingual (textarea) |
| `pageContent.buttonLabel` | SiteContent | ✅ Same → Button Label | Edit bilingual |

---

## 10. Not Found Page (NotFound.jsx)

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.eyebrow` | SiteContent | ✅ NotFoundEditor → Page Content → Eyebrow | Edit bilingual |
| `pageContent.heading` | SiteContent | ✅ Same → Heading | Edit bilingual |
| `pageContent.body` | SiteContent | ✅ Same → Body | Edit bilingual (textarea) |
| `pageContent.buttonLabel` | SiteContent | ✅ Same → Button Label | Edit bilingual |

---

## Summary — Hardcoded Items (Not Admin-Controllable)

### Tier 1: Layout & Navigation
| # | Location | What's Hardcoded | Effort to Fix |
|---|----------|-----------------|---------------|
| 1 | Layout.jsx:114 | Logo `alt=""` (empty) | Trivial — use `orgName` or add alt-text DB field |
| 2 | Layout.jsx:36-38 | "Donate Now" / "সহযোগিতার হাত..." button text | Low — add `settings.donate_button_label` bilingual field |
| 3 | Layout.jsx:127 | Hamburger `aria-label` | Low — add DB field |
| 4 | Layout.jsx:137 | Nav `aria-label` "Primary navigation" | Low — add DB field |
| 5 | Layout.jsx:182 | "Follow us on Facebook" / "ফেসবুকে আমাদের সঙ্গে থাকুন" | Low — add `settings.facebook_label` bilingual field |

### Tier 2: Home Page CTAs
| # | Location | What's Hardcoded | Effort to Fix |
|---|----------|-----------------|---------------|
| 6 | Home.jsx:22 | "Support a Program" CTA | Low — add home hero CTAs (2 fields) to HomeEditor |
| 7 | Home.jsx:25 | "Explore Our Work" CTA | Low — same as above |
| 8 | Home.jsx:47 | "Registration proof available on About page" | Low — add `hero.certCaption` to HomeEditor |

### Tier 3: Our Work Page
| # | Location | What's Hardcoded | Effort to Fix |
|---|----------|-----------------|---------------|
| 9 | OurWork.jsx:26 | "Focus areas" label | Low — add to OurWorkEditor pageContent |

### Tier 4: Gallery Page
| # | Location | What's Hardcoded | Effort to Fix |
|---|----------|-----------------|---------------|
| 10 | Gallery.jsx:12-16 | Filter chip labels ("All", "Education", etc.) | **High** — requires category model + admin CRUD + dynamic filter generation |
| 11 | Gallery.jsx:46 | "Gallery categories" aria-label | Low — add to gallery pageContent |

### Tier 5: Get Involved
| # | Location | What's Hardcoded | Effort to Fix |
|---|----------|-----------------|---------------|
| 12 | GetInvolved.jsx:33 | "Bank details" section label | Low — add to page labels |
| 13 | GetInvolved.jsx:39-40 | "Specimen cheque" / "View specimen cheque" | Low — add 2 bilingual fields |
| 14 | GetInvolved.jsx:79 | "Pay via UPI app" link text | Low — add field to payment tab |
| 15 | GetInvolved.jsx:82-84 | 3 UPI hint paragraphs | Medium — add 3 textarea fields to payment tab |
| 16 | GetInvolved.jsx:140-182 | Volunteer form labels + submit button | **Medium-High** — 7+ hardcoded strings (Name, Email, Phone, Area of interest, Availability, Message, Submit) |
| 17 | GetInvolved.jsx:171-173 | Availability options dropdown | Medium — needs DB model + API |
| 18 | GetInvolved.jsx:236-268 | Partner form labels + submit button | **Medium-High** — 8+ hardcoded strings |
| 19 | GetInvolved.jsx:256-261 | Partnership type options | Medium — needs DB model + API |

### Tier 6: Contact Page
| # | Location | What's Hardcoded | Effort to Fix |
|---|----------|-----------------|---------------|
| 20 | Contact.jsx:31,37,43 | "Phone", "Email", "Address" meta labels | Medium — 3 bilingual fields |
| 21 | Contact.jsx:92-115 | Form labels + placeholders + submit button | **Medium-High** — 6+ strings |
| 22 | Contact.jsx:127 | "Visit Official Facebook Page →" | Low — add bilingual field |
| 23 | Contact.jsx:52 | Map iframe title attribute | Trivial — add field or use orgName |

---

## Summary — Admin-Editable Content Areas

| Admin Editor | Controls Content On | What You Can Edit |
|-------------|-------------------|-------------------|
| **Settings** | All pages (header, footer, contact) | org name, subtitle, badge, est year, footer mission, phone, email, address, Facebook URL, logo, contact page labels |
| **HomeEditor** | Home page | Hero (headline, intro, image, badges, footnote, figcaption, cert), impact stats (CRUD), mission heading, page labels, showcase images (6 slots), CTA |
| **AboutEditor** | About page | Intro, story, mission/vision, values (4 slots), registration body + image, page labels |
| **OurWorkEditor** | Our Work page | Hero, focus tags, approach steps/heading, page labels, join box, showcase tiles (6 slots) |
| **ImpactEditor** | Impact page | Intro, hero promise, page labels, impact stats (CRUD), fund allocation (CRUD), feedback quote, report body |
| **GalleryManager** | Gallery page | Page labels, gallery items (CRUD with image upload + alt text + category) |
| **ProgramsEditor** | Home (pillars), Our Work (featured) | Full CRUD: image, bilingual title/desc/category/highlight, reorder |
| **TeamEditor** | About (team) | Full CRUD: photo upload, bilingual name + role, reorder |
| **PartnersEditor** | About (partners) | CRUD: simple name list |
| **DocumentsEditor** | About (documents) | Full CRUD: bilingual title/desc/date, PDF upload, thumbnail, reorder |
| **ActivityPostsEditor** | Home (posts), Contact (posts) | Full CRUD: date, image upload, bilingual title/body, publish toggle |
| **GetInvolvedEditor** | Get Involved page | Page labels, donation tiers (CRUD), bank details (4 fields + cheque image), UPI QR + intent URL, volunteer roles (CRUD), partner section |
| **ContactEditor** | Contact page | Page labels, map embed URL, mosaic images (4 slots with bilingual captions) |
| **ThankYouEditor** | Thank You page | Page content (eyebrow, heading, body, button) |
| **NotFoundEditor** | 404 page | Page content (eyebrow, heading, body, button) |
