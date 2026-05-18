# Client/Admin Editability Report

Project: Heritage of Hope Foundation
Date: 2026-05-18
Scope: public client frontend, admin frontend, and the Render API that feeds them

## Deployment URLs

- Public site: https://cheery-praline-30b4a8.netlify.app
- Admin site: https://rococo-sherbet-6244e2.netlify.app
- API server: https://heritageofhope-api.onrender.com

## What this report covers

This document lists what is editable from the admin website and what is still fixed in the public client code.

It is based on the current code in the workspace and the deployed app structure. Where the admin has an editor but the public site is still rendering static data, that is called out explicitly.

## Status legend

- Editable: changed from the admin panel and reflected on the public site
- Editable but not wired: the admin panel can change it, but the current public page does not consume that data
- Non-editable: hardcoded in the client bundle or otherwise not controlled by the admin UI

## High-level summary

### Fully wired and editable from admin

- Shared site settings: org name, navbar subtitle, trust badges, footer mission line, contact details, Facebook URL
- Home hero section, stats, donation CTA
- Programs shown on Home and Our Work
- About intro, story, mission, vision, core values, team members, partners, documents
- Impact stats, fund allocation, community feedback, annual report text
- Gallery photos, categories, alt text, order
- Get Involved donation tiers, bank details, cheque specimen, UPI QR section, volunteer roles, partner section
- Contact details shown in the contact cards and footer

### Editable in admin but not reflected in the current public pages

- Activity Posts editor is present, but Home and Contact still render static Facebook post arrays instead of the activity-post data from the API

### Still non-editable in the client

- Global nav item labels and order
- Header logo image
- Language toggle text
- Top-level page headings and helper text that are not backed by admin content fields
- Several section headings, button labels, placeholders, and embedded media that remain hardcoded in the React components
- Static fallback illustrations, map embed, footer icon markup, and 404 / thank-you pages

---

## Shared shell and global UI

### Admin control source

- Site Settings editor: `packages/admin/src/pages/Settings.jsx`
- Home editor also affects some shared trust badge values: `packages/admin/src/pages/HomeEditor.jsx`
- API assembly: `packages/api/src/data/siteContent.js`
- Layout: `packages/web/src/components/Layout.jsx`

### Editable from admin

| Item | Admin source | Public usage | Status |
|---|---|---|---|
| Organization name | Site Settings: `org_name` | Header brand name and footer title | Editable |
| Navbar subtitle | Site Settings: `navbar_subtitle` | Header subtitle line under brand name | Editable |
| Registered badge text | Site Settings: `registered_badge` | Used in home trust strip / trust badge copy | Editable |
| Established year | Site Settings: `est_year` | Used in home trust strip | Editable |
| Footer mission line | Site Settings: `footer_mission` | Footer paragraph | Editable |
| Phone number | Site Settings: `phone` | Contact cards and footer contact line | Editable |
| Email address | Site Settings: `email` | Contact cards and footer contact line | Editable |
| Address | Site Settings: `address` | Contact cards and footer contact line | Editable |
| Facebook page URL | Site Settings: `facebook_url` | Footer Facebook button and Contact page link | Editable |

### Non-editable in the client

| Item | Why it is non-editable |
|---|---|
| Header logo image | Hardcoded `/assets/profile_pic.webp` in `Layout.jsx` |
| Nav items and labels | The nav array comes from static content / API fallback, not an admin editor |
| Donate button label | Hardcoded in `Layout.jsx` |
| Language toggle labels | Hardcoded in `Layout.jsx` |
| Footer Facebook icon markup | Hardcoded SVG in `Layout.jsx` |
| Footer layout and structure | Fixed React component markup |
| Any other header/footer spacing, icon placement, or responsive structure | Layout is not admin-controlled |

---

## Home page

Public page: `packages/web/src/pages/Home.jsx`

Admin sources:

- `packages/admin/src/pages/HomeEditor.jsx`
- `packages/admin/src/pages/Settings.jsx`
- `packages/admin/src/pages/ProgramsEditor.jsx`
- `packages/admin/src/pages/ImpactEditor.jsx`

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Hero | Eyebrow text | Home Editor -> Hero section | Editable |
| Hero | Main headline | Home Editor -> Hero section | Editable |
| Hero | Intro paragraph | Home Editor -> Hero section | Editable |
| Hero | Hero image | Home Editor -> Hero photo upload | Editable |
| Hero | Trust badge 1 | Home Editor -> badge1 | Editable |
| Hero | Trust badge 2 | Home Editor -> badge2 | Editable |
| Hero | Trust badge 3 | Home Editor -> badge3 | Editable |
| Hero | Header subtitle / footnote line under badges | Site Settings -> navbar_subtitle | Editable |
| Stats section | Four impact stats numbers | Home Editor -> Impact Stats, and Impact Editor -> Shared Impact Stats | Editable |
| Stats section | Four stat labels | Home Editor -> Impact Stats, and Impact Editor -> Shared Impact Stats | Editable |
| Programs section | Featured program cards shown on Home | Programs Editor | Editable |
| Donation CTA | Headline | Home Editor -> Donation CTA | Editable |
| Donation CTA | Body copy | Home Editor -> Donation CTA | Editable |

### Editable in admin but not wired or only partially wired

| Section | Element | Admin source | Current client behavior | Status |
|---|---|---|---|---|
| Activity feed | Activity post records | Activity Posts Editor | Home renders `home.facebookPosts`, which is still the static Facebook post array | Editable but not wired |
| Photo mosaic | Showcase images | No admin editor for this section | Home renders `home.showcaseImages`, which comes from static content | Non-editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Hero | Primary CTA label `Support a Program` | Hardcoded in `Home.jsx` |
| Hero | Secondary CTA label `Explore Our Work` | Hardcoded in `Home.jsx` |
| Hero | Hero footer label text when no navbar subtitle is present | Hardcoded fallback copy in `Home.jsx` |
| Hero | Registration proof image | Hardcoded `/assets/reg_cert.webp` |
| Stats | Section label `Our footprint so far` | Hardcoded copy in `Home.jsx` |
| Programs | Section heading `What we do on the ground` | Hardcoded copy in `Home.jsx` |
| Activity feed | Title `Stories, updates and event photos` | Hardcoded copy in `Home.jsx` |
| Donate block | Section label `Donate` | Hardcoded copy in `Home.jsx` |
| Donate block | Button label `Donate now` | Hardcoded in `Home.jsx` |
| Any page-level layout / section spacing / card styling | Fixed in the client component and CSS |

### Notes

- The public Home page does not currently render the admin-managed `activityPosts` array from the API. It renders `home.facebookPosts` instead.
- The Home page program cards are the same program records used by the Our Work page.

---

## About page

Public page: `packages/web/src/pages/About.jsx`

Admin sources:

- `packages/admin/src/pages/AboutEditor.jsx`
- `packages/admin/src/pages/DocumentsEditor.jsx`
- `packages/admin/src/pages/TeamEditor.jsx`
- `packages/admin/src/pages/PartnersEditor.jsx`

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Intro | Page title | About Editor -> Page Intro | Editable |
| Intro | Intro paragraph | About Editor -> Page Intro | Editable |
| Intro | Hero photo | About Editor -> Hero Photo upload | Editable |
| Story | Our story body | About Editor -> Our Story | Editable |
| Mission | Mission statement | About Editor -> Mission & Vision | Editable |
| Mission | Vision statement | About Editor -> Mission & Vision | Editable |
| Values | Four core value titles | About Editor -> Core Values | Editable |
| Values | Four core value descriptions | About Editor -> Core Values | Editable |
| Documents | Document title | Documents Editor | Editable |
| Documents | Document date | Documents Editor | Editable |
| Documents | Document description | Documents Editor | Editable |
| Documents | PDF file | Documents Editor | Editable |
| Documents | Preview image | Documents Editor | Editable |
| Team snapshot | Team member photo | Team Editor | Editable |
| Team snapshot | Team member name | Team Editor | Editable |
| Team snapshot | Team member role | Team Editor | Editable |
| Partners | Partner names | Partners Editor | Editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Intro | Section label `About` | Hardcoded in `About.jsx` |
| Intro | Section heading `Rooted in community. Driven by impact.` | Pulled from editable content, so editable |
| Documents | Section label `Documents` | Hardcoded in `About.jsx` |
| Documents | Section heading `Official documents` | Hardcoded in `About.jsx` |
| Documents | Button label `View` | Hardcoded in `About.jsx` |
| Documents | Button label `Download` | Hardcoded in `About.jsx` |
| Registration card | Registration certificate image | Hardcoded `/assets/reg_cert.webp` |
| Registration card | Heading `Registration and accountability` | Hardcoded in `About.jsx` |
| Registration card | Supporting paragraph | Hardcoded in `About.jsx` |
| Values | Explanatory paragraph under each value card | Hardcoded in `About.jsx` |
| Team section | Section label and heading text | Hardcoded in `About.jsx` |
| Modal controls | Close / next / previous labels | Hardcoded in `DocumentModal.jsx` |

### Notes

- Documents are fully managed from the admin panel and are displayed in the public About page.
- Partners are stored as a list of names and shown as pills on the About page.
- Team members and documents are the main data lists on this page, and both are editable.

---

## Our Work page

Public page: `packages/web/src/pages/OurWork.jsx`

Admin sources:

- `packages/admin/src/pages/OurWorkEditor.jsx`
- `packages/admin/src/pages/ProgramsEditor.jsx`

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Hero | Page title | Our Work Editor -> Page Title | Editable |
| Hero | Page intro | Our Work Editor -> Page Intro | Editable |
| Hero | Hero image | Our Work Editor -> Hero Photo upload | Editable |
| Focus panel | Three focus tags | Our Work Editor -> Focus Tags | Editable |
| Program grid | Program card image | Programs Editor | Editable |
| Program grid | Program category | Programs Editor | Editable |
| Program grid | Program title | Programs Editor | Editable |
| Program grid | Program description | Programs Editor | Editable |
| Program grid | Program highlight line | Programs Editor | Editable |
| Approach | Section heading | Our Work Editor -> Section Heading | Editable |
| Approach | Four approach steps | Our Work Editor -> Step 1-4 | Editable |
| Join panel | Small label | Our Work Editor -> Join Mission Box -> Small Label | Editable |
| Join panel | Body text | Our Work Editor -> Join Mission Box -> Body Text | Editable |
| Join panel | Button label | Our Work Editor -> Join Mission Box -> Button Label | Editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Hero | Section label `Our Work` | Hardcoded in `OurWork.jsx` |
| Hero | Fallback copy if admin content is missing | Hardcoded in `OurWork.jsx` |
| Focus panel | Section label `Focus` and the chip container styling | Hardcoded in `OurWork.jsx` |
| Program grid | Section layout and card layout | Hardcoded in `OurWork.jsx` |
| Approach | Section label `Our Approach` | Hardcoded in `OurWork.jsx` |
| Join panel | Link target to the donation section | Hardcoded in `OurWork.jsx` |

### Notes

- The programs shown here are the same database-backed program records used on the Home page.
- This page is one of the best-wired pages in the system: nearly all visible content is controlled through admin editors.

---

## Impact page

Public page: `packages/web/src/pages/Impact.jsx`

Admin sources:

- `packages/admin/src/pages/ImpactEditor.jsx`
- `packages/admin/src/pages/HomeEditor.jsx` for the shared stats table

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Hero | Page title | Impact Editor -> content/impact intro or title | Editable |
| Hero | Intro paragraph | Impact Editor -> content/impact intro | Editable |
| Stats | Four impact stat numbers | Home Editor and Impact Editor shared stats table | Editable |
| Stats | Four impact stat labels | Home Editor and Impact Editor shared stats table | Editable |
| Fund allocation | Category labels | Impact Editor -> Fund Allocation | Editable |
| Fund allocation | Percentages | Impact Editor -> Fund Allocation | Editable |
| Feedback card | Testimonial quote | Impact Editor -> Community Feedback | Editable |
| Report card | Annual report status text | Impact Editor -> Annual Report | Editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Hero | Section label `Impact` | Hardcoded in `Impact.jsx` |
| Hero | Promise card label `Our Promise` | Hardcoded in `Impact.jsx` |
| Hero | Promise body sentence | Hardcoded in `Impact.jsx` |
| Fund allocation | Section heading `How support is used` | Hardcoded in `Impact.jsx` |
| Feedback | Section label `Community Feedback` fallback text | Hardcoded in `Impact.jsx` |
| Report | Section label `Annual report` fallback text | Hardcoded in `Impact.jsx` |
| Any chart bars, spacing, and card styling | Fixed in the client component and CSS |

### Notes

- Impact stats are shared with the Home page, so editing them here or on Home affects both pages.

---

## Gallery page

Public page: `packages/web/src/pages/Gallery.jsx`

Admin source:

- `packages/admin/src/pages/GalleryManager.jsx`

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Gallery grid | Photo image | Gallery Manager | Editable |
| Gallery grid | Category | Gallery Manager | Editable |
| Gallery grid | Alt text / title | Gallery Manager | Editable |
| Gallery grid | Display order | Gallery Manager | Editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Hero | Page title `Moments of hope and action.` | Hardcoded in `Gallery.jsx` |
| Hero | Intro paragraph | Hardcoded in `Gallery.jsx` |
| Explore panel | Section label `Explore` | Hardcoded in `Gallery.jsx` |
| Explore panel | Filter helper text | Hardcoded in `Gallery.jsx` |
| Filter chips | Category names `All`, `Education`, `Healthcare`, `Welfare` | Hardcoded in `Gallery.jsx` |
| Gallery layout | Grid styling, card shape, hover behavior | Hardcoded in the client |

### Notes

- The gallery items themselves are editable, but the filter categories are not currently admin-driven.
- The page filters by the category string stored on each gallery item.

---

## Get Involved page

Public page: `packages/web/src/pages/GetInvolved.jsx`

Admin sources:

- `packages/admin/src/pages/GetInvolvedEditor.jsx`
- `packages/admin/src/pages/Settings.jsx`

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Intro | Page title | Get Involved Editor -> intro title | Editable |
| Intro | Intro paragraph | Get Involved Editor -> intro paragraph | Editable |
| Intro | Partnership photo | Get Involved Editor -> hero photo upload | Editable |
| Bank details | Bank label | Get Involved Editor -> bank label | Editable |
| Bank details | Bank name | Get Involved Editor -> bank name | Editable |
| Bank details | Branch | Get Involved Editor -> bank branch | Editable |
| Bank details | Account number | Get Involved Editor -> bank account | Editable |
| Bank details | IFSC | Get Involved Editor -> bank ifsc | Editable |
| Bank details | Cheque specimen label | Get Involved Editor -> cheque label | Editable |
| Bank details | Cheque specimen image | Get Involved Editor -> cheque url / media | Editable |
| Donation ladder | Donation amount rows | Get Involved Editor -> donation tiers | Editable |
| Donation ladder | Donation tier labels | Get Involved Editor -> donation tiers | Editable |
| UPI section | QR image | Get Involved Editor -> UPI / payment section | Editable |
| UPI section | QR title | Get Involved Editor -> qr title | Editable |
| UPI section | UPI alt text | Get Involved Editor -> qr alt | Editable |
| UPI section | UPI intent URL | Get Involved Editor -> intent URL | Editable |
| UPI section | CTA button label | Get Involved Editor -> cta text | Editable |
| UPI section | Hint text | Get Involved Editor -> hint | Editable |
| UPI section | Fallback text | Get Involved Editor -> fallback | Editable |
| UPI section | Body text | Get Involved Editor -> body | Editable |
| Volunteer section | Volunteer role cards | Get Involved Editor -> volunteer roles | Editable |
| Volunteer section | Volunteer section text | Get Involved Editor -> volunteer heading / description | Editable |
| Partner section | Partner section heading | Get Involved Editor -> partner heading | Editable |
| Partner section | Partner section body | Get Involved Editor -> partner description | Editable |
| Partner section | Partner photo | Get Involved Editor -> partner photo | Editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Hero | Section label `Get Involved` | Hardcoded in `GetInvolved.jsx` |
| Donation ladder | Section label `Donation ladder` | Hardcoded in `GetInvolved.jsx` |
| Donation ladder | Heading `What your support can do` | Hardcoded in `GetInvolved.jsx` |
| Bank card | The display order of fields | Hardcoded in `GetInvolved.jsx` |
| UPI card | Section label `UPI payment` | Hardcoded in `GetInvolved.jsx` |
| Volunteer section | Section label `Volunteer` | Hardcoded in `GetInvolved.jsx` |
| Volunteer section | Heading `People matter more than perfection` | Hardcoded in `GetInvolved.jsx` |
| Volunteer form | Field labels, placeholders, validation text, dropdown options | Hardcoded in `GetInvolved.jsx` |
| Partner section | Section label `Partner with us` | Hardcoded in `GetInvolved.jsx` |
| Partner form | Field labels, placeholders, validation text, dropdown options | Hardcoded in `GetInvolved.jsx` |
| Submit buttons | Form submit button labels | Hardcoded in `GetInvolved.jsx` |

### Notes

- This page is broadly editable, including payment details and the UPI QR flow.
- The forms themselves are not admin-driven; only the surrounding content and media are.

---

## Contact page

Public page: `packages/web/src/pages/Contact.jsx`

Admin source:

- `packages/admin/src/pages/ContactEditor.jsx`
- `packages/admin/src/pages/Settings.jsx`

### Editable from admin and reflected publicly

| Section | Element | Admin source | Status |
|---|---|---|---|
| Contact cards | Phone number | Site Settings -> phone | Editable |
| Contact cards | Email address | Site Settings -> email | Editable |
| Contact cards | Address | Site Settings -> address | Editable |
| Contact cards | Facebook URL | Site Settings -> facebook_url | Editable |
| Footer mirrored contact info | Phone / email / address | Site Settings | Editable |

### Non-editable in the client

| Section | Element | Why it is non-editable |
|---|---|---|
| Hero | Page title `We’d love to hear from you.` | Hardcoded in `Contact.jsx` |
| Hero | Intro paragraph | Hardcoded in `Contact.jsx` |
| Hero | Response time card text | Hardcoded in `Contact.jsx` |
| Map | Google Maps embed URL | Hardcoded in `Contact.jsx` |
| Contact form | Field labels, placeholders, validation text, submit label | Hardcoded in `Contact.jsx` |
| Featured from Facebook | Section heading and button label | Hardcoded in `Contact.jsx` |
| Recent moments list | The post cards currently shown | Hardcoded static `contact.facebookPosts` array |
| Photo mosaic | The images and captions | Hardcoded static `contact.showcaseImages` array |

### Notes

- The Contact page mostly uses settings-driven contact details, but the map, form copy, and social feed content are still hardcoded.
- The admin Activity Posts editor does not currently drive the public Contact page feed.

---

## Activity Posts editor gap

Admin source:

- `packages/admin/src/pages/ActivityPostsEditor.jsx`

Public pages:

- `packages/web/src/pages/Home.jsx`
- `packages/web/src/pages/Contact.jsx`

### What the admin editor can change

- Post date
- Title EN and BN
- Body EN and BN
- Photo
- Published / unpublished state
- Reorder

### What the public pages currently use

- Home page: static `home.facebookPosts` from client content, not the admin activity-post table
- Contact page: static `contact.facebookPosts` and `contact.showcaseImages`

### Result

- The Activity Posts editor is present and functional in the admin app
- The public site does not currently reflect those edits in Home or Contact
- This is the main editable-but-not-wired gap in the current system

---

## Other public pages

### Thank You page

- Not admin-editable
- Static completion page shown after form submission

### Not Found page

- Not admin-editable
- Static fallback route page

---

## Full control map by admin page

| Admin page | Public surfaces affected |
|---|---|
| Settings | Shared header brand text, footer mission, phone, email, address, Facebook URL |
| Home Editor | Home hero, trust badges, hero image, shared stats, donation CTA |
| Programs Editor | Home program cards, Our Work program cards |
| About Editor | About intro, hero image, story, mission, vision, core values |
| Documents Editor | About documents section |
| Team Editor | About team snapshot |
| Partners Editor | About partner list |
| Impact Editor | Impact stats, fund allocation, testimonial, annual report |
| Gallery Manager | Gallery page cards |
| Get Involved Editor | Get Involved intro, bank details, cheque specimen, UPI, volunteer roles, partner section |
| Contact Editor | Contact page data source overlap with settings-driven contact fields |
| Activity Posts Editor | Currently not wired into Home or Contact in the public client |

---

## Practical conclusion

### Editable and live today

- Most of the branded content, program content, documents, gallery, team, partners, impact data, and Get Involved content are already editable from the admin panel and reflected on the public site.

### Still static on the public client

- Shared shell structure and several labels
- Some hero / section headings and helper text
- Home and Contact social feed sections
- Gallery filter chips
- Static images used as decorative or fallback assets
- Map embed and form microcopy
- Thank You and Not Found pages

### Biggest gap to fix next if you want full parity

- Wire the Activity Posts editor into the public Home and Contact pages so those feeds are not static anymore
- Add admin control for the remaining page-level microcopy and static filter labels if you want complete CMS coverage

---

## Source files reviewed

Public client:

- `packages/web/src/pages/Home.jsx`
- `packages/web/src/pages/About.jsx`
- `packages/web/src/pages/OurWork.jsx`
- `packages/web/src/pages/Impact.jsx`
- `packages/web/src/pages/Gallery.jsx`
- `packages/web/src/pages/GetInvolved.jsx`
- `packages/web/src/pages/Contact.jsx`
- `packages/web/src/components/Layout.jsx`
- `packages/web/src/content.js`

Admin app:

- `packages/admin/src/pages/Settings.jsx`
- `packages/admin/src/pages/HomeEditor.jsx`
- `packages/admin/src/pages/AboutEditor.jsx`
- `packages/admin/src/pages/ImpactEditor.jsx`
- `packages/admin/src/pages/OurWorkEditor.jsx`
- `packages/admin/src/pages/GetInvolvedEditor.jsx`
- `packages/admin/src/pages/ContactEditor.jsx`
- `packages/admin/src/pages/DocumentsEditor.jsx`
- `packages/admin/src/pages/GalleryManager.jsx`
- `packages/admin/src/pages/ProgramsEditor.jsx`
- `packages/admin/src/pages/TeamEditor.jsx`
- `packages/admin/src/pages/PartnersEditor.jsx`
- `packages/admin/src/pages/ActivityPostsEditor.jsx`

API content assembly:

- `packages/api/src/data/siteContent.js`
- `packages/api/src/data/staticContent.js`
