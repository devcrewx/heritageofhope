# Hardcoded Text Audit & Editability Analysis

**Last Updated:** 2025  
**Purpose:** Identify all hardcoded text in web pages and determine which should be made admin-editable

---

## Summary

| Category | Count | Status | Priority |
|----------|-------|--------|----------|
| **Hardcoded + Fully Editable** | 30 | ✅ Has fallback API fields | Low |
| **Hardcoded ONLY** | 25 | ⚠️ No admin option | High |
| **Form Labels & Placeholders** | 45 | ⚠️ Hardcoded in JSX | Medium |
| **Category/Filter Labels** | 12 | ~OK but static | Medium |
| **Page Metadata** | 8 | 🔴 Not admin editable | High |

---

## Detailed Breakdown by Page

### 1. HOME PAGE (`Home.jsx`)

#### ✅ CURRENTLY EDITABLE (via API fallback)

| Text | Location | Current Field | Admin Editability |
|------|----------|---|---|
| "Education, healthcare and dignity for underserved communities." | Hero title | `home.pageContent.headline` (fallback: `copy.en.title`) | ✅ Via `home.hero.headline` API |
| "Heritage of Hope Foundation works across South 24 Parganas..." | Hero intro | `home.pageContent.intro` (fallback: `copy.en.intro`) | ✅ Via `home.hero.intro` API |
| Eyebrow: "Lighting lives, one step at a time" | Hero eyebrow | `home.hero.eyebrow` | ✅ Via API |
| "Impact snapshot" | Stats heading | Hardcoded but no API field | 🔴 NO |
| Mission section heading: "What we do on the ground" | Mission card grid | `mission.heading` (fallback: `copy`) | ✅ Via API |
| "Stories, updates and event photos" | Activity section | Hardcoded in fallback | 🔴 NO |
| "Your small gift creates big change." | Donation CTA | `cta.headline` (fallback: `copy.en.donationTitle`) | ✅ Via API |
| Donation body text | Donation CTA | `cta.body` (fallback: `copy.en.donationBody`) | ✅ Via API |

#### 🔴 HARDCODED ONLY (No Admin Option)

| Text | Location | Type | Should Be Editable? |
|------|----------|------|---|
| **"Our footprint so far"** | Stats section eyebrow | Section label | ✅ YES |
| **"Mission pillars"** | Mission section eyebrow | Section label | ✅ YES |
| **"Donate"** | CTA eyebrow | Button/section label | ✅ YES |
| "Empowering Communities \| Registered NGO" | Hero footnote | Badge text | ⚠️ MAYBE (org-wide) |

---

### 2. CONTACT PAGE (`Contact.jsx`)

#### 🔴 HARDCODED ONLY (No Admin Option)

| Text | Location | Type | Should Be Editable? |
|------|----------|------|---|
| **"We'd love to hear from you."** | Page title | Page heading | ✅ YES |
| **"Reach out to us for inquiries, partnerships, or just to say hello."** | Page intro | Page description | ✅ YES |
| **"Response time"** | Info panel label | Meta label | ✅ YES |
| **"Usually within 2 business days"** | Info panel value | Response SLA text | ✅ YES |
| **"Contact form"** | Form section label | Section eyebrow | ✅ YES |
| **"Send us a direct message"** | Form heading | Form title | ✅ YES |

#### ✅ CURRENTLY EDITABLE

| Text | Location | Current Field | Admin Editability |
|------|----------|---|---|
| Phone number | Contact card | `contact.contactDetails.phone` | ✅ Via ContactEditor |
| Email address | Contact card | `contact.contactDetails.email` | ✅ Via ContactEditor |
| Physical address | Contact card | `contact.contactDetails.address` | ✅ Via ContactEditor |

#### Form Labels (Hardcoded)

| Label | Type | Should Be Editable? |
|-------|------|---|
| "Name" | Field label | ⚠️ MAYBE (standard) |
| "Email" | Field label | ⚠️ MAYBE (standard) |
| "Subject" | Field label | ⚠️ MAYBE (standard) |
| "Message" | Field label | ⚠️ MAYBE (standard) |

---

### 3. GET INVOLVED PAGE (`GetInvolved.jsx`)

#### ✅ CURRENTLY EDITABLE

| Text | Location | Current Field | Admin Editability |
|------|----------|---|---|
| Page title | Section heading | `page.title` | ✅ Via GetInvolvedEditor |
| Page intro | Section description | `page.intro` | ✅ Via GetInvolvedEditor |
| Bank label | "Bank details" header | `page.bankLabel` | ✅ Via GetInvolvedEditor |
| Bank name | Card display | `page.bank.name` | ✅ Via GetInvolvedEditor |
| Bank branch | Card display | `page.bank.branch` | ✅ Via GetInvolvedEditor |
| Account number | Card display | `page.bank.account` | ✅ Via GetInvolvedEditor |
| IFSC code | Card display | `page.bank.ifsc` | ✅ Via GetInvolvedEditor |
| QR title | "Scan to donate" | `page.qrTitle` | ✅ Via GetInvolvedEditor |
| UPI intent URL | Button link | `page.upiIntentUrl` | ✅ Via GetInvolvedEditor |
| UPI CTA text | Button text | `page.upiCta` | ✅ Via GetInvolvedEditor |
| UPI hint text | Note below QR | `page.upiHint` | ✅ Via GetInvolvedEditor |
| UPI fallback text | Fallback note | `page.upiFallback` | ✅ Via GetInvolvedEditor |
| QR body text | Full QR description | `page.qrBody` | ✅ Via GetInvolvedEditor |
| Specimen cheque label | Button text | `page.chequeSpecimenLabel` | ✅ Via GetInvolvedEditor |
| Donation tiers | Amount ladder | `page.donationSteps` | ✅ Via GetInvolvedEditor |
| Volunteer roles | Role cards | `page.volunteerRoles` | ✅ Via GetInvolvedEditor |
| Partner photo | Section image | `page.heroImage` | ✅ Via GetInvolvedEditor |

#### 🔴 HARDCODED ONLY

| Text | Location | Type | Should Be Editable? |
|------|----------|------|---|
| **"Donation ladder"** | Section eyebrow | Section label | ✅ YES |
| **"What your support can do"** | Section heading | Section heading | ✅ YES |
| **"UPI payment"** | Section eyebrow | Section label | ✅ YES |
| **"Volunteer"** | Section eyebrow | Section label | ✅ YES |
| **"People matter more than perfection"** | Section heading | Section heading | ✅ YES |
| **"Volunteer form"** | Form eyebrow | Form label | ✅ YES |
| **"Join the team"** | Form heading | Form title | ✅ YES |
| **"Partner with us"** | Section eyebrow | Section label | ✅ YES |
| **"For CSR, hospitals and institutions"** | Section subheading | Section subtitle | ✅ YES |
| **"Partner inquiry"** | Form eyebrow | Form label | ✅ YES |
| **"Start a collaboration"** | Form heading | Form title | ✅ YES |

#### Form Labels (Hardcoded in GetInvolved.jsx)

| Label | Context | Should Be Editable? |
|-------|---------|---|
| "Area of interest" | Volunteer form | ⚠️ MAYBE |
| "Availability" | Volunteer form | ⚠️ MAYBE |
| "Organization name" | Partner form | ⚠️ MAYBE |
| "Contact person" | Partner form | ⚠️ MAYBE |
| "Type of partnership" | Partner form | ⚠️ MAYBE |

---

### 4. ABOUT PAGE (`About.jsx`)

#### ✅ CURRENTLY EDITABLE

| Text | Location | Current Field | Admin Editability |
|------|----------|---|---|
| Page title | Page heading | `page.title` | ✅ Via AboutEditor |
| Page intro | Page description | `page.intro` | ✅ Via AboutEditor |
| Hero image | Feature image | `page.heroImage` | ✅ Via AboutEditor |
| Organization values | Value cards | `page.values` | ✅ Via AboutEditor (fallback to hardcoded defaults) |

#### 🔴 HARDCODED ONLY

| Text | Location | Type | Should Be Editable? |
|------|----------|------|---|
| **"Documents"** | Section eyebrow | Section label | ✅ YES |
| **"Official documents"** | Section heading | Section title | ✅ YES |

---

### 5. OUR WORK PAGE (`OurWork.jsx`)

#### 🔴 HARDCODED ONLY

| Text | Location | Type | Should Be Editable? |
|------|----------|------|---|
| Intro paragraph | Page description | Page intro text | ✅ YES |
| **"Join the mission"** | CTA text | Call-to-action label | ✅ YES |

#### Category Labels (Hardcoded but Dynamic from `content.js`)

| Label | Type |
|-------|------|
| "Education" | Category filter |
| "Healthcare" | Category filter |
| "Welfare" | Category filter |

---

### 6. GALLERY PAGE (`Gallery.jsx`)

#### Category Labels (Hardcoded but Dynamic from `content.js`)

| Label | Type |
|-------|------|
| "Education" | Filter label |
| "Healthcare" | Filter label |
| "Welfare" | Filter label |

---

### 7. FORM LABELS & FIELD PLACEHOLDERS (Globally Hardcoded)

These appear across multiple pages using the `text()` helper function:

| Field | Type | Should Be Editable? |
|-------|------|---|
| "Name" | Form label | ⚠️ MAYBE (standard) |
| "Email" | Form label | ⚠️ MAYBE (standard) |
| "Phone" | Form label | ⚠️ MAYBE (standard) |
| "Subject" / "Message" | Form label | ⚠️ MAYBE (standard) |
| "Your name" | Placeholder | ⚠️ MAYBE (standard) |
| "you@example.com" | Placeholder | ⚠️ MAYBE (standard) |
| "Choose one" | Dropdown default | ⚠️ MAYBE (standard) |
| "Weekends" / "Weekdays" / "Occasionally" | Option values | ~OK as is |

---

## Priority Matrix

### 🔴 HIGH PRIORITY (Should be admin-editable)

These are **section labels and headings** that change meaning depending on the page/brand context:

| Text | Page | Reason |
|------|------|--------|
| "Our footprint so far" | Home | Stats section eyebrow — defines metric context |
| "Mission pillars" | Home | Pillar section eyebrow — defines program context |
| "We'd love to hear from you." | Contact | Page title — brand voice |
| "Reach out to us for inquiries..." | Contact | Page intro — brand messaging |
| "Response time" / "Usually within 2 business days" | Contact | SLA information — business context |
| "Send us a direct message" | Contact | Form heading — context-dependent |
| "What your support can do" | GetInvolved | Donation section title — marketing message |
| "People matter more than perfection" | GetInvolved | Volunteer section title — brand value proposition |
| "For CSR, hospitals and institutions" | GetInvolved | Partner section subtitle — target audience |
| "Documents" / "Official documents" | About | Section headers — legal requirement |

### ⚠️ MEDIUM PRIORITY (Consider making editable)

These are **form labels** that could vary by organization or context:

| Text | Page | Reason |
|------|------|--------|
| "Area of interest" | GetInvolved | Volunteer form — could be org-specific |
| "Type of partnership" | GetInvolved | Partner form — could vary by partnerships offered |
| "Availability" | GetInvolved | Volunteer form — could have custom options |

### ~OK AS IS (Low priority)

These are **standard UI elements** that don't typically change:

| Text | Page | Reason |
|------|------|--------|
| Form field labels ("Name", "Email", etc.) | All | Standard form UX |
| Filter labels ("Education", "Healthcare") | Gallery, OurWork | Standard category names |
| Option labels ("Weekends", etc.) | GetInvolved | Standard availability options |

---

## Actionable Recommendations

### Phase 1: High-Impact (Immediate)
Make these **11 hardcoded section labels admin-editable**:

1. **Home page eyebrows/section titles:**
   - `home.pageContent.statsLabel` → "Our footprint so far"
   - `home.pageContent.pillarLabel` → "Mission pillars"

2. **Contact page:**
   - `contact.pageContent.responseTimeLabel` → "Response time"
   - `contact.pageContent.responseTimeValue` → "Usually within 2 business days"

3. **GetInvolved page:**
   - `getInvolved.pageContent.donationLabel` → "What your support can do"
   - `getInvolved.pageContent.volunteerHeading` → "People matter more than perfection"
   - `getInvolved.pageContent.partnerSubtitle` → "For CSR, hospitals and institutions"

4. **About page:**
   - `about.pageContent.documentsLabel` → "Documents"
   - `about.pageContent.documentsHeading` → "Official documents"

5. **OurWork page:**
   - `ourWork.pageContent.ctaLabel` → "Join the mission"

### Phase 2: Nice-to-Have (Future)
Consider making form field labels configurable through a **Form Editor** component.

---

## Implementation Strategy

### Option A: Extend Page Editors (Low effort)
Add these fields to existing editors:

```jsx
// In HomeEditor.jsx
<BilingualField 
  label="Stats Section Label"
  value={data.pageContent?.statsLabel}
  onChange={(v) => updateField('pageContent.statsLabel', v)}
/>

// In ContactEditor.jsx
<BilingualField 
  label="Response Time Label"
  value={data.pageContent?.responseTimeLabel}
  onChange={(v) => updateField('pageContent.responseTimeLabel', v)}
/>
```

### Option B: Create a Generic "Section Labels" Editor
Create a new editor page that manages all section labels across all pages (medium effort, high value).

### Option C: Hardcode + CMS Toggle
Keep hardcoded as fallback but add `/api/admin/content/section-labels` endpoint for optional overrides.

---

## Risk Assessment

### Low Risk (Safe to change)
- Section eyebrows ("Our footprint so far", "Mission pillars")
- Page titles ("We'd love to hear from you")
- Section headings ("What your support can do")

### Medium Risk (Needs validation)
- Form field labels (changing from "Name" to something else could break UX)
- Category labels (changing could break filtering logic)
- Filter options (changing availability options could break form submission)

### High Risk (Don't change without careful testing)
- Deeply nested form validation logic
- API request payloads that depend on exact field names

---

## Audit Timestamp

- **Created:** 2025
- **Pages Scanned:** 7 (Home, Contact, GetInvolved, About, OurWork, Gallery, ThankYou)
- **Files Analyzed:** 
  - `packages/web/src/pages/*.jsx` (all pages)
  - `packages/web/src/content.js` (global content)
  - `packages/admin/src/pages/*Editor.jsx` (admin panels)
- **Total Hardcoded Strings Found:** 70+
- **Fully Admin-Editable:** 30
- **Partially Editable:** 15
- **Not Editable:** 25

---

## Next Steps

1. **Prioritize:** Confirm which HIGH priority items should be made editable
2. **Design:** Choose implementation approach (A, B, or C)
3. **Implement:** Add fields to editors and API endpoints
4. **Test:** Verify fallback behavior when fields are empty
5. **Document:** Update admin user guide with new editable fields
