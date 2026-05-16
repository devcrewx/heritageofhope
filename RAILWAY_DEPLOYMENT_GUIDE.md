# Railway Deployment Guide

## Current Status

✅ **Completed:**
- API code fully developed and tested locally
- Database (Supabase PostgreSQL) configured and synced 
- Admin user created (`admin@heritageofhope.org` / `SecurePass123!`)
- Admin panel deployed to Netlify
- railway.json configuration file created
- All environment variables configured locally

❌ **Blocking Issue:**
- GitHub repository not connected (no remote configured)
- API not yet deployed to Railway

---

## Step 1: Configure GitHub Remote

The repository currently has no git remote. First, choose your approach:

### Option A: Create a new GitHub repository (Recommended)

1. **Create repo on GitHub**
   - Go to https://github.com/new
   - Repository name: `heritageofhope`
   - Description: "Heritage of Hope Foundation website with admin panel"
   - Public or Private (your choice)
   - Do NOT initialize with README (we already have it locally)
   - Click "Create repository"

2. **Add remote to local repository**
   ```bash
   cd /home/DevCrewX/Projects/heritageofhope
   git remote add origin https://github.com/YOUR_USERNAME/heritageofhope.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your GitHub username.

### Option B: Use existing GitHub repository

```bash
cd /home/DevCrewX/Projects/heritageofhope
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Option C: Use Railway CLI (no GitHub needed)

If you don't want to use GitHub, use Railway's CLI directly:

```bash
npm install -g @railway/cli
railway login  # Opens browser to authenticate
cd packages/api
railway init   # Creates railway.json and project
railway up     # Deploys immediately
```

---

## Step 2: Deploy to Railway (GitHub method)

1. **Go to https://railway.app**
   - Sign up or log in
   - Click "Start a New Project"

2. **Import from GitHub**
   - Select "Deploy from GitHub repo"
   - Authorize GitHub access
   - Select the `heritageofhope` repository
   - Click "Deploy Now"

3. **Configure for monorepo**
   - Railway should auto-detect `packages/api/railway.json`
   - If it shows detection options, select `packages/api` as the root directory
   - Railway builds with NIXPACKS (specified in railway.json)

4. **Add environment variables**
   - Click on the API service in Railway dashboard
   - Go to "Variables" tab
   - Add each variable:

```
DATABASE_URL=postgresql://postgres:skibidiRizzler@db.rwpwjukcmshnvqnceolw.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=u8Vx9kZr2QpLm3b7YtF6hNw0Sg4XcR!aZ5$eP
JWT_EXPIRY=7d
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://rococo-sherbet-6244e2.netlify.app,https://admin.heritageofhopefoundation.org,http://localhost:5173,http://localhost:3000,http://localhost:4010
CLOUDINARY_CLOUD_NAME=dsa6xl7wt
CLOUDINARY_API_KEY=148312719168573
CLOUDINARY_API_SECRET=YOFCWU2_UumhScpQttsJU8u6FIg
```

5. **Wait for deployment**
   - Railway builds and deploys automatically
   - Status shows in Deployments tab
   - Takes ~2-5 minutes first time

6. **Get public Railway URL**
   - Click on the API service
   - Look for "Domain" section
   - Railway generates a URL like `https://heritageofhope-api-production.up.railway.app`
   - Copy this URL

---

## Step 3: Verify Railway Deployment

Once deployed, test the API:

```bash
# Test health/welcome endpoint
curl https://your-railway-url.up.railway.app/api/content/home

# Test API is alive
curl https://your-railway-url.up.railway.app/
```

Expected responses:
- Health check should return site content (if seeded)
- 200 status code means API is running

---

## Step 4: Update Admin Panel with Correct API Endpoint

Once you have the Railway URL, update the admin panel:

1. **Update packages/admin/.env**
   ```
   VITE_API_BASE=https://your-railway-url.up.railway.app
   ```

2. **Commit and push**
   ```bash
   cd /home/DevCrewX/Projects/heritageofhope
   git add packages/admin/.env
   git commit -m "Configure admin panel API endpoint to Railway"
   git push origin main
   ```

3. **Netlify auto-redeploys**
   - Netlify detects the push
   - Rebuilds admin panel with new API endpoint
   - Live within seconds

---

## Step 5: Test Admin Login

1. **Open admin panel**
   - https://rococo-sherbet-6244e2.netlify.app/login

2. **Enter credentials**
   - Email: `admin@heritageofhope.org`
   - Password: `SecurePass123!`

3. **Expected outcome**
   - ✅ Login succeeds
   - ✅ Redirects to dashboard
   - ✅ Dashboard loads without errors

---

## Step 6: Test Full Integration

1. **Test API from admin panel**
   - Go to Home Editor
   - Change hero headline text
   - Click Save
   - Success message should appear

2. **Verify database updated**
   ```bash
   # SSH into Supabase or use dashboard
   SELECT * FROM site_content WHERE page = 'home' AND field_key = 'headline_en';
   ```

3. **Test public website**
   - https://cheery-praline-30b4a8.netlify.app
   - Public site should load hero section with updated text

---

## Troubleshooting

### "Cannot resolve host" / DNS error
- **Cause**: API domain not deployed yet, or domain takes time to propagate
- **Solution**: Wait 5 minutes, refresh browser, check Railway deployment status

### "401 Unauthorized" on login
- **Cause**: JWT_SECRET mismatch between environments
- **Solution**: Verify JWT_SECRET in Railway matches `.env` locally

### "CORS error" when trying to save
- **Cause**: Admin panel domain not in `ALLOWED_ORIGINS`
- **Solution**: Add admin domain to ALLOWED_ORIGINS in Railway Variables

### Database connection fails
- **Cause**: DATABASE_URL incorrect or Supabase down
- **Solution**: 
  - Verify DATABASE_URL in Railway Variables
  - Test Supabase connection: `psql <DATABASE_URL>`
  - Check Supabase status

### Build fails on Railway
- **Cause**: Missing dependencies or Node version mismatch
- **Solution**:
  - Check Railway logs (Deployments tab)
  - Verify all npm packages installed locally: `npm install`
  - Verify Node.js version

---

## Custom Domains (Optional)

Once you confirm everything works on Railway-generated URLs, set up custom domains:

### Option 1: Using Netlify config
Update `packages/admin/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### Option 2: Using Railway config
In Railway dashboard → Settings → Railway Domain

### Option 3: Custom domain provider
- Point `admin.heritageofhopefoundation.org` to Netlify IP
- Point `api.heritageofhopefoundation.org` to Railway IP

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `packages/api/railway.json` | Railway deployment config |
| `packages/api/.env` | API environment (local) |
| `packages/api/prisma/schema.prisma` | Database schema |
| `packages/admin/.env` | Admin panel config (set VITE_API_BASE here) |
| `packages/admin/netlify.toml` | Netlify deployment config |
| `packages/web/netlify.toml` | Public website deployment config |

---

## Post-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] API deployed to Railway
- [ ] Railway environment variables configured
- [ ] Database migrations applied (should auto-apply)
- [ ] Admin user verified on Supabase
- [ ] Railway API returns 200 status
- [ ] Admin panel updated with correct API endpoint
- [ ] Admin panel re-deployed on Netlify
- [ ] Admin login works: `admin@heritageofhope.org` / `SecurePass123!`
- [ ] Can load dashboard without errors
- [ ] Can edit content (test on Home page)
- [ ] Database changes reflected in public website
- [ ] All CORS issues resolved
- [ ] Custom domains configured (if desired)

---

## Support

For issues:
1. Check Railway logs: Railway dashboard → Deployments → Latest → Logs
2. Check API health: `curl https://your-api.up.railway.app/api/content/home`
3. Check browser console: F12 → Console tab for client errors
4. Verify environment variables match between local and Railway

**Next steps**: Execute Step 1 (Configure GitHub) to unblock Railway deployment.

---

*Generated: May 15, 2026*
*Based on: admin-panel-architecture-plan.md Section 15*
