# Heritage of Hope — Complete Content Wiring Audit

**Purpose:** Every text, image, caption, label, and piece of information on every public page → trace its origin (admin DB, Cloudinary, hardcoded) → confirm admin editability.

**Status:** ✅ = Wired & admin-editable | ❌ = Still hardcoded | 🔧 = Recently wired (May 2026)

---

## 1. Shared Shell — Layout (Layout.jsx)

### Header

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `orgName` (brand name + aria-label) | SiteContent `siteMeta.orgName` | ✅ Settings → `org_name` field | Type new name, Save |
| `logoUrl` | SiteContent `siteMeta.logoUrl` | ✅ Settings → Logo upload | Upload new image → Cloudinary URL stored |
| `navSubtitle` (below brand name) | SiteContent `siteMeta.navSubtitle` | ✅ Settings → `navbar_subtitle` (bilingual) | Edit EN/BN, Save |
| Nav items (Home, About, ...) | SiteContent `siteMeta.navItems.*` | ✅ Settings → Navigation Labels (7 items) | Edit any label EN/BN, Save |
| Language toggle label (`EN`/`বাংলা`) | Hardcoded in Layout.jsx:154-156 | ❌ Hardcoded — shows opposite language abbreviation | Trivial — no DB field needed (always correct by definition) |
| `donateButtonLabel` | `siteMeta.donateButtonLabel` | ✅ Settings → Donate Button Label | Edit bilingual, Save |
| `hamburgerAriaLabel` | `siteMeta.hamburgerAriaLabel` | ✅ Settings → Accessibility Labels → Hamburger Menu Label | Edit bilingual, Save |
| `navAriaLabel` | `siteMeta.navAriaLabel` | ✅ Settings → Accessibility Labels → Navigation Label | Edit bilingual, Save |
| **Logo `alt`** | Hardcoded `alt=""` in Layout.jsx:110 | ❌ Empty alt — intentional for decorative brand logo | Not needed |

### Footer

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `orgName` | `siteMeta.orgName` | ✅ Settings → `org_name` | Same as header |
| `footerMission` | `siteMeta.footerMission` | ✅ Settings → `footer_mission` (bilingual) | Edit EN/BN, Save |
| `facebookLabel` ("Follow us on Facebook") | `siteMeta.facebookLabel` | ✅ Settings → Facebook Label | Edit bilingual, Save |
| Facebook URL | `siteMeta.facebookUrl` (fallback: hardcoded literal) | ✅ Settings → `facebook_url` | Paste URL, Save |
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
| `ctaPrimaryLabel` ("Support a Program") | SiteContent `home.hero.ctaPrimaryLabel` | ✅ HomeEditor → Hero → CTA Primary Label | Edit bilingual |
| `ctaSecondaryLabel` ("Explore Our Work") | SiteContent `home.hero.ctaSecondaryLabel` | ✅ HomeEditor → Hero → CTA Secondary Label | Edit bilingual |
| `certCaption` ("Registration proof...") | SiteContent `home.hero.certCaption` | ✅ HomeEditor → Hero → Cert Caption | Edit bilingual |
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
| Featured programs (up to 3 cards via `.slice(0,3)`) | `Program` model (from DB) | ✅ ProgramsEditor → Full CRUD | Add: fill image + EN/BN title/desc/category/highlight. Edit: modify any field. Delete: remove. Reorder: drag. |

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
| Documents (cards with view/download) | `Document` model | ✅ DocumentsEditor → Full CRUD | Add: title, date, description (bilingual), PDF upload, thumbnail preview. Edit/Delete/Reorder. |

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
| Partner pills | `Partner` model | ✅ PartnersEditor → CRUD | Add/Edit/Delete partner name |

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
| `pageContent.focusLabel` ("Focus areas") | SiteContent `ourWork.pageContent.focusLabel` | ✅ OurWorkEditor → Page Content → Focus Label | Edit bilingual |
| Focus tags (3, joined by `\|`) | SiteContent `ourWork.focus.tag1/2/3` | ✅ OurWorkEditor → Page Content → Focus Tags | 3 plain text fields |

### Showcase Mosaic (6 tiles)

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| Showcase images (6 tile mosaic) | SiteContent `ourWork.showcase.img{i}_url` | ✅ OurWorkEditor → Tiles tab → 6 image slots | Upload image per slot (Cloudinary). Empty slots omitted. |

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
| Metrics (value + label pairs) | `ImpactStat` model | ✅ ImpactEditor → Stats tab → Add/Delete | Add: numeric value (auto-appends `+`), EN/BN label. Delete available. |

### Fund Allocation

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.fundLabel` / `fundHeading` | SiteContent | ✅ ImpactEditor → Page Content → Fund Label/Heading | Edit bilingual |
| Allocation items (category + %) | `FundAllocation` model | ✅ ImpactEditor → Allocation tab → Add/Delete | Add: bilingual category, percentage. Delete available. |

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
| `pageContent.eyebrow` | SiteContent | ✅ GalleryManager → Page Content → Eyebrow | Edit bilingual |
| `pageContent.heading` | SiteContent | ✅ GalleryManager → Page Content → Heading | Edit bilingual |
| `pageContent.intro` | SiteContent | ✅ GalleryManager → Page Content → Intro | Edit bilingual |
| `pageContent.filterLabel` | SiteContent | ✅ GalleryManager → Page Content → Filter Label | Edit bilingual |
| `pageContent.filterText` | SiteContent | ✅ GalleryManager → Page Content → Filter Text | Edit bilingual |
| `pageContent.filterAriaLabel` ("Gallery categories") | SiteContent `gallery.pageContent.filterAriaLabel` | ✅ GalleryManager → Page Content → Filter Aria Label | Edit bilingual |

### Filter Chips

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| "All" chip label | SiteContent `gallery.pageContent.filterChipAll` | ✅ GalleryManager → Page Content → Filter Chip Labels | Edit bilingual |
| "Education" chip label | SiteContent `gallery.pageContent.filterChipEducation` | ✅ GalleryManager → Page Content → Filter Chip Labels | Edit bilingual |
| "Healthcare" chip label | SiteContent `gallery.pageContent.filterChipHealthcare` | ✅ GalleryManager → Page Content → Filter Chip Labels | Edit bilingual |
| "Welfare" chip label | SiteContent `gallery.pageContent.filterChipWelfare` | ✅ GalleryManager → Page Content → Filter Chip Labels | Edit bilingual |

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
| `hero.pageTitle` | SiteContent `getInvolved.intro.title` | ✅ GetInvolvedEditor → Labels tab → Page Title | Edit bilingual |
| `hero.intro` | SiteContent `getInvolved.intro.paragraph` | ✅ GetInvolvedEditor → Labels tab → Intro | Edit bilingual |
| `pageContent.bankLabel` ("Bank details") | SiteContent `getInvolved.pageContent.bankLabel` | ✅ GetInvolvedEditor → Labels tab → Bank Label | Edit bilingual |
| Bank details (name, bank, A/C, IFSC) | SiteContent `getInvolved.bank.*` | ✅ GetInvolvedEditor → Bank tab | 4 text fields |
| `pageContent.chequeButtonLabel` ("View specimen cheque") | SiteContent `getInvolved.pageContent.chequeButtonLabel` | ✅ GetInvolvedEditor → Labels tab → Cheque Button Label | Edit bilingual |
| `pageContent.chequeModalTitle` ("Specimen cheque") | SiteContent `getInvolved.pageContent.chequeModalTitle` | ✅ GetInvolvedEditor → Labels tab → Cheque Modal Title | Edit bilingual |
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
| UPI deep link (intent URL) | SiteContent `getInvolved.upi.intentUrl` | ✅ GetInvolvedEditor → Payment tab → UPI Intent URL | Edit URL |
| `upiLabels.buttonLabel` ("Pay via UPI app") | SiteContent `getInvolved.upiLabels.buttonLabel` | ✅ GetInvolvedEditor → Payment tab → UPI Labels (Save under payment tab) | Edit bilingual |
| `upiLabels.mobileHint` (QR-note 1) | SiteContent `getInvolved.upiLabels.mobileHint` | ✅ GetInvolvedEditor → Payment tab → UPI Mobile Hint | Edit bilingual (textarea) |
| `upiLabels.fallbackHint` (QR-note 2) | SiteContent `getInvolved.upiLabels.fallbackHint` | ✅ GetInvolvedEditor → Payment tab → UPI Fallback Hint | Edit bilingual (textarea) |
| `upiLabels.qrHint` (QR-note 3) | SiteContent `getInvolved.upiLabels.qrHint` | ✅ GetInvolvedEditor → Payment tab → UPI QR Hint | Edit bilingual (textarea) |

### Volunteer Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.volunteerLabel` / `volunteerHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `pageContent.volunteerFormLabel` / `volunteerFormHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `volunteer.heading` | SiteContent | ✅ GetInvolvedEditor → Volunteer tab → Heading | Edit bilingual |
| Volunteer roles (title + description) | `VolunteerRole` model | ✅ GetInvolvedEditor → Volunteer tab → Full CRUD | **Add:** bilingual title + description. **Edit/Delete.** Roles populate "Area of interest" dropdown. |
| **Form labels** (Name, Email, Phone, Area of interest, Availability, Message) | `getInvolved.volunteerFormLabels.*` | ✅ GetInvolvedEditor → Volunteer Form Labels (12 bilingual fields) | Edit any label/placeholder/error message, Save |
| **Availability options** (Weekends, Weekdays, Occasionally) | `volunteerFormLabels.availabilityWeekends/Weekdays/Occasional` | ✅ GetInvolvedEditor → Volunteer Form Labels → Availability options | Edit bilingual |
| **Submit button** ("Submit volunteer interest") | `volunteerFormLabels.submitLabel` | ✅ GetInvolvedEditor → Volunteer Form Labels → Submit Label | Edit bilingual |

### Partner Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.partnerLabel` / `partnerHeading` / `partnerSubtitle` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `pageContent.partnerFormLabel` / `partnerFormHeading` | SiteContent | ✅ GetInvolvedEditor → Labels tab | Edit bilingual |
| `partnerSection.body` (figcaption) | SiteContent `getInvolved.partner.description` | ✅ GetInvolvedEditor → Partner tab → Description | Edit bilingual (textarea) |
| `partnerSection.image` | Cloudinary URL | ✅ GetInvolvedEditor → Partner tab → Photo upload | Upload image |
| **Form labels** (Organization name, Contact person, Email, Phone, Type of partnership, Message) | `getInvolved.partnerFormLabels.*` | ✅ GetInvolvedEditor → Partner Form Labels (13 bilingual fields) | Edit any label/placeholder/option/error, Save |
| **Partnership type options** (CSR, Hospital/Medical, Institution/School, Other) | `partnerFormLabels.partnershipType*` | ✅ GetInvolvedEditor → Partner Form Labels → Partnership options | Edit bilingual |
| **Submit button** ("Submit partner inquiry") | `partnerFormLabels.submitLabel` | ✅ GetInvolvedEditor → Partner Form Labels → Submit Label | Edit bilingual |

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
| `phoneLabel` ("Phone") | `contact.phoneLabel` | ✅ ContactEditor → Contact Form Labels | Edit bilingual |
| `siteMeta.phone` | Settings `phone` | ✅ Settings → `phone` | Type, Save |
| `emailLabel` ("Email") | `contact.emailLabel` | ✅ ContactEditor → Contact Form Labels | Edit bilingual |
| `siteMeta.email` | Settings `email` | ✅ Settings → `email` | Type, Save |
| `addressLabel` ("Address") | `contact.addressLabel` | ✅ ContactEditor → Contact Form Labels | Edit bilingual |
| `siteMeta.address` | Settings `address` (bilingual) | ✅ Settings → `address` | Edit EN/BN |

### Map & Form

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `mapTitle` (iframe title) | `contact.mapTitle` | ✅ ContactEditor → Map Title | Edit bilingual |
| `contact.mapEmbedUrl` | SiteContent `contact.map.embedUrl` | ✅ ContactEditor → Map Embed URL | Paste Google Maps embed URL |
| Fallback map URL in component | Hardcoded literal in Contact.jsx | ❌ Fallback literal | Only shows if DB & static fallback both empty (trivial) |
| `contact.formLabel` / `formHeading` | SiteContent (from `settings.contact_form_label/heading`) | ✅ Settings → `contact_form_label` / `contact_form_heading` | Edit bilingual |
| **Form labels + placeholders** (Name, Email, Subject, Message) | `contact.formLabels.*` | ✅ ContactEditor → Contact Form Labels (9 bilingual fields) | Edit any label/placeholder/submit/error, Save |
| **Submit button** ("Send message") | `contact.formLabels.submitLabel` | ✅ ContactEditor → Contact Form Labels → Submit Label | Edit bilingual |

### Facebook Section

| Element | Source | Admin Editor? | How to Edit |
|---------|--------|---------------|-------------|
| `pageContent.facebookLabel` / `facebookHeading` | SiteContent | ✅ ContactEditor → Page Content → Facebook Label/Heading | Edit bilingual |
| `visitFacebookLabel` ("Visit Official Facebook Page →") | `contact.visitFacebookLabel` | ✅ ContactEditor → Facebook Button Label | Edit bilingual |
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

## Summary — Previously Hardcoded Items (Now Admin-Controllable)

The following items were hardcoded at audit creation and have since been wired into the admin panel:

| # | Location | What Was Hardcoded | Status | Admin Location |
|---|----------|-------------------|--------|----------------|
| 1 | Layout.jsx | "Donate Now" button text | ✅ Wired | Settings → Donate Button Label |
| 2 | Layout.jsx | Hamburger `aria-label` | ✅ Wired | Settings → Accessibility → Hamburger Label |
| 3 | Layout.jsx | Nav `aria-label` | ✅ Wired | Settings → Accessibility → Nav Label |
| 4 | Layout.jsx | "Follow us on Facebook" | ✅ Wired | Settings → Facebook Label |
| 5 | Settings | **Navigation Labels** (7 items) | ✅ New section | Settings → Navigation Labels |
| 6 | Home.jsx | "Support a Program" CTA | ✅ Wired | HomeEditor → Hero → CTA Primary |
| 7 | Home.jsx | "Explore Our Work" CTA | ✅ Wired | HomeEditor → Hero → CTA Secondary |
| 8 | Home.jsx | "Registration proof..." cert caption | ✅ Wired | HomeEditor → Hero → Cert Caption |
| 9 | OurWork.jsx | "Focus areas" label | ✅ Wired | OurWorkEditor → Page Content → Focus Label |
| 10 | Gallery.jsx | Filter chip labels (All/Education/Healthcare/Welfare) | ✅ Wired | GalleryManager → Page Content → Filter Chip Labels |
| 11 | Gallery.jsx | "Gallery categories" aria-label | ✅ Wired | GalleryManager → Page Content → Filter Aria Label |
| 12 | GetInvolved.jsx | "Bank details" section label | ✅ Wired | GetInvolvedEditor → Labels → Bank Label |
| 13 | GetInvolved.jsx | "Specimen cheque" / "View specimen cheque" | ✅ Wired | GetInvolvedEditor → Labels → Cheque labels |
| 14 | GetInvolved.jsx | "Pay via UPI app" link text | ✅ Wired | GetInvolvedEditor → Payment → UPI Labels |
| 15 | GetInvolved.jsx | 3 UPI hint paragraphs | ✅ Wired | GetInvolvedEditor → Payment → UPI Hint fields |
| 16 | GetInvolved.jsx | Volunteer form labels (7+ strings) | ✅ Wired | GetInvolvedEditor → Volunteer Form Labels |
| 17 | GetInvolved.jsx | Availability options dropdown | ✅ Wired | GetInvolvedEditor → Volunteer Form Labels |
| 18 | GetInvolved.jsx | Partner form labels (8+ strings) | ✅ Wired | GetInvolvedEditor → Partner Form Labels |
| 19 | GetInvolved.jsx | Partnership type options | ✅ Wired | GetInvolvedEditor → Partner Form Labels |
| 20 | Contact.jsx | "Phone", "Email", "Address" meta labels | ✅ Wired | ContactEditor → Contact Form Labels |
| 21 | Contact.jsx | Form labels + placeholders + submit (6+ strings) | ✅ Wired | ContactEditor → Contact Form Labels |
| 22 | Contact.jsx | "Visit Official Facebook Page →" | ✅ Wired | ContactEditor → Facebook Button Label |
| 23 | Contact.jsx | Map iframe title attribute | ✅ Wired | ContactEditor → Map Title |

## Remaining Hardcoded Items (Intentionally Left)

These items remain hardcoded by design — they are either unavoidably constant or trivial:

| Location | What's Hardcoded | Why Left |
|----------|-----------------|----------|
| Layout.jsx:110 | Logo `alt=""` | Empty alt is correct for decorative brand logo |
| Layout.jsx:154-156 | Language toggle (`EN`/`বাংলা`) | Shows opposite language abbreviation — always correct by definition |

---

## Summary — Admin-Editable Content Areas

| Admin Editor | Controls Content On | What You Can Edit |
|-------------|-------------------|-------------------|
| **Settings** | All pages (header, footer, nav) | org name, subtitle, badge, est year, footer mission, phone, email, address, Facebook URL, logo, contact page labels, **navigation labels (7 items)**, **donate button**, **Facebook label**, **hamburger/nav aria-labels** |
| **HomeEditor** | Home page | Hero (headline, intro, image, badges, footnote, figcaption, cert, **CTA labels**, **cert caption**), impact stats (CRUD), mission heading, page labels, showcase images (6 slots), CTA |
| **AboutEditor** | About page | Intro, story, mission/vision, values (4 slots), registration body + image, page labels |
| **OurWorkEditor** | Our Work page | Hero, **focus label**, focus tags, approach steps/heading, page labels, join box, showcase tiles (6 slots) |
| **ImpactEditor** | Impact page | Intro, hero promise, page labels, impact stats (CRUD), fund allocation (CRUD), feedback quote, report body |
| **GalleryManager** | Gallery page | Page labels (incl. **filter aria-label**, **4 filter chip labels**), gallery items (CRUD with image upload + alt text + category) |
| **ProgramsEditor** | Home (pillars), Our Work (featured) | Full CRUD: image, bilingual title/desc/category/highlight, reorder |
| **TeamEditor** | About (team) | Full CRUD: photo upload, bilingual name + role, reorder |
| **PartnersEditor** | About (partners) | CRUD: simple name list |
| **DocumentsEditor** | About (documents) | Full CRUD: bilingual title/desc/date, PDF upload, thumbnail, reorder |
| **ActivityPostsEditor** | Home (posts), Contact (posts) | Full CRUD: date, image upload, bilingual title/body, publish toggle |
| **GetInvolvedEditor** | Get Involved page | Page labels (incl. **bank label**, **cheque labels**), donation tiers (CRUD), bank details (4 fields + cheque image), UPI QR + intent URL + **3 UPI hint fields + button label**, volunteer roles (CRUD), partner section, **volunteer form labels (12 bilingual fields + 3 availability options)**, **partner form labels (13 bilingual fields + 4 partnership type options)** |
| **ContactEditor** | Contact page | Page labels, **meta labels (Phone/Email/Address)**, **form labels (9 fields)**, **Facebook button label**, **map title**, map embed URL, mosaic images (4 slots with bilingual captions) |
| **ThankYouEditor** | Thank You page | Page content (eyebrow, heading, body, button) |
| **NotFoundEditor** | 404 page | Page content (eyebrow, heading, body, button) |

---

*Last updated: May 2026 — All originally identified hardcoded items wired except language toggle (intentionally trivial).*
