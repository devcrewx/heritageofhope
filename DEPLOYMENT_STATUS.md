# Heritage of Hope Project Status

Checked against the codebase on 2026-05-16.

## Status Legend

- Done: implemented, wired, and build-checked.
- Partial: code exists, but some fields are not fully wired to the public site, need env config, or still need verification.
- Left: not yet implemented.

## Summary

### Done

- Backend foundation is in place: Express API, Prisma schema, seeded data, JWT auth, Cloudinary integration, public content routes, and admin CRUD routes.
- Admin shell is in place: login, protected layout, dashboard, submissions inbox, and change-password page.
- Rich list editors are in place: activity posts, team, partners, documents, gallery, programs, donation tiers, and volunteer roles.
- The core submissions inbox is working and was browser-verified with live data.
- Local builds pass for both admin and public web apps.

### Partial

- Several admin editors write to the database, but the public pages still keep hardcoded copy or images in key places.
- Media management is strong for gallery/team/partners/programs/documents/activity posts, but not for every hero or section image described in the plan.
- Form email notifications are implemented in code, but SMTP configuration is not present in the local API env file, so end-to-end verification is still pending.
- The public site uses the API for some content, but not all plan items are migrated away from hardcoded fallback content yet.

### Left

- Public-page wiring for the remaining text/content fields that are still hardcoded in the React pages.
- SMTP environment setup and verification of notification delivery.
- Final deployment configuration cleanup and end-to-end regression testing after deployment.

## Phase Status

| Phase | Status | Notes |
|---|---|---|
| Phase 1: Backend foundation | Done | API, Prisma, auth, content routes, media pipeline, seed data. |
| Phase 2: Auth + admin shell | Done | Login, guarded routes, sidebar shell, dashboard, password change flow. |
| Phase 3: Text content editors | Partial | Some sections are live; others still do not drive the public pages. |
| Phase 4: Media management | Partial | Gallery and most list-based media assets are done; page hero/section image controls are incomplete. |
| Phase 5: Rich list editors | Done | Activity posts, team, partners, documents, programs, donation tiers, volunteer roles. |
| Phase 6: Form inbox + notifications | Partial | Inbox works; notification email wiring still needs SMTP verification. |
| Phase 7: Polish + deploy | Left | Deployment/env cleanup, final validation, and handoff work remain. |

## What Is Completely Done

### Backend and Data Layer

- `packages/api/src/routes/admin/index.js` wires the admin routers.
- `packages/api/src/routes/admin/content.js` supports field-level content updates and explicit empty-string clearing.
- `packages/api/src/lib/cloudinary.js` and upload middleware support image/PDF upload handling.
- `packages/api/prisma/schema.prisma` contains the required content, media, submission, and admin models.
- `packages/api/scripts/seed.js` seeds the admin user and sample content.

### Admin Shell and Security

- `packages/admin/src/App.jsx` has protected routes and includes the current admin sections.
- `packages/admin/src/components/AdminLayout.jsx` provides the sidebar shell.
- `packages/admin/src/pages/Dashboard.jsx` loads live admin stats.
- `packages/admin/src/pages/ChangePassword.jsx` is implemented and routed.
- `packages/api/src/routes/admin/users.js` supports password changes.

### Rich List Editors

- `packages/admin/src/pages/ActivityPostsEditor.jsx`
- `packages/admin/src/pages/TeamEditor.jsx`
- `packages/admin/src/pages/PartnersEditor.jsx`
- `packages/admin/src/pages/DocumentsEditor.jsx`
- `packages/admin/src/pages/GalleryManager.jsx`
- `packages/admin/src/pages/ProgramsEditor.jsx`
- `packages/admin/src/pages/GetInvolvedEditor.jsx` volunteer roles and donation tiers

### Form Inbox

- `packages/admin/src/pages/SubmissionsInbox.jsx` is present and renders live inbox data.
- `packages/api/src/routes/admin/submissions.js` supports stats, list, and detail endpoints.
- `packages/api/src/routes/public/forms.js` creates contact, volunteer, and partner submissions.

## What Is Partially Done

### Text Editors

- `packages/admin/src/pages/Settings.jsx` is complete and writes the shared site identity/contact settings.
- `packages/admin/src/pages/OurWorkEditor.jsx` is largely complete and maps to the public Our Work page data.
- `packages/admin/src/pages/ContactEditor.jsx` is complete for contact settings.
- `packages/admin/src/pages/HomeEditor.jsx` saves hero/stats/mission/CTA fields, but the public Home page still keeps the hero text and donation copy hardcoded, and the mission photo grid is not editable from this editor.
- `packages/admin/src/pages/AboutEditor.jsx` saves intro/story/mission/values, but the public About page still keeps most of that copy hardcoded and does not use rich text.
- `packages/admin/src/pages/ImpactEditor.jsx` saves stats/allocation/feedback/report, but the public Impact page still renders the testimonial and annual report from hardcoded copy.
- `packages/admin/src/pages/GetInvolvedEditor.jsx` covers donation tiers, bank details, volunteer roles, and partner copy, but the public page still hardcodes bank and UPI QR content.

### Media

- Gallery, team, partners, documents, programs, and activity photos are wired.
- The remaining plan items for Home/About/Get Involved hero or section images are not yet modeled in the admin UI.

### Public Site Data Flow

- `packages/web/src/App.jsx` fetches `/api/content` and falls back to local content.
- `packages/web/src/pages/Home.jsx`, `About.jsx`, `Impact.jsx`, `GetInvolved.jsx`, `Contact.jsx`, and `Gallery.jsx` still mix API-backed content with hardcoded copy and assets.

### Notifications

- `packages/api/src/lib/mailer.js` is implemented.
- `packages/api/src/routes/public/forms.js` calls the mailer, but `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are not present in `packages/api/.env`, so live notification delivery still needs environment setup and verification.

## What Is Left To Do

### Priority 1: Finish public-page wiring

1. Wire the remaining Home hero, hero-footnote, donation CTA, and mission media to API-backed content.
2. Wire the About page intro/story/mission/values to API-backed content or remove the unused editor fields.
3. Wire the Impact page testimonial and annual report to API-backed content.
4. Wire the Get Involved bank details and UPI QR content to API-backed content.
5. Decide whether document slots should remain dynamic or be constrained to the six fixed slots from the plan.

### Priority 2: Finish media controls

1. Add editable hero/section image slots where the plan calls for them.
2. Add a real UPI QR upload field if the Get Involved page should be managed from admin.
3. Add any missing image controls for the About and Home page layouts.

### Priority 3: Finish email notifications

1. Add SMTP environment variables for the API deployment.
2. Verify that the three form submission types deliver notification mail reliably.
3. Remove stale TODO comments once the mail flow is confirmed.

### Priority 4: Deployment and handoff

1. Confirm the deployed API base URL and set `VITE_API_BASE` for the admin build.
2. Confirm the public web build points at the correct API base URL.
3. Verify CORS on the deployed API.
4. Run a final browser regression across Home, About, Impact, Gallery, Get Involved, Contact, Submissions, and Change Password.
5. Prepare the client handoff checklist and short usage guide.

## Detailed Todo List

| # | Task | Status | Notes |
|---|---|---|---|
| 1 | Validate Settings editor against public site | Done | Shared site identity and contact info are wired. |
| 2 | Wire Home hero and CTA to public page | Partial | Admin saves the data, public Home still hardcodes the copy. |
| 3 | Add Home mission photo grid editing | Left | Not yet exposed in admin. |
| 4 | Wire About intro/story/values to public page | Partial | Admin saves fields, public About still hardcodes the copy. |
| 5 | Add About rich-text story support | Left | No rich-text editor is present. |
| 6 | Wire Impact testimonial and annual report | Partial | Admin saves fields, public Impact still hardcodes those blocks. |
| 7 | Wire Get Involved bank and UPI content | Partial | Donation tiers and volunteer roles are wired; bank/QR are not. |
| 8 | Keep Our Work editor in sync | Done | Public Our Work page consumes the editor-backed data. |
| 9 | Keep Contact editor in sync | Done | Contact settings are public-facing. |
| 10 | Finish gallery upload/reorder/delete | Done | Gallery manager and API are working. |
| 11 | Finish team editor | Done | CRUD + reorder + photo upload work. |
| 12 | Finish partners editor | Done | CRUD + reorder + logo upload work. |
| 13 | Finish documents editor | Done | CRUD + reorder + PDF/preview upload work. |
| 14 | Finish programs editor | Done | CRUD + reorder + image upload work. |
| 15 | Finish activity posts editor | Done | CRUD + publish toggle + reorder work. |
| 16 | Finish volunteer roles editor | Done | Managed from Get Involved editor. |
| 17 | Finish form submissions inbox | Done | Browser-verified with live data. |
| 18 | Verify SMTP mail delivery | Partial | Mailer code exists, env vars still need setup. |
| 19 | Add audit logging coverage | Partial | Some writes are logged; full coverage is not yet checked. |
| 20 | Deploy API to production | Left | Repo is connected, but deployment still needs to be completed and verified. |
| 21 | Set admin API base env var | Left | `packages/admin/.env` is empty. |
| 22 | Set web API base env var | Left | Public web deployment env still needs confirmation. |
| 23 | Final browser regression | Left | Needs one full pass after content wiring/deployment. |
| 24 | Client handoff guide | Left | Not yet written. |

## Verification Notes

- `git remote -v` shows the repository is connected to GitHub.
- `npm --prefix packages/admin run build` succeeds.
- `npm --prefix packages/web run build` succeeds.
- Browser verification confirmed the submissions inbox and change-password page render.

## Open Questions

1. Should the public About and Home pages remain mostly static, or should they be fully converted to admin-managed content?
2. Do we want the plan’s fixed document slots, or is the current dynamic document list acceptable?
3. Should the Get Involved bank/UPI data be admin-managed, or stay static?
4. Do we want to keep the hybrid fallback content model in the public site, or remove more of the hardcoded copy after the remaining fields are wired?

## Short Version

- Done: backend, auth shell, rich list editors, submissions inbox, change password.
- Partial: public-page content wiring, some media controls, SMTP notifications.
- Left: deployment cleanup, full public-page migration, final regression, handoff.

---

## Handoff Checklist

Before delivering to client:

- [ ] Confirm all public pages reflect the intended content model
- [ ] Confirm SMTP notifications work in the deployed environment
- [ ] Confirm admin login and password change work in production
- [ ] Confirm gallery, documents, team, partners, programs, and posts CRUD all work in production
- [ ] Confirm the public site loads the correct API base URL
- [ ] Run a final browser regression on desktop and mobile widths
- [ ] Prepare the client walkthrough and support notes

## Reference Files

- `admin-panel-architecture-plan.md` for the original phase plan
- `DEPLOYMENT_CHECKLIST.md` for deployment-oriented todo items
- `RAILWAY_DEPLOYMENT_GUIDE.md` for step-by-step deployment instructions
- `packages/api/src/routes/` for backend route implementations
- `packages/admin/src/pages/` for admin editors and inboxes

## Current Bottom Line

- The codebase is no longer blocked by GitHub connectivity.
- The remaining work is public-page wiring, env/config setup, and final deployment validation.
