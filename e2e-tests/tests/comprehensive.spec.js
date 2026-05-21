const { test, expect } = require('@playwright/test')

const API_URL = process.env.API_URL || 'http://localhost:4010'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@heritageofhope.org'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '7in9GOQMbXdwZnwm'
const TEST_IMAGE_PATH = process.env.TEST_IMAGE_PATH || ''

let token
let createdIds = { stat: null, tier: null, allocation: null, role: null, program: null }
let createdGalleryId, createdDocumentId, createdPartnerId, createdTeamId, createdPostId

test.describe('Comprehensive Heritage of Hope E2E Tests', () => {

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/api/admin/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    expect(loginRes.ok()).toBeTruthy()
    const login = await loginRes.json()
    token = login.token
  })

  test('01 - Auth: /me and /health endpoints', async ({ request }) => {
    const me = await request.get(`${API_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(me.ok()).toBeTruthy()
    const meBody = await me.json()
    expect(meBody.user.email).toBe(ADMIN_EMAIL)

    const health = await request.get(`${API_URL}/api/admin/health`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(health.ok()).toBeTruthy()
    const healthBody = await health.json()
    expect(healthBody.ok).toBe(true)
  })

  test('02 - Public content endpoint returns all sections', async ({ request }) => {
    const res = await request.get(`${API_URL}/api/content`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.siteMeta).toBeTruthy()
    expect(body.home).toBeTruthy()
    expect(body.about).toBeTruthy()
    expect(body.ourWork).toBeTruthy()
    expect(body.impact).toBeTruthy()
    expect(body.gallery).toBeTruthy()
    expect(body.getInvolved).toBeTruthy()
    expect(body.contact).toBeTruthy()
    expect(body.navItems).toBeTruthy()
    expect(Array.isArray(body.navItems)).toBe(true)
  })

  test('03 - Site Settings: PATCH all fields and verify public API', async ({ request }) => {
    const settingsFields = [
      { key: 'org_name', en: 'Heritage of Hope E2E', bn: '' },
      { key: 'navbar_subtitle', en: 'E2E Subtitle', bn: 'E2E সাবটাইটেল' },
      { key: 'footer_mission', en: 'E2E Footer mission', bn: 'E2E ফুটার মিশন' },
      { key: 'donate_button_label', en: 'E2E Donate', bn: 'E2E দান করুন' },
      { key: 'facebook_label', en: 'E2E Follow FB', bn: 'E2E ফেসবুক ফলো' },
      { key: 'phone', en: '+91 99999 88888', bn: '' },
      { key: 'email', en: 'e2e@test.com', bn: '' },
      { key: 'address', en: 'E2E Address', bn: 'E2E ঠিকানা' },
      { key: 'facebook_url', en: 'https://fb.com/e2e', bn: '' },
      { key: 'contact_phone_label', en: 'E2E Phone', bn: 'E2E ফোন' },
      { key: 'contact_email_label', en: 'E2E Email', bn: 'E2E ইমেল' },
      { key: 'contact_address_label', en: 'E2E Address Label', bn: 'E2E ঠিকানা লেবেল' },
    ]
    for (const f of settingsFields) {
      const body = { valueEn: f.en }
      if (f.bn) body.valueBn = f.bn
      const patchRes = await request.patch(`${API_URL}/api/admin/content/settings/${f.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: body,
      })
      expect(patchRes.ok()).toBeTruthy()
      const patchBody = await patchRes.json()
      expect(patchBody.success).toBe(true)
    }

    // Verify public API reflects all changes
    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    expect(content.siteMeta.orgName).toBe('Heritage of Hope E2E')
    expect(content.siteMeta.donateButtonLabel.en).toBe('E2E Donate')
    expect(content.siteMeta.donateButtonLabel.bn).toBe('E2E দান করুন')
    expect(content.siteMeta.facebookLabel.en).toBe('E2E Follow FB')
    expect(content.siteMeta.phone).toBe('+91 99999 88888')
    expect(content.siteMeta.email).toBe('e2e@test.com')
    expect(content.contact.phoneLabel.en).toBe('E2E Phone')
    expect(content.contact.phoneLabel.bn).toBe('E2E ফোন')
    expect(content.contact.emailLabel.en).toBe('E2E Email')
    expect(content.contact.addressLabel.en).toBe('E2E Address Label')
  })

  test('04 - Home Editor: PATCH hero fields and verify public API', async ({ request }) => {
    const heroFields = [
      { key: 'eyebrow', en: 'E2E Eyebrow', bn: 'E2E আইব্রো' },
      { key: 'headline', en: 'E2E Headline', bn: 'E2E শিরোনাম' },
      { key: 'intro', en: 'E2E Intro paragraph text', bn: 'E2E ভূমিকা' },
      { key: 'heroFootnote', en: 'E2E Footnote', bn: 'E2E ফুটনোট' },
      { key: 'figcaption', en: 'E2E Figcaption', bn: 'E2E ফিগক্যাপশন' },
      { key: 'ctaPrimaryLabel', en: 'E2E Primary CTA', bn: 'E2E প্রাথমিক CTA' },
      { key: 'ctaSecondaryLabel', en: 'E2E Secondary CTA', bn: 'E2E মাধ্যমিক CTA' },
      { key: 'certCaption', en: 'E2E Cert caption', bn: 'E2E সার্টিফিকেট' },
    ]
    for (const f of heroFields) {
      const patchRes = await request.patch(`${API_URL}/api/admin/content/home/hero/${f.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: f.en, valueBn: f.bn },
      })
      expect(patchRes.ok()).toBeTruthy()
      const body = await patchRes.json()
      expect(body.success).toBe(true)
    }

    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    const hero = content.home.hero
    expect(hero.eyebrow.en).toBe('E2E Eyebrow')
    expect(hero.headline.bn).toBe('E2E শিরোনাম')
    expect(hero.ctaPrimaryLabel.en).toBe('E2E Primary CTA')
    expect(hero.ctaSecondaryLabel.bn).toBe('E2E মাধ্যমিক CTA')
    expect(hero.certCaption.en).toBe('E2E Cert caption')
    expect(hero.heroFootnote.en).toBe('E2E Footnote')
    expect(hero.figcaption.en).toBe('E2E Figcaption')
  })

  test('05 - Home Editor: PATCH pageContent and CTA fields', async ({ request }) => {
    const pageFields = [
      { section: 'pageContent', key: 'statsLabel', en: 'E2E Stats', bn: 'E2E পরিসংখ্যান' },
      { section: 'pageContent', key: 'statsHeading', en: 'E2E Stats Heading', bn: 'E2E পরিসংখ্যান শিরোনাম' },
      { section: 'pageContent', key: 'pillarLabel', en: 'E2E Pillar', bn: 'E2E স্তম্ভ' },
      { section: 'cta', key: 'headline', en: 'E2E CTA Headline', bn: 'E2E CTA শিরোনাম' },
      { section: 'cta', key: 'body', en: 'E2E CTA body', bn: 'E2E CTA বডি' },
      { section: 'cta', key: 'buttonLabel', en: 'E2E CTA Button', bn: 'E2E CTA বাটন' },
    ]
    for (const f of pageFields) {
      const patchRes = await request.patch(`${API_URL}/api/admin/content/home/${f.section}/${f.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: f.en, valueBn: f.bn },
      })
      expect(patchRes.ok()).toBeTruthy()
    }

    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    expect(content.home.pageContent.statsLabel.en).toBe('E2E Stats')
    expect(content.home.cta.headline.en).toBe('E2E CTA Headline')
    expect(content.home.cta.buttonLabel.bn).toBe('E2E CTA বাটন')
  })

  test('06 - About Editor: PATCH pageContent fields (story, mission, vision, values, reg, partners, team, documents)', async ({ request }) => {
    const pageContentFields = [
      { key: 'eyebrow', en: 'E2E About Eyebrow', bn: 'E2E সম্পর্কে আইব্রো' },
      { key: 'storyLabel', en: 'E2E Story', bn: 'E2E গল্প' },
      { key: 'missionLabel', en: 'E2E Mission', bn: 'E2E মিশন' },
      { key: 'visionLabel', en: 'E2E Vision', bn: 'E2E দৃষ্টি' },
      { key: 'valuesLabel', en: 'E2E Values', bn: 'E2E মূল্যবোধ' },
      { key: 'valuesHeading', en: 'E2E Values Heading', bn: 'E2E মূল্যবোধ শিরোনাম' },
      { key: 'regLabel', en: 'E2E Reg Label', bn: 'E2E রেজি লেবেল' },
      { key: 'regHeading', en: 'E2E Reg Heading', bn: 'E2E রেজি শিরোনাম' },
      { key: 'certLabel', en: 'E2E Cert Label', bn: 'E2E সার্টিফিকেট লেবেল' },
      { key: 'partnersLabel', en: 'E2E Partners', bn: 'E2E অংশীদার' },
      { key: 'teamLabel', en: 'E2E Team', bn: 'E2E দল' },
      { key: 'teamHeading', en: 'E2E Team Heading', bn: 'E2E দল শিরোনাম' },
      { key: 'documentsLabel', en: 'E2E Docs', bn: 'E2E ডকুমেন্ট' },
      { key: 'documentsHeading', en: 'E2E Docs Heading', bn: 'E2E ডকুমেন্ট শিরোনাম' },
    ]
    for (const f of pageContentFields) {
      const patchRes = await request.patch(`${API_URL}/api/admin/content/about/pageContent/${f.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: f.en, valueBn: f.bn },
      })
      expect(patchRes.ok()).toBeTruthy()
    }

    // Story, mission, vision section fields
    const sectionFields = [
      { section: 'story', key: 'heading', en: 'E2E Story Heading', bn: 'E2E গল্প শিরোনাম' },
      { section: 'story', key: 'body', en: 'E2E Story body text', bn: 'E2E গল্প বডি' },
      { section: 'mission', key: 'statement', en: 'E2E Mission statement', bn: 'E2E মিশন বিবৃতি' },
      { section: 'mission', key: 'vision', en: 'E2E Vision statement', bn: 'E2E দৃষ্টি বিবৃতি' },
      { section: 'registration', key: 'body', en: 'E2E Reg body', bn: 'E2E রেজি বডি' },
    ]
    for (const f of sectionFields) {
      const { section, key, en, bn } = f
      const patchRes = await request.patch(`${API_URL}/api/admin/content/about/${section}/${key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: en, valueBn: bn },
      })
      expect(patchRes.ok()).toBeTruthy()
    }

    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    expect(content.about.pageContent.storyLabel.en).toBe('E2E Story')
    expect(content.about.story.heading.en).toBe('E2E Story Heading')
    expect(content.about.mission.en).toBe('E2E Mission statement')
    expect(content.about.vision.bn).toBe('E2E দৃষ্টি বিবৃতি')
    expect(content.about.registration.body.en).toBe('E2E Reg body')
  })

  test('07 - About Editor: About values (4 slots)', async ({ request }) => {
    for (let i = 1; i <= 2; i++) {
      const patchRes = await request.patch(`${API_URL}/api/admin/content/about/values/value${i}_title`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: `E2E Value ${i} Title`, valueBn: `E2E মান ${i} শিরোনাম` },
      })
      expect(patchRes.ok()).toBeTruthy()
      const patchRes2 = await request.patch(`${API_URL}/api/admin/content/about/values/value${i}_description`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: `E2E Value ${i} Desc`, valueBn: `E2E মান ${i} বর্ণনা` },
      })
      expect(patchRes2.ok()).toBeTruthy()
    }
    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    const values = content.about.values
    expect(values.length).toBeGreaterThanOrEqual(2)
    expect(values[0].title.en).toContain('E2E Value')
  })

  test('08 - Our Work Editor: PATCH hero, pageContent, approach, joinBox', async ({ request }) => {
    const patches = [
      { path: 'our-work/hero/pageTitle', en: 'E2E Our Work Title', bn: 'E2E আমাদের কাজ শিরোনাম' },
      { path: 'our-work/hero/intro', en: 'E2E OW intro', bn: 'E2E OW ভূমিকা' },
      { path: 'our-work/pageContent/eyebrow', en: 'E2E OW Eyebrow', bn: 'E2E OW আইব্রো' },
      { path: 'our-work/pageContent/approachLabel', en: 'E2E Approach', bn: 'E2E পদ্ধতি' },
      { path: 'our-work/pageContent/focusLabel', en: 'E2E Focus', bn: 'E2E ফোকাস' },
      { path: 'our-work/pageContent/joinLabel', en: 'E2E Join', bn: 'E2E যোগ দিন' },
      { path: 'our-work/approach/heading', en: 'E2E Approach Heading', bn: 'E2E পদ্ধতি শিরোনাম' },
      { path: 'our-work/join/body', en: 'E2E Join body', bn: 'E2E যোগ দিন বডি' },
      { path: 'our-work/join/button', en: 'E2E Join Button', bn: 'E2E যোগ দিন বাটন' },
    ]
    for (const p of patches) {
      const patchRes = await request.patch(`${API_URL}/api/admin/content/${p.path}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: p.en, valueBn: p.bn },
      })
      expect(patchRes.ok()).toBeTruthy()
    }

    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    expect(content.ourWork.hero.pageTitle.en).toBe('E2E Our Work Title')
    expect(content.ourWork.pageContent.focusLabel.en).toBe('E2E Focus')
    expect(content.ourWork.approach.heading.en).toBe('E2E Approach Heading')
    expect(content.ourWork.joinBox.body.en).toBe('E2E Join body')
    expect(content.ourWork.joinBox.buttonLabel.bn).toBe('E2E যোগ দিন বাটন')

    // Focus tags
    for (let i = 1; i <= 3; i++) {
      const r = await request.patch(`${API_URL}/api/admin/content/our-work/focus/tag${i}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: `E2E Tag ${i}`, valueBn: `E2E ট্যাগ ${i}` },
      })
      expect(r.ok()).toBeTruthy()
    }
    const content2 = await (await request.get(`${API_URL}/api/content`)).json()
    expect(content2.ourWork.focusTags.length).toBe(3)
  })

  test('09 - Impact Editor: PATCH hero, pageContent, feedback, report', async ({ request }) => {
    const patches = [
      { path: 'impact/intro/title', en: 'E2E Impact Title', bn: 'E2E ফলাফল শিরোনাম' },
      { path: 'impact/intro/paragraph', en: 'E2E Impact intro', bn: 'E2E ফলাফল ভূমিকা' },
      { path: 'impact/hero/promise', en: 'E2E Impact promise', bn: 'E2E ফলাফল প্রতিশ্রুতি' },
      { path: 'impact/pageContent/eyebrow', en: 'E2E Impact Eyebrow', bn: 'E2E ফলাফল আইব্রো' },
      { path: 'impact/pageContent/promiseLabel', en: 'E2E Promise Label', bn: 'E2E প্রতিশ্রুতি লেবেল' },
      { path: 'impact/pageContent/fundLabel', en: 'E2E Fund Label', bn: 'E2E তহবিল লেবেল' },
      { path: 'impact/pageContent/fundHeading', en: 'E2E Fund Heading', bn: 'E2E তহবিল শিরোনাম' },
      { path: 'impact/pageContent/feedbackLabel', en: 'E2E Feedback', bn: 'E2E মতামত' },
      { path: 'impact/pageContent/reportLabel', en: 'E2E Report', bn: 'E2E রিপোর্ট' },
      { path: 'impact/feedback/quote', en: 'E2E Feedback quote', bn: 'E2E মতামত উক্তি' },
      { path: 'impact/report/status', en: 'E2E Report status', bn: 'E2E রিপোর্ট স্ট্যাটাস' },
    ]
    for (const p of patches) {
      const patchRes = await request.patch(`${API_URL}/api/admin/content/${p.path}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: p.en, valueBn: p.bn },
      })
      expect(patchRes.ok()).toBeTruthy()
    }

    const contentRes = await request.get(`${API_URL}/api/content`)
    expect(contentRes.ok()).toBeTruthy()
    const content = await contentRes.json()
    expect(content.impact.hero.pageTitle.en).toBe('E2E Impact Title')
    expect(content.impact.hero.promise.en).toBe('E2E Impact promise')
    expect(content.impact.pageContent.eyebrow.en).toBe('E2E Impact Eyebrow')
    expect(content.impact.testimonial.quote.en).toBe('E2E Feedback quote')
    expect(content.impact.annualReport.body.en).toBe('E2E Report status')
  })

  test('10 - Impact Stats CRUD', async ({ request }) => {
    // Create
    const createRes = await request.post(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { value: '999', labelEn: 'E2E Stat EN', labelBn: 'E2E Stat BN' },
    })
    expect(createRes.ok()).toBeTruthy()
    const created = await createRes.json()
    expect(created.id).toBeTruthy()
    const id = created.id

    // Read in list
    const listRes = await request.get(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(listRes.ok()).toBeTruthy()
    const list = await listRes.json()
    const found = list.find(s => s.id === id)
    expect(found).toBeTruthy()
    expect(found.value).toBe('999')

    // Verify in public API
    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const metrics = content.impact.impactMetrics
    const foundMetric = metrics.find(m => m.value === '999')
    expect(foundMetric).toBeTruthy()

    // Update
    const updateRes = await request.patch(`${API_URL}/api/admin/stats/${id}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { value: '888', labelEn: 'E2E Stat Updated' },
    })
    expect(updateRes.ok()).toBeTruthy()

    const content2 = await (await request.get(`${API_URL}/api/content`)).json()
    expect(content2.impact.impactMetrics.find(m => m.value === '888')).toBeTruthy()
    expect(content2.impact.impactMetrics.find(m => m.value === '999')).toBeFalsy()

    // Cleanup: delete
    const delRes = await request.delete(`${API_URL}/api/admin/stats/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
  })

  test('11 - Gallery pageContent PATCH', async ({ request }) => {
    const patches = [
      { key: 'eyebrow', en: 'E2E Gallery Eyebrow', bn: 'E2E গ্যালারি আইব্রো' },
      { key: 'heading', en: 'E2E Gallery Heading', bn: 'E2E গ্যালারি শিরোনাম' },
      { key: 'intro', en: 'E2E Gallery intro', bn: 'E2E গ্যালারি ভূমিকা' },
      { key: 'filterLabel', en: 'E2E Filter', bn: 'E2E ফিল্টার' },
      { key: 'filterText', en: 'E2E Filter text', bn: 'E2E ফিল্টার টেক্সট' },
      { key: 'filterChipAll', en: 'E2E All', bn: 'E2E সব' },
      { key: 'filterChipEducation', en: 'E2E Edu', bn: 'E2E শিক্ষা' },
      { key: 'filterChipHealthcare', en: 'E2E Health', bn: 'E2E স্বাস্থ্য' },
      { key: 'filterChipWelfare', en: 'E2E Welfare', bn: 'E2E কল্যাণ' },
      { key: 'filterAriaLabel', en: 'E2E Gallery categories', bn: 'E2E ছবির বিভাগ' },
    ]
    for (const p of patches) {
      const r = await request.patch(`${API_URL}/api/admin/content/gallery/pageContent/${p.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: p.en, valueBn: p.bn },
      })
      expect(r.ok()).toBeTruthy()
    }

    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const gc = content.gallery.pageContent
    expect(gc.filterChipAll.en).toBe('E2E All')
    expect(gc.filterChipEducation.bn).toBe('E2E শিক্ষা')
    expect(gc.filterAriaLabel.en).toBe('E2E Gallery categories')
  })

  test('12 - Gallery CRUD (media upload)', async ({ request }) => {
    if (!TEST_IMAGE_PATH) {
      test.skip(true, 'No TEST_IMAGE_PATH — skipping gallery upload/delete')
      return
    }

    // Upload
    const fs = require('fs')
    const uploadRes = await request.post(`${API_URL}/api/admin/gallery`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        files: { name: 'e2e-test.png', mimeType: 'image/png', buffer: await fs.promises.readFile(TEST_IMAGE_PATH) },
        category: 'e2e-test',
        altEn: 'E2E Gallery item',
        altBn: 'E2E গ্যালারি আইটেম',
      },
    })
    expect(uploadRes.ok()).toBeTruthy()
    const body = await uploadRes.json()
    expect(body.uploaded && body.uploaded.length > 0).toBeTruthy()
    createdGalleryId = body.uploaded[0].id

    // Verify in public API
    const content = await (await request.get(`${API_URL}/api/content`)).json()
    expect(content.gallery.items.find(i => i.id === createdGalleryId)).toBeTruthy()

    // Update
    const updateRes = await request.patch(`${API_URL}/api/admin/gallery/${createdGalleryId}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { altEn: 'E2E Updated Gallery', category: 'e2e-test' },
    })
    expect(updateRes.ok()).toBeTruthy()

    // Delete
    const delRes = await request.delete(`${API_URL}/api/admin/gallery/${createdGalleryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
    createdGalleryId = null
  })

  test('13 - Get Involved Editor: PATCH all pageContent labels', async ({ request }) => {
    const labels = [
      { key: 'eyebrow', en: 'E2E GI Eyebrow', bn: 'E2E GI আইব্রো' },
      { key: 'donationLabel', en: 'E2E Donation', bn: 'E2E দান' },
      { key: 'donationHeading', en: 'E2E Donation Heading', bn: 'E2E দান শিরোনাম' },
      { key: 'paymentLabel', en: 'E2E Payment', bn: 'E2E পেমেন্ট' },
      { key: 'paymentHeading', en: 'E2E Payment Heading', bn: 'E2E পেমেন্ট শিরোনাম' },
      { key: 'volunteerLabel', en: 'E2E Volunteer', bn: 'E2E স্বেচ্ছাসেবক' },
      { key: 'volunteerHeading', en: 'E2E Vol Heading', bn: 'E2E স্বেচ্ছাসেবক শিরোনাম' },
      { key: 'volunteerFormLabel', en: 'E2E Vol Form', bn: 'E2E স্বেচ্ছাসেবক ফর্ম' },
      { key: 'volunteerFormHeading', en: 'E2E Vol Form Heading', bn: 'E2E স্বেচ্ছাসেবক ফর্ম শিরোনাম' },
      { key: 'partnerLabel', en: 'E2E Partner', bn: 'E2E অংশীদার' },
      { key: 'partnerHeading', en: 'E2E Partner Heading', bn: 'E2E অংশীদার শিরোনাম' },
      { key: 'partnerSubtitle', en: 'E2E Partner Sub', bn: 'E2E অংশীদার সাব' },
      { key: 'partnerFormLabel', en: 'E2E Partner Form', bn: 'E2E অংশীদার ফর্ম' },
      { key: 'partnerFormHeading', en: 'E2E Partner Form Heading', bn: 'E2E অংশীদার ফর্ম শিরোনাম' },
      { key: 'bankLabel', en: 'E2E Bank', bn: 'E2E ব্যাংক' },
      { key: 'chequeModalTitle', en: 'E2E Cheque Modal', bn: 'E2E চেক মডেল' },
      { key: 'chequeButtonLabel', en: 'E2E View Cheque', bn: 'E2E চেক দেখুন' },
    ]
    for (const l of labels) {
      const r = await request.patch(`${API_URL}/api/admin/content/getInvolved/pageContent/${l.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: l.en, valueBn: l.bn },
      })
      expect(r.ok()).toBeTruthy()
    }

    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const pc = content.getInvolved.pageContent
    expect(pc.bankLabel.en).toBe('E2E Bank')
    expect(pc.chequeModalTitle.bn).toBe('E2E চেক মডেল')
    expect(pc.chequeButtonLabel.en).toBe('E2E View Cheque')
    expect(pc.volunteerLabel.en).toBe('E2E Volunteer')
    expect(pc.partnerFormHeading.bn).toBe('E2E অংশীদার ফর্ম শিরোনাম')
  })

  test('14 - Get Involved: Bank details, UPI, hero patches', async ({ request }) => {
    const bankPatches = [
      { key: 'accountName', en: 'E2E Account Name', bn: 'E2E অ্যাকাউন্ট নাম' },
      { key: 'bankName', en: 'E2E Bank Name', bn: 'E2E ব্যাংক নাম' },
      { key: 'accountNumber', en: 'E2E-123456', bn: '' },
      { key: 'ifsc', en: 'E2E0001234', bn: '' },
      { key: 'intentUrl', en: 'upi://pay?pa=e2e@upi&pn=E2E', bn: '' },
    ]
    for (const p of bankPatches) {
      const r = await request.patch(`${API_URL}/api/admin/content/getInvolved/bank/${p.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: p.en, valueBn: p.bn || '' },
      })
      expect(r.ok()).toBeTruthy()
    }

    const heroPatches = [
      { key: 'title', en: 'E2E GI Title', bn: 'E2E GI শিরোনাম' },
      { key: 'paragraph', en: 'E2E GI intro', bn: 'E2E GI ভূমিকা' },
    ]
    for (const p of heroPatches) {
      const r = await request.patch(`${API_URL}/api/admin/content/getInvolved/intro/${p.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: p.en, valueBn: p.bn },
      })
      expect(r.ok()).toBeTruthy()
    }

    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const gi = content.getInvolved
    expect(gi.hero.pageTitle.en).toBe('E2E GI Title')
    expect(gi.bankDetails.accountName.en).toBe('E2E Account Name')
    expect(gi.bankDetails.bankName.bn).toBe('E2E ব্যাংক নাম')
    expect(gi.bankDetails.accountNumber).toBe('E2E-123456')
    expect(gi.bankDetails.ifsc).toBe('E2E0001234')
    expect(gi.upiDeepLink).toBe('upi://pay?pa=e2e@upi&pn=E2E')
  })

  test('15 - Volunteer Roles CRUD', async ({ request }) => {
    // Create
    const createRes = await request.post(`${API_URL}/api/admin/volunteer-roles`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { titleEn: 'E2E Role Title', titleBn: 'E2E ভূমিকা শিরোনাম', descriptionEn: 'E2E Role desc', descriptionBn: 'E2E ভূমিকা বর্ণনা' },
    })
    expect(createRes.ok()).toBeTruthy()
    const created = await createRes.json()
    expect(created.id).toBeTruthy()
    createdIds.role = created.id

    // Verify in public API
    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const found = content.getInvolved.volunteer.roles.find(r => r.id === created.id)
    expect(found).toBeTruthy()
    expect(found.title.en).toBe('E2E Role Title')

    // Update
    const updateRes = await request.patch(`${API_URL}/api/admin/volunteer-roles/${created.id}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { titleEn: 'E2E Role Updated' },
    })
    expect(updateRes.ok()).toBeTruthy()

    const content2 = await (await request.get(`${API_URL}/api/content`)).json()
    expect(content2.getInvolved.volunteer.roles.find(r => r.id === created.id).title.en).toBe('E2E Role Updated')

    // Delete
    const delRes = await request.delete(`${API_URL}/api/admin/volunteer-roles/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
    createdIds.role = null
  })

  test('16 - Donation Tiers CRUD', async ({ request }) => {
    // Create
    const createRes = await request.post(`${API_URL}/api/admin/donation-tiers`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { amount: 9999, labelEn: 'E2E Tier EN', labelBn: 'E2E Tier BN' },
    })
    expect(createRes.ok()).toBeTruthy()
    const created = await createRes.json()
    expect(created.id).toBeTruthy()
    createdIds.tier = created.id

    // Verify in public API
    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const found = content.getInvolved.donationTiers.find(t => t.id === created.id)
    expect(found).toBeTruthy()
    expect(found.amount).toBe(9999)

    // Update
    const updateRes = await request.patch(`${API_URL}/api/admin/donation-tiers/${created.id}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { amount: 8888 },
    })
    expect(updateRes.ok()).toBeTruthy()

    // Delete
    const delRes = await request.delete(`${API_URL}/api/admin/donation-tiers/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
    createdIds.tier = null
  })

  test('17 - Fund Allocation CRUD', async ({ request }) => {
    // Create
    const createRes = await request.post(`${API_URL}/api/admin/fund-allocation`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { categoryEn: 'E2E Category', categoryBn: 'E2E বিভাগ', percentage: 42 },
    })
    expect(createRes.ok()).toBeTruthy()
    const created = await createRes.json()
    expect(created.id).toBeTruthy()
    createdIds.allocation = created.id

    // Verify in public API
    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const found = content.impact.fundAllocation.find(a => a.id === created.id)
    expect(found).toBeTruthy()
    expect(found.percentage).toBe(42)

    // Update
    const updateRes = await request.patch(`${API_URL}/api/admin/fund-allocation/${created.id}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { percentage: 58 },
    })
    expect(updateRes.ok()).toBeTruthy()

    // Delete
    const delRes = await request.delete(`${API_URL}/api/admin/fund-allocation/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
    createdIds.allocation = null
  })

  test('18 - Contact Editor: PATCH pageContent + map embedUrl', async ({ request }) => {
    const patches = [
      { key: 'eyebrow', en: 'E2E Contact Eyebrow', bn: 'E2E যোগাযোগ আইব্রো' },
      { key: 'facebookLabel', en: 'E2E FB Label', bn: 'E2E FB লেবেল' },
      { key: 'facebookHeading', en: 'E2E FB Heading', bn: 'E2E FB শিরোনাম' },
      { key: 'visitFacebookLabel', en: 'E2E Visit FB', bn: 'E2E ফেসবুক দেখুন' },
      { key: 'mapTitle', en: 'E2E Map title', bn: 'E2E ম্যাপ শিরোনাম' },
    ]
    for (const p of patches) {
      const r = await request.patch(`${API_URL}/api/admin/content/contact/pageContent/${p.key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { valueEn: p.en, valueBn: p.bn },
      })
      expect(r.ok()).toBeTruthy()
    }

    // Map embed URL
    const mapRes = await request.patch(`${API_URL}/api/admin/content/contact/map/embedUrl`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { valueEn: 'https://maps.google.com/e2e-test' },
    })
    expect(mapRes.ok()).toBeTruthy()

    const content = await (await request.get(`${API_URL}/api/content`)).json()
    expect(content.contact.pageContent.eyebrow.en).toBe('E2E Contact Eyebrow')
    expect(content.contact.visitFacebookLabel.en).toBe('E2E Visit FB')
    expect(content.contact.mapTitle.bn).toBe('E2E ম্যাপ শিরোনাম')
    expect(content.contact.mapEmbedUrl).toBe('https://maps.google.com/e2e-test')
  })

  test('19 - Thank You and NotFound pageContent PATCH', async ({ request }) => {
    for (const page of ['thank-you', 'not-found']) {
      const patches = [
        { key: 'eyebrow', en: `E2E ${page} Eyebrow`, bn: `E2E ${page} আইব্রো` },
        { key: 'heading', en: `E2E ${page} Heading`, bn: `E2E ${page} শিরোনাম` },
        { key: 'body', en: `E2E ${page} body`, bn: `E2E ${page} বডি` },
        { key: 'buttonLabel', en: `E2E ${page} Button`, bn: `E2E ${page} বাটন` },
      ]
      for (const p of patches) {
        const r = await request.patch(`${API_URL}/api/admin/content/${page}/pageContent/${p.key}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          data: { valueEn: p.en, valueBn: p.bn },
        })
        expect(r.ok()).toBeTruthy()
      }
    }

    const content = await (await request.get(`${API_URL}/api/content`)).json()
    expect(content.thankYou.pageContent.eyebrow.en).toBe('E2E thank-you Eyebrow')
    expect(content.notFound.pageContent.heading.bn).toBe('E2E not-found শিরোনাম')
  })

  test('20 - Form Submissions inbox endpoints', async ({ request }) => {
    // Stats
    const statsRes = await request.get(`${API_URL}/api/admin/forms/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(statsRes.ok()).toBeTruthy()
    const stats = await statsRes.json()
    expect(typeof stats.contact).toBe('number')
    expect(typeof stats.volunteer).toBe('number')
    expect(typeof stats.partner).toBe('number')
    expect(typeof stats.total).toBe('number')

    // List all submissions
    const listRes = await request.get(`${API_URL}/api/admin/forms/submissions?type=all&page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(listRes.ok()).toBeTruthy()
    const list = await listRes.json()
    expect(Array.isArray(list.submissions)).toBe(true)
    expect(typeof list.total).toBe('number')
    expect(typeof list.page).toBe('number')
  })

  test('21 - Change Password validation', async ({ request }) => {
    // Test wrong current password
    const wrongRes = await request.post(`${API_URL}/api/admin/users/change-password`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { currentPassword: 'wrong-password', newPassword: 'NewPass123!' },
    })
    expect(wrongRes.ok()).toBeFalsy()
    const wrongBody = await wrongRes.json()
    expect(wrongBody.error).toBeTruthy()

    // Test short new password
    const shortRes = await request.post(`${API_URL}/api/admin/users/change-password`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { currentPassword: ADMIN_PASSWORD, newPassword: 'short' },
    })
    expect(shortRes.ok()).toBeFalsy()
  })

  test('22 - Programs CRUD', async ({ request }) => {
    if (!TEST_IMAGE_PATH) {
      test.skip(true, 'No TEST_IMAGE_PATH — skipping program CRUD')
      return
    }
    const fs = require('fs')

    // Create program with image
    const createRes = await request.post(`${API_URL}/api/admin/programs`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        slug: 'e2e-program',
        titleEn: 'E2E Program Title',
        titleBn: 'E2E প্রোগ্রাম শিরোনাম',
        categoryEn: 'E2E Category',
        categoryBn: 'E2E বিভাগ',
        descriptionEn: 'E2E Program description',
        descriptionBn: 'E2E প্রোগ্রাম বর্ণনা',
        highlightEn: 'E2E Highlight',
        image: { name: 'e2e.png', mimeType: 'image/png', buffer: await fs.promises.readFile(TEST_IMAGE_PATH) },
      },
    })
    expect(createRes.ok()).toBeTruthy()
    const created = await createRes.json()
    expect(created.id).toBeTruthy()
    createdIds.program = created.id

    // Verify in public API
    const content = await (await request.get(`${API_URL}/api/content`)).json()
    const found = [...(content.home.featuredPrograms || []), ...(content.ourWork.featuredPrograms || [])]
      .find(p => p.id === created.id)
    expect(found).toBeTruthy()

    // Delete
    const delRes = await request.delete(`${API_URL}/api/admin/programs/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(delRes.ok()).toBeTruthy()
    createdIds.program = null
  })

  // Cleanup: restore original values
  test.afterAll(async ({ request }) => {
    // Restore settings to original
    const originalSettings = {
      org_name: { en: 'Heritage of Hope Foundation' },
      donate_button_label: { en: 'Donate Now', bn: 'সহযোগিতার হাত বাড়িয়ে দিন' },
      facebook_label: { en: 'Follow us on Facebook', bn: 'ফেসবুকে আমাদের সঙ্গে থাকুন' },
      phone: { en: '+91 98765 43210' },
      email: { en: 'heritageofhopefoundation@gmail.com' },
      facebook_url: { en: 'https://www.facebook.com/profile.php?id=61559891799273' },
      contact_phone_label: { en: 'Phone', bn: 'ফোন' },
      contact_email_label: { en: 'Email', bn: 'ইমেল' },
      contact_address_label: { en: 'Address', bn: 'ঠিকানা' },
    }
    for (const [key, val] of Object.entries(originalSettings)) {
      await request.patch(`${API_URL}/api/admin/content/settings/${key}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: val,
      })
    }
  })
})
