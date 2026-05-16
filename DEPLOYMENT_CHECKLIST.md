# Heritage of Hope Foundation — Deployment Checklist

**Status: May 15, 2026**
**Planned Deployment**: According to `admin-panel-architecture-plan.md` Section 15

---

## Completed ✅

- [x] API code written and tested locally (`packages/api`)
  - Express.js server with JWT authentication
  - Prisma ORM configured for PostgreSQL
  - All routes implemented
  
- [x] Database setup complete
  - Supabase PostgreSQL connected via `DATABASE_URL`
  - All tables created and synced with Prisma schema
  - Admin user created: `admin@heritageofhope.org` / `SecurePass123!`
  
- [x] Admin panel built (`packages/admin`)
  - Deployed to Netlify at `rococo-sherbet-6244e2.netlify.app`
  - Features: Login, Dashboard, all editors implemented
  
- [x] Cloudinary integration configured
  - API keys in `.env`
  - Image uploads tested
  
- [x] Railway configuration file created
  - `packages/api/railway.json` configured with start command

---

## In Progress 🔄

### 1. **GitHub Repository Setup** (BLOCKING for Railway auto-deploy)

**Current Issue**: Repository has no remote (`origin`) configured.

**Action Required**:
- Option A (Recommended): Push to GitHub
  ```bash
  cd /home/DevCrewX/Projects/heritageofhope
  git remote add origin https://github.com/YOUR_USERNAME/heritageofhope.git
  git branch -M main
  git push -u origin main
  ```
  
- Option B: Use Railway CLI directly (alternative if no GitHub)
  ```bash
  npm install -g @railway/cli
  railway login
  cd packages/api
  railway init
  railway up
  ```

### 2. **Railway Deployment**

Per `admin-panel-architecture-plan.md` Section 15:

| Service | Config | Status |
|---------|--------|--------|
| Railway API | Read from `packages/api/railway.json` | Pending GitHub connection |
| Netlify Admin | `packages/admin` base dir | ✅ Active at rococo-sherbet-6244e2.netlify.app |
| Supabase DB | PostgreSQL | ✅ Live and synced |
| Cloudinary | Media storage | ✅ Configured |

**Deploy Steps**:
1. Set up GitHub remote (see Step 1)
2. In Railway dashboard → New Project → Deploy from GitHub
3. Select main branch, auto-detect monorepo
4. Select `packages/api` directory
5. Add environment variables (see Step 3)
6. Deploy button → Railway auto-builds and deploys

### 3. **Environment Variables on Railway**

Copy these to Railway project settings:
```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:skibidiRizzler@db.rwpwjukcmshnvqnceolw.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=u8Vx9kZr2QpLm3b7YtF6hNw0Sg4XcR!aZ5$eP
JWT_EXPIRY=7d
ALLOWED_ORIGINS=https://rococo-sherbet-6244e2.netlify.app,https://admin.heritageofhopefoundation.org,http://localhost:5173,http://localhost:3000
CLOUDINARY_CLOUD_NAME=dsa6xl7wt
CLOUDINARY_API_KEY=148312719168573
CLOUDINARY_API_SECRET=YOFCWU2_UumhScpQttsJU8u6FIg
```

### 4. **Update Admin Panel API Endpoint**

Current: Admin panel tries to connect to `heritageofhope-api-production.up.railway.app`

After Railway deployment, update:
- Find API base URL from Railway dashboard
- Update `packages/admin/src` API calls to point to correct domain

**Location**: `packages/admin/src/lib/api.js` or main API service file

### 5. **Custom Domains** (Optional but recommended)

Per the plan:
- `heritageofhopefoundation.org` → Netlify site 1 (public web)
- `admin.heritageofhopefoundation.org` → Netlify site 2 (admin panel)
- `api.heritageofhopefoundation.org` → Railway service

Add to `ALLOWED_ORIGINS` on Railway once configured.

---

## Testing Roadmap 🧪

### Phase 1: API Local Testing ✅
- [x] API boots successfully
- [x] Database migrations applied
- [x] Admin user created
- [x] JWT authentication works

### Phase 2: Railway Deployment (NEXT)
- [ ] Repository pushed to GitHub
- [ ] Railway project created and connected
- [ ] Auto-deployment triggers on git push
- [ ] Railway service gets public URL
- [ ] Health check: `GET /api/health` returns 200

### Phase 3: Admin Panel Integration
- [ ] Admin panel updated with correct API endpoint
- [ ] CORS properly configured on API
- [ ] Login works: `admin@heritageofhope.org` / `SecurePass123!`
- [ ] Dashboard loads without errors
- [ ] Test one editor: update a stat, verify it saves

### Phase 4: Full Integration
- [ ] Public website reaches API for content
- [ ] Admin creates a gallery photo
- [ ] Public site displays new photo immediately (or after cache TTL)
- [ ] All 7 pages render with API data

---

## Key Files & Locations

| File | Purpose | Location |
|------|---------|----------|
| Deployment config | Railway auto-deploy | `packages/api/railway.json` |
| DB schema | Prisma models | `packages/api/prisma/schema.prisma` |
| Admin script | Create first user | `packages/api/scripts/createAdmin.js` |
| API routes | All endpoints | `packages/api/src/routes/**` |
| Admin UI | React components | `packages/admin/src/**` |
| Public site | Live frontend | `packages/web/src/**` |
| Environment | API config | `packages/api/.env` |

---

## Credentials (SECURE)

- **Admin Username**: `admin@heritageofhope.org`
- **Admin Password**: `SecurePass123!`
- **Supabase Database**: `postgres://` in `.env`
- **Cloudinary API**: Keys in `.env`
- **JWT Secret**: `u8Vx9kZr2QpLm3b7YtF6hNw0Sg4XcR!aZ5$eP`

⚠️ **DO NOT COMMIT THESE CREDENTIALS** — they're already in `.env` which should be `.gitignore`d.

---

## Quick Links

- **Admin Panel (Current)**: https://rococo-sherbet-6244e2.netlify.app
- **Public Website**: https://cheery-praline-30b4a8.netlify.app
- **Railway Dashboard**: https://railway.app
- **Supabase Dashboard**: https://app.supabase.com
- **Cloudinary Dashboard**: https://cloudinary.com/console

---

## Next Immediate Actions

1. **For local testing**: API works ✅, can run `npm run dev`
2. **To enable Railway**: Push to GitHub + configure Railway
3. **To enable admin login**: Deploy API to Railway, update admin panel endpoint
4. **To test end-to-end**: Run through Testing Roadmap Phase 2–4

---

*Last updated: May 15, 2026*
*Plan reference: admin-panel-architecture-plan.md Section 15*
