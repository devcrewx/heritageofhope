# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.js >> Web — Accessibility audit >> Gallery page has no critical a11y violations
- Location: tests/a11y.spec.js:18:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 68

- Array []
+ Array [
+   Object {
+     "description": "Ensure elements with an ARIA role that require child roles contain them",
+     "help": "Certain ARIA roles must contain particular children",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/aria-required-children?application=playwright",
+     "id": "aria-required-children",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "messageKey": "unallowed",
+               "values": "button[tabindex]",
+             },
+             "id": "aria-required-children",
+             "impact": "critical",
+             "message": "Element has children which are not allowed: button[tabindex]",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"filter-chip active\">All</button>",
+                 "target": Array [
+                   ".active.filter-chip",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"filter-chip\">Education</button>",
+                 "target": Array [
+                   ".filter-chip:nth-child(2)",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"filter-chip\">Healthcare</button>",
+                 "target": Array [
+                   ".filter-chip:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"filter-chip\">Welfare</button>",
+                 "target": Array [
+                   ".filter-chip:nth-child(4)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has children which are not allowed: button[tabindex]",
+         "html": "<div class=\"filter-row\" role=\"tablist\" aria-label=\"Gallery categories\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           ".filter-row",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.aria",
+       "wcag2a",
+       "wcag131",
+       "EN-301-549",
+       "EN-9.1.3.1",
+       "RGAAv4",
+       "RGAA-9.3.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "Heritage of Hope Foundation" [ref=e5] [cursor=pointer]:
      - /url: /
      - generic [ref=e6]:
        - paragraph [ref=e7]: Heritage of Hope Foundation
        - paragraph [ref=e8]: Registered NGO | West Bengal
    - navigation "Primary navigation" [ref=e9]:
      - link "Home" [ref=e10] [cursor=pointer]:
        - /url: /
      - link "About" [ref=e11] [cursor=pointer]:
        - /url: /about
      - link "Our Work" [ref=e12] [cursor=pointer]:
        - /url: /our-work
      - link "Impact" [ref=e13] [cursor=pointer]:
        - /url: /impact
      - link "Gallery" [ref=e14] [cursor=pointer]:
        - /url: /gallery
      - link "Get Involved" [ref=e15] [cursor=pointer]:
        - /url: /get-involved
      - link "Contact" [ref=e16] [cursor=pointer]:
        - /url: /contact
    - generic [ref=e17]:
      - button "বাংলা" [ref=e18] [cursor=pointer]
      - link "Donate Now" [ref=e19] [cursor=pointer]:
        - /url: /get-involved#donate
  - generic [ref=e20]:
    - main [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]:
          - paragraph [ref=e24]: Gallery
          - heading "Photo Gallery" [level=1] [ref=e25]
          - paragraph [ref=e26]: Moments from our programs and community events.
        - generic [ref=e27]:
          - paragraph [ref=e28]: Filter by category
          - paragraph [ref=e29]: Browse photos
      - generic [ref=e30]:
        - tablist "Gallery categories" [ref=e31]:
          - button "All" [ref=e32] [cursor=pointer]
          - button "Education" [ref=e33] [cursor=pointer]
          - button "Healthcare" [ref=e34] [cursor=pointer]
          - button "Welfare" [ref=e35] [cursor=pointer]
        - generic [ref=e36]:
          - article [ref=e37]:
            - img "Learning in Kishalaya" [ref=e38]
            - generic [ref=e39]:
              - generic [ref=e40]: Education
              - heading "Learning in Kishalaya" [level=3] [ref=e41]
          - article [ref=e42]:
            - img "Free health camp" [ref=e43]
            - generic [ref=e44]:
              - generic [ref=e45]: Healthcare
              - heading "Free health camp" [level=3] [ref=e46]
          - article [ref=e47]:
            - img "Winter distribution" [ref=e48]
            - generic [ref=e49]:
              - generic [ref=e50]: Welfare
              - heading "Winter distribution" [level=3] [ref=e51]
          - article [ref=e52]:
            - img "Notebook distribution day" [ref=e53]
            - generic [ref=e54]:
              - generic [ref=e55]: Education
              - heading "Notebook distribution day" [level=3] [ref=e56]
          - article [ref=e57]:
            - img "Blood donation drive" [ref=e58]
            - generic [ref=e59]:
              - generic [ref=e60]: Healthcare
              - heading "Blood donation drive" [level=3] [ref=e61]
          - article [ref=e62]:
            - img "Monsoon relief" [ref=e63]
            - generic [ref=e64]:
              - generic [ref=e65]: Welfare
              - heading "Monsoon relief" [level=3] [ref=e66]
          - article [ref=e67]:
            - img "Community feast by the river" [ref=e68]
            - generic [ref=e69]:
              - generic [ref=e70]: Welfare
              - heading "Community feast by the river" [level=3] [ref=e71]
          - article [ref=e72]:
            - img "Students reading at Kishalaya" [ref=e73]
            - generic [ref=e74]:
              - generic [ref=e75]: Education
              - heading "Students reading at Kishalaya" [level=3] [ref=e76]
          - article [ref=e77]:
            - img "Sarees for mothers — Durga Puja" [ref=e78]
            - generic [ref=e79]:
              - generic [ref=e80]: Welfare
              - heading "Sarees for mothers — Durga Puja" [level=3] [ref=e81]
          - article [ref=e82]:
            - img "Durga Puja clothes for children" [ref=e83]
            - generic [ref=e84]:
              - generic [ref=e85]: Welfare
              - heading "Durga Puja clothes for children" [level=3] [ref=e86]
          - article [ref=e87]:
            - img "Pre-donation health checkup" [ref=e88]
            - generic [ref=e89]:
              - generic [ref=e90]: Healthcare
              - heading "Pre-donation health checkup" [level=3] [ref=e91]
          - article [ref=e92]:
            - img "Children celebrating together" [ref=e93]
            - generic [ref=e94]:
              - generic [ref=e95]: Welfare
              - heading "Children celebrating together" [level=3] [ref=e96]
    - contentinfo [ref=e97]:
      - generic [ref=e98]:
        - paragraph [ref=e99]: Heritage of Hope Foundation
        - paragraph [ref=e100]: Children, women and communities in South 24 Parganas, West Bengal.
        - link "Follow us on Facebook" [ref=e102] [cursor=pointer]:
          - /url: https://www.facebook.com/profile.php?id=61559891799273
          - img [ref=e103]
          - text: Follow us on Facebook
      - generic [ref=e105]:
        - paragraph [ref=e106]: +91 98765 43210
        - paragraph [ref=e107]: heritageofhopefoundation@gmail.com
        - paragraph [ref=e108]: Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB, IN
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test')
  2  | const AxeBuilder = require('@axe-core/playwright').default
  3  | 
  4  | const WEB_URL = process.env.WEB_URL || 'https://web-peach-six-y2ufgnodmc.vercel.app'
  5  | const ADMIN_URL = process.env.ADMIN_URL || 'https://admin-nine-beige-85.vercel.app'
  6  | 
  7  | test.describe('Web — Accessibility audit', () => {
  8  |   const pages = [
  9  |     { path: '/', name: 'Home' },
  10 |     { path: '/about', name: 'About' },
  11 |     { path: '/programs', name: 'Programs' },
  12 |     { path: '/gallery', name: 'Gallery' },
  13 |     { path: '/contact', name: 'Contact' },
  14 |     { path: '/get-involved', name: 'Get Involved' },
  15 |   ]
  16 | 
  17 |   for (const { path, name } of pages) {
  18 |     test(`${name} page has no critical a11y violations`, async ({ page }) => {
  19 |       await page.goto(`${WEB_URL}${path}`, { waitUntil: 'networkidle' })
  20 |       await page.waitForTimeout(1000)
  21 | 
  22 |       const results = await new AxeBuilder({ page }).analyze()
> 23 |       expect(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([])
     |                                                                                                   ^ Error: expect(received).toEqual(expected) // deep equality
  24 |     })
  25 |   }
  26 | })
  27 | 
  28 | test.describe('Admin — Accessibility audit', () => {
  29 |   test('Login page has no critical a11y violations', async ({ page }) => {
  30 |     await page.goto(`${ADMIN_URL}/login`, { waitUntil: 'networkidle' })
  31 |     await page.waitForTimeout(1000)
  32 | 
  33 |     const results = await new AxeBuilder({ page }).analyze()
  34 |     expect(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([])
  35 |   })
  36 | })
  37 | 
```