Run tests:

```bash
cd e2e-tests
npm install
npx playwright install  # Optional: for browser-based tests
npm run test:api        # Run Node-based API tests (recommended)
```

Environment variables:
- `API_URL` (default https://heritageofhope-api.onrender.com)
- `ADMIN_EMAIL` (default admin@heritageofhope.org)
- `ADMIN_PASSWORD` (default Welcome@123)
- `TEST_IMAGE_PATH` (optional local path to an image for upload/delete test; .webp, .png, .jpg supported)

## What the tests cover

1. **Admin login:** POST `/api/admin/login` with credentials → JWT token issued
2. **Content edit:** PATCH `/api/admin/content/home/hero/intro` with JWT → success
3. **Public sync:** GET `/api/content` (no auth) → returns updated content
4. **(Optional) Media upload:** POST `/api/admin/gallery` with multipart file → Cloudinary upload + DB entry
5. **(Optional) Media delete:** DELETE `/api/admin/gallery/{id}` with JWT → Cloudinary + DB cleanup

## Known issues fixed

- **MIME type for .webp files:** Curl doesn't auto-detect webp MIME type; tests now explicitly set `type=image/webp`
- **Form-data boundary issue:** Switched from Node form-data library to curl for multipart to avoid boundary parsing errors

