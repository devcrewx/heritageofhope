# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.js >> Web — Accessibility audit >> About page has no critical a11y violations
- Location: tests/a11y.spec.js:18:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 214

- Array []
+ Array [
+   Object {
+     "description": "Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies",
+     "help": "Interactive controls must not be nested",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=playwright",
+     "id": "nested-interactive",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "no-focusable-content",
+             "impact": "serious",
+             "message": "Element has focusable descendants",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"btn btn-ghost\">View</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(1) > .card-body > div > .btn-ghost",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"btn\" style=\"margin-left: 0.5rem;\">Download</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(1) > .card-body > div > button:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has focusable descendants",
+         "html": "<article class=\"card doc-card\" data-reveal=\"true\" role=\"button\" tabindex=\"0\" style=\"--reveal-delay: 175ms; --reveal-duration: 520ms; --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".doc-card.card[role=\"button\"]:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "no-focusable-content",
+             "impact": "serious",
+             "message": "Element has focusable descendants",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"btn btn-ghost\">View</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(2) > .card-body > div > .btn-ghost",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"btn\" style=\"margin-left: 0.5rem;\">Download</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(2) > .card-body > div > button:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has focusable descendants",
+         "html": "<article class=\"card doc-card\" data-reveal=\"true\" role=\"button\" tabindex=\"0\" style=\"--reveal-delay: 230ms; --reveal-duration: 520ms; --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".doc-card.card[role=\"button\"]:nth-child(2)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "no-focusable-content",
+             "impact": "serious",
+             "message": "Element has focusable descendants",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"btn btn-ghost\">View</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(3) > .card-body > div > .btn-ghost",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"btn\" style=\"margin-left: 0.5rem;\">Download</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(3) > .card-body > div > button:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has focusable descendants",
+         "html": "<article class=\"card doc-card\" data-reveal=\"true\" role=\"button\" tabindex=\"0\" style=\"--reveal-delay: 285ms; --reveal-duration: 520ms; --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".doc-card.card[role=\"button\"]:nth-child(3)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "no-focusable-content",
+             "impact": "serious",
+             "message": "Element has focusable descendants",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"btn btn-ghost\">View</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(4) > .card-body > div > .btn-ghost",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"btn\" style=\"margin-left: 0.5rem;\">Download</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(4) > .card-body > div > button:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has focusable descendants",
+         "html": "<article class=\"card doc-card\" data-reveal=\"true\" role=\"button\" tabindex=\"0\" style=\"--reveal-delay: 340ms; --reveal-duration: 520ms; --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".doc-card.card[role=\"button\"]:nth-child(4)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "no-focusable-content",
+             "impact": "serious",
+             "message": "Element has focusable descendants",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"btn btn-ghost\">View</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(5) > .card-body > div > .btn-ghost",
+                 ],
+               },
+               Object {
+                 "html": "<button type=\"button\" class=\"btn\" style=\"margin-left: 0.5rem;\">Download</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(5) > .card-body > div > button:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has focusable descendants",
+         "html": "<article class=\"card doc-card\" data-reveal=\"true\" role=\"button\" tabindex=\"0\" style=\"--reveal-delay: 340ms; --reveal-duration: 520ms; --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".doc-card.card[role=\"button\"]:nth-child(5)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "no-focusable-content",
+             "impact": "serious",
+             "message": "Element has focusable descendants",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" class=\"btn btn-ghost\">View</button>",
+                 "target": Array [
+                   ".doc-card.card[role=\"button\"]:nth-child(6) > .card-body > div > .btn-ghost",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has focusable descendants",
+         "html": "<article class=\"card doc-card\" data-reveal=\"true\" role=\"button\" tabindex=\"0\" style=\"--reveal-delay: 340ms; --reveal-duration: 520ms; --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".doc-card.card[role=\"button\"]:nth-child(6)",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.keyboard",
+       "wcag2a",
+       "wcag412",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "RGAAv4",
+       "RGAA-7.1.1",
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
          - paragraph [ref=e24]: About
          - heading "Rooted in community. Driven by impact." [level=1] [ref=e25]
          - paragraph [ref=e26]: We work directly with the people we serve, ensuring every initiative brings lasting, positive change.
        - img "Heritage of Hope Foundation" [ref=e28]
      - generic [ref=e29]:
        - generic [ref=e30]:
          - paragraph [ref=e31]: Documents
          - heading "Official documents" [level=2] [ref=e32]
        - generic [ref=e33]:
          - button "Trust Registration Certificate Trust Registration Certificate 2024-05-18 Official trust registration deed (Deed No. IV-190200986/2024) View Download" [ref=e34] [cursor=pointer]:
            - img "Trust Registration Certificate" [ref=e36]
            - generic [ref=e37]:
              - heading "Trust Registration Certificate" [level=3] [ref=e38]
              - paragraph [ref=e39]: 2024-05-18
              - paragraph [ref=e40]: Official trust registration deed (Deed No. IV-190200986/2024)
              - generic [ref=e41]:
                - button "View" [ref=e42]
                - button "Download" [ref=e43]
          - button "NGO DARPAN (NITI AAYOG) NGO DARPAN (NITI AAYOG) 2024-01-01 NGO Darpan listing (NITI Aayog) — primary registration entry View Download" [ref=e44] [cursor=pointer]:
            - img "NGO DARPAN (NITI AAYOG)" [ref=e46]
            - generic [ref=e47]:
              - heading "NGO DARPAN (NITI AAYOG)" [level=3] [ref=e48]
              - paragraph [ref=e49]: 2024-01-01
              - paragraph [ref=e50]: NGO Darpan listing (NITI Aayog) — primary registration entry
              - generic [ref=e51]:
                - button "View" [ref=e52]
                - button "Download" [ref=e53]
          - button "12A Certificate (provisional) 12A Certificate (provisional) 2026-04-01 Provisional 12A registration (income tax exemption) View Download" [ref=e54] [cursor=pointer]:
            - img "12A Certificate (provisional)" [ref=e56]
            - generic [ref=e57]:
              - heading "12A Certificate (provisional)" [level=3] [ref=e58]
              - paragraph [ref=e59]: 2026-04-01
              - paragraph [ref=e60]: Provisional 12A registration (income tax exemption)
              - generic [ref=e61]:
                - button "View" [ref=e62]
                - button "Download" [ref=e63]
          - button "80G Certificate (provisional) 80G Certificate (provisional) 2026-04-01 Provisional 80G — donor tax deduction eligibility View Download" [ref=e64] [cursor=pointer]:
            - img "80G Certificate (provisional)" [ref=e66]
            - generic [ref=e67]:
              - heading "80G Certificate (provisional)" [level=3] [ref=e68]
              - paragraph [ref=e69]: 2026-04-01
              - paragraph [ref=e70]: Provisional 80G — donor tax deduction eligibility
              - generic [ref=e71]:
                - button "View" [ref=e72]
                - button "Download" [ref=e73]
          - button "MCA CSR Registration (CSR-1) MCA CSR Registration (CSR-1) 2024-01-01 MCA confirmation for CSR-funded activities View Download" [ref=e74] [cursor=pointer]:
            - img "MCA CSR Registration (CSR-1)" [ref=e76]
            - generic [ref=e77]:
              - heading "MCA CSR Registration (CSR-1)" [level=3] [ref=e78]
              - paragraph [ref=e79]: 2024-01-01
              - paragraph [ref=e80]: MCA confirmation for CSR-funded activities
              - generic [ref=e81]:
                - button "View" [ref=e82]
                - button "Download" [ref=e83]
          - button "Certificates & Awards Certificates & Awards 2024-07-28 Recognition certificate from Thalassemic Guardians Association View" [ref=e84] [cursor=pointer]:
            - img "Certificates & Awards" [ref=e86]
            - generic [ref=e87]:
              - heading "Certificates & Awards" [level=3] [ref=e88]
              - paragraph [ref=e89]: 2024-07-28
              - paragraph [ref=e90]: Recognition certificate from Thalassemic Guardians Association
              - button "View" [ref=e92]
      - generic [ref=e93]:
        - generic [ref=e94]:
          - generic [ref=e95]:
            - paragraph [ref=e96]: Our story
            - heading "Grounded in field realities" [level=2] [ref=e97]
          - paragraph [ref=e98]: The foundation began from direct work with children and women in underserved areas.
        - generic [ref=e99]:
          - article [ref=e100]:
            - paragraph [ref=e101]: Mission
            - paragraph [ref=e102]: To create lasting, positive change in the lives of children, women, and communities in South 24 Parganas.
          - article [ref=e103]:
            - paragraph [ref=e104]: Vision
            - paragraph [ref=e105]: A community where every child has access to quality education, healthcare, and dignity.
      - generic [ref=e106]:
        - generic [ref=e107]:
          - paragraph [ref=e108]: Guided by shared principles
          - heading "How we work" [level=2] [ref=e109]
        - generic [ref=e110]:
          - article [ref=e111]:
            - generic [ref=e112]:
              - heading "Compassion" [level=3] [ref=e113]
              - paragraph [ref=e114]: We believe in leading with empathy, ensuring that every action we take is rooted in genuine care for those we serve.
          - article [ref=e115]:
            - generic [ref=e116]:
              - heading "Transparency" [level=3] [ref=e117]
              - paragraph [ref=e118]: Our processes are open and clear; donors and beneficiaries see exactly where resources go.
          - article [ref=e119]:
            - generic [ref=e120]:
              - heading "Community" [level=3] [ref=e121]
              - paragraph [ref=e122]: We work alongside the community, respecting local needs and ensuring that solutions are shaped by the people.
          - article [ref=e123]:
            - generic [ref=e124]:
              - heading "Empowerment" [level=3] [ref=e125]
              - paragraph [ref=e126]: Our goal is to help individuals and communities take charge of their own growth and future.
      - generic [ref=e127]:
        - img "Registration certificate" [ref=e129]
        - generic [ref=e130]:
          - generic [ref=e131]:
            - paragraph [ref=e132]: Legally registered and transparent
            - heading "Registration and accountability" [level=2] [ref=e133]
          - generic [ref=e134]:
            - article [ref=e135]:
              - paragraph [ref=e136]: Registration certificate
              - paragraph [ref=e137]: Heritage of Hope Foundation is a registered NGO committed to transparency and dedicated service in West Bengal.
            - article [ref=e138]:
              - paragraph [ref=e139]: Partners
              - list "Partners" [ref=e140]:
                - listitem [ref=e141]: OCWE
                - listitem [ref=e142]: B.P. Poddar Hospital
                - listitem [ref=e143]: Thalassaemic Guardians Association
      - generic [ref=e144]:
        - generic [ref=e145]:
          - paragraph [ref=e146]: Dedicated people, doing important work
          - heading "Team snapshot" [level=2] [ref=e147]
        - generic [ref=e148]:
          - article [ref=e149]:
            - img "Founder Team" [ref=e150]
            - generic [ref=e151]:
              - heading "Founder Team" [level=3] [ref=e152]
              - paragraph [ref=e153]: Community coordination and field programs
          - article [ref=e154]:
            - img "Program Support" [ref=e155]
            - generic [ref=e156]:
              - heading "Program Support" [level=3] [ref=e157]
              - paragraph [ref=e158]: Planning, logistics and volunteer support
          - article [ref=e159]:
            - img "Field Volunteers" [ref=e160]
            - generic [ref=e161]:
              - heading "Field Volunteers" [level=3] [ref=e162]
              - paragraph [ref=e163]: Direct service delivery and follow-up
    - contentinfo [ref=e164]:
      - generic [ref=e165]:
        - paragraph [ref=e166]: Heritage of Hope Foundation
        - paragraph [ref=e167]: Children, women and communities in South 24 Parganas, West Bengal.
        - link "Follow us on Facebook" [ref=e169] [cursor=pointer]:
          - /url: https://www.facebook.com/profile.php?id=61559891799273
          - img [ref=e170]
          - text: Follow us on Facebook
      - generic [ref=e172]:
        - paragraph [ref=e173]: +91 98765 43210
        - paragraph [ref=e174]: heritageofhopefoundation@gmail.com
        - paragraph [ref=e175]: Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB, IN
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