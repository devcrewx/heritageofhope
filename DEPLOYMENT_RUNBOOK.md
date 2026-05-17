# Heritage of Hope — Deployment Runbook

## Overview
This document provides operational procedures for managing the Heritage of Hope full-stack application (frontend + admin + API).

**Environments:**
- **Production API:** https://heritageofhope-api.onrender.com (Render)
- **Production Admin:** https://rococo-sherbet-6244e2.netlify.app (Netlify)
- **Production Public Web:** https://cheery-praline-30b4a8.netlify.app (Netlify)

---

## Quick Health Checks

### API Health
```bash
curl -s https://heritageofhope-api.onrender.com/api/health | jq .
# Should return 200 with { "ok": true }
```

### Public Content Endpoint
```bash
curl -s https://heritageofhope-api.onrender.com/api/content | jq 'keys'
# Should return page keys: about, contact, gallery, getInvolved, home, impact, navItems, ourWork, siteMeta
```

### Admin Login
```bash
curl -X POST https://heritageofhope-api.onrender.com/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@heritageofhope.org","password":"YOUR_PASSWORD"}' | jq .
# Returns JWT token if login succeeds
```

---

## Admin User Management

### Initial Credentials
- **Email:** `admin@heritageofhope.org`
- **Password:** Check `.env` on local deployment or ask DevOps for production password

### Change Password
1. Log in to admin panel at https://rococo-sherbet-6244e2.netlify.app
2. Look for "Change Password" or settings option
3. Provide current password and new password (min 8 chars)

### Create Additional Admin Users (via API)
```bash
# Use the create-admin script in packages/api/scripts/createAdmin.js
cd packages/api
npm run create-admin
# Follow prompts to create a new admin user
```

### Reset Seeded Admin (Development Only)
Run the seed script to reset to default admin:
```bash
cd packages/api
npm run seed
# Resets admin to email: admin@heritageofhope.org, password: Welcome@123
```

---

## Environment Variables

### Render (API Service)

Set these in the Render dashboard under **Settings → Environment**:

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Must be set for production |
| `DATABASE_URL` | Supabase pooler URL (see below) | Use pooler endpoint; see Supabase settings |
| `JWT_SECRET` | Long random string (32+ chars) | Change in production |
| `JWT_EXPIRY` | `7d` | Token expiration |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account name | Required for media upload |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Required for media upload |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Required for media upload |
| `WEB3FORMS_API_KEY` | Web3Forms key | For contact form emails |
| `WEB3FORMS_RECIPIENT_EMAIL` | Email to receive forms | Form submission recipient |

### Supabase Database Connection

**Pooler Endpoint** (recommended for production):
```
postgresql://postgres.[PROJECT_ID]:PASSWORD@aws-[REGION].pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

**Direct Connection** (for migrations):
```
postgresql://postgres.[PROJECT_ID]:PASSWORD@aws-[REGION].supabase.co:5432/postgres?sslmode=require
```

**Where to Find:**
- Supabase Dashboard → Project → Database → Connection string
- Copy the pooler endpoint (contains `pooler.supabase.com`)

### Netlify (Frontend Builds)

**Admin Panel** (`packages/admin`):
- `VITE_API_BASE` = `https://heritageofhope-api.onrender.com`
- Set in `netlify.toml` or Netlify UI

**Public Web** (`packages/web`):
- `VITE_API_BASE_URL` = `https://heritageofhope-api.onrender.com`
- Set in `netlify.toml` or Netlify UI

---

## Common Troubleshooting

### API Returns 500 on Login

**Cause:** Missing `DATABASE_URL` or wrong connection string.

**Fix:**
1. Verify `DATABASE_URL` is set on Render dashboard
2. Ensure using **pooler endpoint** (contains `pooler.supabase.com`)
3. Restart Render service:
   ```bash
   render restart srv-d84c93v7f7vs739vrml0
   ```

### Upload/Delete Media Returns 500

**Cause 1:** Cloudinary credentials missing or invalid.
**Cause 2:** MIME type not recognized (especially for .webp files).

**Checks:**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` on Render
- For .webp files, use explicit MIME type in curl: `-F 'files=@image.webp;type=image/webp'`
- Test Cloudinary connectivity:
  ```bash
  npm test:api  # Requires TEST_IMAGE_PATH env var
  ```

### Admin Panel Shows Blank / 404

**Cause:** `VITE_API_BASE` not set or incorrect.

**Fix:**
1. Check `packages/admin/netlify.toml` has correct API URL
2. Rebuild on Netlify (push to main branch or manual redeploy)

### Content Not Syncing to Public Site

**Cause:** Admin changes not yet propagated or public API cache.

**Fix:**
1. Verify admin JWT token hasn't expired
2. Check that PATCH returns `success: true`
3. Public API is read-only; no auth needed:
   ```bash
   curl https://heritageofhope-api.onrender.com/api/content | jq '.home.hero.intro'
   ```

---

## Running Tests

### API E2E Tests (Auth + Content Edit + Upload)

```bash
cd e2e-tests
npm install
TEST_IMAGE_PATH=/path/to/test/image.webp npm run test:api
```

**What it tests:**
- Admin login with JWT
- Content PATCH update
- Public API read verification
- File upload to Cloudinary (if image path provided)
- File delete from gallery

---

## Database Maintenance

### Backup
Supabase auto-backs up hourly. Manual backup:
1. Supabase Dashboard → Database
2. Click "Backup" or use SQL dump

### Reset / Re-seed

```bash
# Re-seed (clears and repopulates content)
cd packages/api
npm run seed

# Or run migrations fresh
npm run prisma:push
npm run seed
```

---

## Deployment Checklist

### Before Going Live

- [ ] Admin password changed from seeded default (`Welcome@123`)
- [ ] `DATABASE_URL` set to Supabase pooler endpoint
- [ ] Cloudinary credentials set (`CLOUD_NAME`, `API_KEY`, `API_SECRET`)
- [ ] `JWT_SECRET` is a long random string (not default)
- [ ] `NODE_ENV=production` on Render
- [ ] Netlify env vars confirmed (`VITE_API_BASE`, etc.)
- [ ] Health check passes: `curl https://heritageofhope-api.onrender.com/api/health`
- [ ] Admin login works with updated credentials
- [ ] Admin can create/edit/delete content (gallery, team, posts, etc.)
- [ ] Contact form submissions work via Web3Forms

### Post-Deployment

- [ ] Monitor Render logs for errors: `render logs --resources srv-d84c93v7f7vs739vrml0`
- [ ] Test public site load: https://cheery-praline-30b4a8.netlify.app
- [ ] Verify admin panel loads: https://rococo-sherbet-6244e2.netlify.app
- [ ] Confirm content is visible on public site
- [ ] Open About → Documents and verify the modal opens/closes without a blank screen

---

## Key Files & Locations

| Path | Purpose |
|---|---|
| `packages/api/src/index.js` | API entry point |
| `packages/api/src/routes/admin/` | Admin API endpoints |
| `packages/api/scripts/seed.js` | Seed script (content + admin user) |
| `packages/admin/src/` | Admin UI (React) |
| `packages/web/src/` | Public web UI (React) |
| `e2e-tests/run-api-tests.js` | API regression tests |
| `prisma/schema.prisma` | Database schema |

---

## Contact & Support

For deployment issues, check:
1. Render service logs
2. Supabase database status
3. Netlify build logs
4. Environment variables match checklist above

---

**Last Updated:** May 17, 2026
