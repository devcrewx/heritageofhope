#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const API_URL = process.env.API_URL || 'http://localhost:4010'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@heritageofhope.org'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Welcome@123'
const TEST_IMAGE_PATH = process.env.TEST_IMAGE_PATH || ''

let token
let passed = 0
let failed = []
let createdIds = {}
const ts = Date.now()

function ok(condition, msg) {
  if (condition) { passed++; console.log(`  ✓ ${msg}`) }
  else { failed.push(msg); console.log(`  ✗ ${msg}`) }
}

async function api(method, url, body, isMultipart) {
  const headers = { Authorization: `Bearer ${token}` }
  let fetchOpts = { method, headers }
  if (body && !isMultipart) {
    headers['Content-Type'] = 'application/json'
    fetchOpts.body = JSON.stringify(body)
  }
  if (isMultipart) fetchOpts.body = body
  const res = await fetch(`${API_URL}${url}`, fetchOpts)
  let data
  try { data = await res.json() } catch { data = null }
  return { status: res.status, ok: res.ok, data }
}

async function main() {
  console.log('\n=== Heritage of Hope Comprehensive API Test Suite ===\n')

  // 0. Auth
  console.log('00. Login')
  const loginRes = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  ok(loginRes.ok, 'Login success')
  const login = await loginRes.json()
  token = login.token
  ok(!!token, 'Token received')

  // 01. /me and /health
  console.log('\n01. Auth verification')
  const me = await api('GET', '/api/admin/me')
  ok(me.ok && me.data?.user?.email === ADMIN_EMAIL, '/me returns user')
  const health = await api('GET', '/api/admin/health')
  ok(health.ok && health.data?.ok === true, '/health returns ok')

  // 02. Public content shape
  console.log('\n02. Public content endpoint')
  const pub = await api('GET', '/api/content')
  const c = pub.data
  ok(pub.ok, '/api/content returns 200')
  ok(!!c.siteMeta, 'siteMeta exists')
  ok(!!c.home, 'home exists')
  ok(!!c.about, 'about exists')
  ok(!!c.ourWork, 'ourWork exists')
  ok(!!c.impact, 'impact exists')
  ok(!!c.gallery, 'gallery exists')
  ok(!!c.getInvolved, 'getInvolved exists')
  ok(!!c.contact, 'contact exists')
  ok(!!c.thankYou, 'thankYou exists')
  ok(!!c.notFound, 'notFound exists')
  ok(Array.isArray(c.navItems) && c.navItems.length >= 7, 'navItems with 7+ items')

  // 03. Site Settings — all 12 fields
  console.log('\n03. Site Settings PATCH')
  const sf = [
    ['org_name','Heritage of Hope E2E',''],
    ['navbar_subtitle','E2E Subtitle','E2E সাবটাইটেল'],
    ['footer_mission','E2E Footer mission','E2E ফুটার মিশন'],
    ['donate_button_label','E2E Donate','E2E দান করুন'],
    ['facebook_label','E2E Follow FB','E2E ফেসবুক ফলো'],
    ['phone','+91 99999 88888',''],
    ['email','e2e@test.com',''],
    ['address','E2E Address','E2E ঠিকানা'],
    ['facebook_url','https://fb.com/e2e',''],
    ['contact_phone_label','E2E Phone','E2E ফোন'],
    ['contact_email_label','E2E Email','E2E ইমেল'],
    ['contact_address_label','E2E Address Label','E2E ঠিকানা লেবেল'],
  ]
  for (const [k, en, bn] of sf) {
    const body = { valueEn: en }
    if (bn) body.valueBn = bn
    const r = await api('PATCH', `/api/admin/content/settings/${k}`, body)
    ok(r.ok, `Settings ${k} patched`)
  }

  // Verify public API
  const pub2 = await api('GET', '/api/content')
  ok(pub2.data.siteMeta.donateButtonLabel?.en === 'E2E Donate', 'public: donateButtonLabel.en')
  ok(pub2.data.siteMeta.facebookLabel?.bn === 'E2E ফেসবুক ফলো', 'public: facebookLabel.bn')
  ok(pub2.data.siteMeta.phone === '+91 99999 88888', 'public: phone')
  ok(pub2.data.contact.phoneLabel?.en === 'E2E Phone', 'public: contact.phoneLabel')
  ok(pub2.data.contact.emailLabel?.bn === 'E2E ইমেল', 'public: contact.emailLabel')
  ok(pub2.data.contact.addressLabel?.en === 'E2E Address Label', 'public: contact.addressLabel')

  // 04. Home hero fields (11 bilingual fields)
  console.log('\n04. Home Editor — Hero')
  const heroFields = [
    'eyebrow','headline','intro','heroFootnote','figcaption',
    'ctaPrimaryLabel','ctaSecondaryLabel','certCaption',
  ]
  for (const f of heroFields) {
    const r = await api('PATCH', `/api/admin/content/home/hero/${f}`, {valueEn:`E2E Hero ${f} EN`,valueBn:`E2E Hero ${f} BN`})
    ok(r.ok, `hero/${f} patched`)
  }
  const pub3 = await api('GET', '/api/content')
  ok(pub3.data.home.hero.eyebrow.en === 'E2E Hero eyebrow EN', 'hero.eyebrow.en')
  ok(pub3.data.home.hero.ctaPrimaryLabel?.en === 'E2E Hero ctaPrimaryLabel EN', 'hero.ctaPrimaryLabel')
  ok(pub3.data.home.hero.ctaSecondaryLabel?.bn === 'E2E Hero ctaSecondaryLabel BN', 'hero.ctaSecondaryLabel.bn')
  ok(pub3.data.home.hero.certCaption?.en === 'E2E Hero certCaption EN', 'hero.certCaption')

  // 05. Home pageContent + cta
  console.log('\n05. Home Editor — PageContent + CTA')
  const homeContent = [
    ['pageContent','statsLabel','E2E Stats','E2E পরিসংখ্যান'],
    ['pageContent','statsHeading','E2E Stats Heading','E2E পরিসংখ্যান শিরোনাম'],
    ['pageContent','pillarLabel','E2E Pillar','E2E স্তম্ভ'],
    ['pageContent','activityLabel','E2E Activity','E2E কার্যকলাপ'],
    ['pageContent','activityHeading','E2E Activity Heading','E2E কার্যকলাপ শিরোনাম'],
    ['pageContent','donationLabel','E2E Donation Label','E2E দান লেবেল'],
    ['cta','headline','E2E CTA Headline','E2E CTA শিরোনাম'],
    ['cta','body','E2E CTA body','E2E CTA বডি'],
    ['cta','buttonLabel','E2E CTA Button','E2E CTA বাটন'],
  ]
  for (const [sec, k, en, bn] of homeContent) {
    const r = await api('PATCH', `/api/admin/content/home/${sec}/${k}`, {valueEn:en,valueBn:bn})
    ok(r.ok, `home/${sec}/${k} patched`)
  }
  const pub4 = await api('GET', '/api/content')
  ok(pub4.data.home.pageContent.statsLabel?.en === 'E2E Stats', 'home.pageContent.statsLabel.en')
  ok(pub4.data.home.cta.headline?.en === 'E2E CTA Headline', 'home.cta.headline')
  ok(pub4.data.home.cta.buttonLabel?.bn === 'E2E CTA বাটন', 'home.cta.buttonLabel.bn')

  // 06. About Editor
  console.log('\n06. About Editor')
  const aboutPC = [
    'eyebrow','storyLabel','missionLabel','visionLabel','valuesLabel',
    'valuesHeading','regLabel','regHeading','certLabel','partnersLabel',
    'teamLabel','teamHeading','documentsLabel','documentsHeading',
  ]
  for (const f of aboutPC) {
    const r = await api('PATCH', `/api/admin/content/about/pageContent/${f}`, {valueEn:`E2E About ${f} EN`,valueBn:`E2E About ${f} BN`})
    ok(r.ok, `about/pageContent/${f} patched`)
  }
  const aboutSec = [
    ['story','heading','E2E Story Heading','E2E গল্প শিরোনাম'],
    ['story','body','E2E Story body','E2E গল্প বডি'],
    ['mission','statement','E2E Mission','E2E মিশন'],
    ['mission','vision','E2E Vision','E2E দৃষ্টি'],
    ['registration','body','E2E Reg body','E2E রেজি বডি'],
  ]
  for (const [sec, k, en, bn] of aboutSec) {
    const r = await api('PATCH', `/api/admin/content/about/${sec}/${k}`, {valueEn:en,valueBn:bn})
    ok(r.ok, `about/${sec}/${k} patched`)
  }
  // Values slots
  for (let i=1; i<=2; i++) {
    await api('PATCH', `/api/admin/content/about/values/value${i}_title`, {valueEn:`E2E Value ${i}`,valueBn:`E2E মান ${i}`})
    await api('PATCH', `/api/admin/content/about/values/value${i}_description`, {valueEn:`E2E Value ${i} Desc`,valueBn:`E2E মান ${i} Desc`})
  }
  const pub5 = await api('GET', '/api/content')
  ok(pub5.data.about.pageContent.storyLabel?.en === 'E2E About storyLabel EN', 'about.pageContent.storyLabel')
  ok(pub5.data.about.story.heading?.en === 'E2E Story Heading', 'about.story.heading')
  ok(pub5.data.about.mission?.en === 'E2E Mission', 'about.mission')
  ok(pub5.data.about.values?.length >= 2, 'about.values has 2+ items')
  ok(pub5.data.about.values[0]?.title?.en === 'E2E Value 1', 'about.values[0].title')

  // 07. Our Work Editor
  console.log('\n07. Our Work Editor')
  const owPatches = [
    ['our-work/intro/title','E2E OW Title','E2E OW শিরোনাম'],
    ['our-work/intro/paragraph','E2E OW Intro','E2E OW ভূমিকা'],
    ['our-work/pageContent/eyebrow','E2E OW Eyebrow','E2E OW আইব্রো'],
    ['our-work/pageContent/approachLabel','E2E Approach Label','E2E পদ্ধতি লেবেল'],
    ['our-work/pageContent/focusLabel','E2E Focus Label','E2E ফোকাস লেবেল'],
    ['our-work/pageContent/joinLabel','E2E Join Label','E2E যোগ দিন লেবেল'],
    ['our-work/approach/heading','E2E Approach','E2E পদ্ধতি'],
    ['our-work/join/body','E2E Join body','E2E যোগ দিন বডি'],
    ['our-work/join/button','E2E Join Button','E2E যোগ দিন বাটন'],
  ]
  for (const [p, en, bn] of owPatches) {
    const r = await api('PATCH', `/api/admin/content/${p}`, {valueEn:en,valueBn:bn})
    ok(r.ok, `${p} patched`)
  }
  // Focus tags
  for (let i=1; i<=3; i++) {
    await api('PATCH', `/api/admin/content/our-work/focus/tag${i}`, {valueEn:`E2E Tag ${i}`,valueBn:`E2E ট্যাগ ${i}`})
  }
  const pub6 = await api('GET', '/api/content')
  ok(pub6.data.ourWork.hero.pageTitle?.en === 'E2E OW Title', 'ourWork.hero.pageTitle')
  ok(pub6.data.ourWork.pageContent.focusLabel?.en === 'E2E Focus Label', 'ourWork.pageContent.focusLabel')
  ok(pub6.data.ourWork.pageContent.approachLabel?.en === 'E2E Approach Label', 'ourWork.pageContent.approachLabel')
  ok(pub6.data.ourWork.focusTags?.length === 3, 'ourWork.focusTags has 3 items')

  // 08. Impact Editor
  console.log('\n08. Impact Editor')
  const imPatches = [
    ['impact/intro/title','E2E Impact Title','E2E ফলাফল শিরোনাম'],
    ['impact/intro/paragraph','E2E Impact Intro','E2E ফলাফল ভূমিকা'],
    ['impact/hero/promise','E2E Promise','E2E প্রতিশ্রুতি'],
    ['impact/pageContent/eyebrow','E2E Impact Eyebrow','E2E ফলাফল আইব্রো'],
    ['impact/pageContent/promiseLabel','E2E Promise Label','E2E প্রতিশ্রুতি লেবেল'],
    ['impact/pageContent/fundLabel','E2E Fund','E2E তহবিল'],
    ['impact/pageContent/fundHeading','E2E Fund Heading','E2E তহবিল শিরোনাম'],
    ['impact/pageContent/feedbackLabel','E2E Feedback','E2E মতামত'],
    ['impact/pageContent/reportLabel','E2E Report','E2E রিপোর্ট'],
    ['impact/feedback/quote','E2E Quote','E2E উক্তি'],
    ['impact/report/status','E2E Status','E2E স্ট্যাটাস'],
  ]
  for (const [p, en, bn] of imPatches) {
    const r = await api('PATCH', `/api/admin/content/${p}`, {valueEn:en,valueBn:bn})
    ok(r.ok, `${p} patched`)
  }
  const pub7 = await api('GET', '/api/content')
  ok(pub7.data.impact.hero.pageTitle?.en === 'E2E Impact Title', 'impact.hero.pageTitle')
  ok(pub7.data.impact.hero.promise?.en === 'E2E Promise', 'impact.hero.promise')
  ok(pub7.data.impact.testimonial.quote?.en === 'E2E Quote', 'impact.testimonial.quote')
  ok(pub7.data.impact.annualReport.body?.en === 'E2E Status', 'impact.annualReport.body')

  // 09. Impact Stats CRUD
  console.log('\n09. Impact Stats CRUD')
  let statId
  // Create
  const statCreate = await api('POST', '/api/admin/stats', {value:`999${ts}`,labelEn:'E2E Stat EN',labelBn:'E2E Stat BN'})
  ok(statCreate.ok && statCreate.data?.data?.id, 'stat created')
  statId = statCreate.data?.data?.id

  // Verify in public
  const pub8 = await api('GET', '/api/content')
  ok(statId && pub8.data?.impact?.impactMetrics?.find(m => m.id === statId), 'stat in public API')
  // Update
  const statUpdate = await api('PATCH', `/api/admin/stats/${statId}`, {value:`888${ts}`,labelEn:'E2E Stat Updated'})
  ok(statUpdate.ok, 'stat updated')
  const pub8b = await api('GET', '/api/content')
  ok(pub8b.data?.impact?.impactMetrics?.find(m => m.id === statId && m.value === `888${ts}+`), 'updated stat in public API')
  ok(!pub8b.data?.impact?.impactMetrics?.find(m => m.value === `999${ts}+`), 'old stat value gone')
  // Delete
  const statDel = await api('DELETE', `/api/admin/stats/${statId}`)
  ok(statDel.ok, 'stat deleted')
  const pub8c = await api('GET', '/api/content')
  ok(!pub8c.data?.impact?.impactMetrics?.find(m => m.id === statId), 'deleted stat gone from public API')

  // 10. Gallery pageContent PATCH
  console.log('\n10. Gallery pageContent')
  const galFields = [
    'eyebrow','heading','intro','filterLabel','filterText',
    'filterChipAll','filterChipEducation','filterChipHealthcare','filterChipWelfare','filterAriaLabel',
  ]
  for (const f of galFields) {
    const r = await api('PATCH', `/api/admin/content/gallery/pageContent/${f}`, {valueEn:`E2E Gal ${f} EN`,valueBn:`E2E Gal ${f} BN`})
    ok(r.ok, `gallery/pageContent/${f} patched`)
  }
  const pub9 = await api('GET', '/api/content')
  ok(pub9.data.gallery.pageContent.filterChipAll?.en === 'E2E Gal filterChipAll EN', 'gallery.filterChipAll.en')
  ok(pub9.data.gallery.pageContent.filterAriaLabel?.bn === 'E2E Gal filterAriaLabel BN', 'gallery.filterAriaLabel.bn')

  // 11. Get Involved Editor
  console.log('\n11. Get Involved Editor')
  const giLabels = [
    'eyebrow','donationLabel','donationHeading','paymentLabel','paymentHeading',
    'volunteerLabel','volunteerHeading','volunteerFormLabel','volunteerFormHeading',
    'partnerLabel','partnerHeading','partnerSubtitle','partnerFormLabel','partnerFormHeading',
    'bankLabel','chequeModalTitle','chequeButtonLabel',
  ]
  for (const f of giLabels) {
    const r = await api('PATCH', `/api/admin/content/getInvolved/pageContent/${f}`, {valueEn:`E2E GI ${f} EN`,valueBn:`E2E GI ${f} BN`})
    ok(r.ok, `getInvolved/pageContent/${f} patched`)
  }
  // Bank details
  const bankFields = [['accountName','E2E Account','E2E অ্যাকাউন্ট'],['bankName','E2E Bank','E2E ব্যাংক'],['accountNumber','E2E-123456',''],['ifsc','E2E0001234','']]
  for (const [k, en, bn] of bankFields) {
    await api('PATCH', `/api/admin/content/getInvolved/bank/${k}`, {valueEn:en,valueBn:bn||''})
  }
  // Hero
  await api('PATCH', '/api/admin/content/getInvolved/intro/title', {valueEn:'E2E GI Title',valueBn:'E2E GI শিরোনাম'})
  await api('PATCH', '/api/admin/content/getInvolved/intro/paragraph', {valueEn:'E2E GI Intro',valueBn:'E2E GI ভূমিকা'})
  // UPI intent
  await api('PATCH', '/api/admin/content/getInvolved/bank/intentUrl', {valueEn:'upi://pay?pa=e2e@upi&pn=E2E'})

  const pub10 = await api('GET', '/api/content')
  ok(pub10.data.getInvolved.pageContent.bankLabel?.en === 'E2E GI bankLabel EN', 'gi.pageContent.bankLabel')
  ok(pub10.data.getInvolved.pageContent.chequeModalTitle?.bn === 'E2E GI chequeModalTitle BN', 'gi.pageContent.chequeModalTitle.bn')
  ok(pub10.data.getInvolved.bankDetails.accountName?.en === 'E2E Account', 'gi.bankDetails.accountName')
  ok(pub10.data.getInvolved.bankDetails.bankName?.bn === 'E2E ব্যাংক', 'gi.bankDetails.bankName.bn')
  ok(pub10.data.getInvolved.bankDetails.accountNumber === 'E2E-123456', 'gi.bankDetails.accountNumber')
  ok(pub10.data.getInvolved.hero.pageTitle?.en === 'E2E GI Title', 'gi.hero.pageTitle')

  // 12. Volunteer Roles CRUD
  console.log('\n12. Volunteer Roles CRUD')
  const roleCreate = await api('POST', '/api/admin/volunteer-roles', {titleEn:`E2E Role ${ts}`,titleBn:'E2E ভূমিকা',descriptionEn:'E2E Desc',descriptionBn:'E2E বর্ণনা'})
  ok(roleCreate.ok && roleCreate.data?.data?.id, 'volunteer role created')
  const roleId = roleCreate.data?.data?.id
  const pub11 = await api('GET', '/api/content')
  ok(roleId && pub11.data?.getInvolved?.volunteer?.roles?.find(r => r.id === roleId), 'role in public API')
  // Update
  if (roleId) {
    const roleUpd = await api('PATCH', `/api/admin/volunteer-roles/${roleId}`, {titleEn:'E2E Role Updated'})
    ok(roleUpd.ok, 'volunteer role updated')
    const pub11b = await api('GET', '/api/content')
    ok(pub11b.data?.getInvolved?.volunteer?.roles?.find(r => r.id === roleId)?.title?.en === 'E2E Role Updated', 'updated role in public API')
    // Delete
    const roleDel = await api('DELETE', `/api/admin/volunteer-roles/${roleId}`)
    ok(roleDel.ok, 'volunteer role deleted')
  } else {
    ok(false, 'volunteer role updated (skipped - no id)')
    ok(false, 'updated role in public API (skipped)')
    ok(false, 'volunteer role deleted (skipped)')
  }

  // 13. Donation Tiers CRUD
  console.log('\n13. Donation Tiers CRUD')
  const tierCreate = await api('POST', '/api/admin/donation-tiers', {amount:parseInt(ts.toString().slice(-6)),labelEn:'E2E Tier EN',labelBn:'E2E Tier BN'})
  ok(tierCreate.ok && tierCreate.data?.data?.id, 'donation tier created')
  const tierId = tierCreate.data?.data?.id
  const pub12 = await api('GET', '/api/content')
  ok(tierId && pub12.data?.getInvolved?.donationTiers?.find(t => t.id === tierId), 'tier in public API')
  if (tierId) {
    const tierUpd = await api('PATCH', `/api/admin/donation-tiers/${tierId}`, {amount:8888})
    ok(tierUpd.ok, 'tier updated')
    const tierDel = await api('DELETE', `/api/admin/donation-tiers/${tierId}`)
    ok(tierDel.ok, 'tier deleted')
  } else {
    ok(false, 'tier updated (skipped)')
    ok(false, 'tier deleted (skipped)')
  }

  // 14. Fund Allocation CRUD
  console.log('\n14. Fund Allocation CRUD')
  const allocCreate = await api('POST', '/api/admin/fund-allocation', {categoryEn:`E2E Cat ${ts}`,categoryBn:'E2E বিভাগ',percentage:42})
  ok(allocCreate.ok && allocCreate.data?.data?.id, 'fund allocation created')
  const allocId = allocCreate.data?.data?.id
  const pub13 = await api('GET', '/api/content')
  ok(allocId && pub13.data?.impact?.fundAllocation?.find(a => a.id === allocId), 'allocation in public API')
  if (allocId) {
    const allocUpd = await api('PATCH', `/api/admin/fund-allocation/${allocId}`, {percentage:58})
    ok(allocUpd.ok, 'allocation updated')
    const allocDel = await api('DELETE', `/api/admin/fund-allocation/${allocId}`)
    ok(allocDel.ok, 'allocation deleted')
  } else {
    ok(false, 'allocation updated (skipped)')
    ok(false, 'allocation deleted (skipped)')
  }

  // 15. Contact Editor pageContent
  console.log('\n15. Contact Editor')
  const contactPC = [
    ['eyebrow','E2E Contact Eyebrow','E2E যোগাযোগ আইব্রো'],
    ['facebookLabel','E2E FB Label','E2E FB লেবেল'],
    ['facebookHeading','E2E FB Heading','E2E FB শিরোনাম'],
    ['visitFacebookLabel','E2E Visit FB','E2E ফেসবুক দেখুন'],
    ['mapTitle','E2E Map title','E2E ম্যাপ শিরোনাম'],
  ]
  for (const [k, en, bn] of contactPC) {
    const r = await api('PATCH', `/api/admin/content/contact/pageContent/${k}`, {valueEn:en,valueBn:bn})
    ok(r.ok, `contact/pageContent/${k} patched`)
  }
  await api('PATCH', '/api/admin/content/contact/map/embedUrl', {valueEn:'https://maps.google.com/e2e'})
  const pub14 = await api('GET', '/api/content')
  ok(pub14.data.contact.pageContent.eyebrow?.en === 'E2E Contact Eyebrow', 'contact.pageContent.eyebrow')
  ok(pub14.data.contact.visitFacebookLabel?.en === 'E2E Visit FB', 'contact.visitFacebookLabel')
  ok(pub14.data.contact.mapTitle?.bn === 'E2E ম্যাপ শিরোনাম', 'contact.mapTitle.bn')
  ok(pub14.data.contact.mapEmbedUrl === 'https://maps.google.com/e2e', 'contact.mapEmbedUrl')

  // 16. Thank You + Not Found pageContent
  console.log('\n16. Thank You & Not Found')
  for (const page of ['thankYou','notFound']) {
    for (const f of ['eyebrow','heading','body','buttonLabel']) {
      const r = await api('PATCH', `/api/admin/content/${page}/pageContent/${f}`, {valueEn:`E2E ${page} ${f} EN`,valueBn:`E2E ${page} ${f} BN`})
      ok(r.ok, `${page}/pageContent/${f} patched`)
    }
  }
  const pub15 = await api('GET', '/api/content')
  ok(pub15.data.thankYou.pageContent.eyebrow?.en === 'E2E thankYou eyebrow EN', 'thankYou.pageContent.eyebrow')
  ok(pub15.data.notFound.pageContent.heading?.bn === 'E2E notFound heading BN', 'notFound.pageContent.heading.bn')

  // 17. Form Submissions inbox
  console.log('\n17. Form Submissions')
  const formStats = await api('GET', '/api/admin/forms/stats')
  ok(formStats.ok, 'forms/stats ok')
  ok(typeof formStats.data?.contact === 'number', 'formStats.contact is number')
  ok(typeof formStats.data?.total === 'number', 'formStats.total is number')
  const formList = await api('GET', '/api/admin/forms/submissions?type=all&page=1&limit=5')
  ok(formList.ok, 'forms/submissions ok')
  ok(Array.isArray(formList.data?.data), 'submissions is array')

  // 18. Change Password validation
  console.log('\n18. Change Password')
  const pwWrong = await api('POST', '/api/admin/users/change-password', {currentPassword:'wrong',newPassword:'NewPass123!'})
  ok(!pwWrong.ok && pwWrong.data?.error, 'change-password rejects wrong current')
  const pwShort = await api('POST', '/api/admin/users/change-password', {currentPassword:ADMIN_PASSWORD,newPassword:'short'})
  ok(!pwShort.ok && pwShort.data?.error, 'change-password rejects short new')

  // 19. Programs CRUD (with image if available)
  console.log('\n19. Programs CRUD')
  if (TEST_IMAGE_PATH) {
    const FormData = (await import('form-data')).default
    const imgBuf = fs.readFileSync(TEST_IMAGE_PATH)
    const fd = new FormData()
    fd.append('slug', 'e2e-program-test')
    fd.append('titleEn', 'E2E Program Title')
    fd.append('titleBn', 'E2E প্রোগ্রাম')
    fd.append('categoryEn', 'E2E Cat')
    fd.append('descriptionEn', 'E2E Program desc')
    fd.append('image', imgBuf, { filename: 'e2e.png', contentType: 'image/png' })
    const progCreate = await fetch(`${API_URL}/api/admin/programs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    ok(progCreate.ok, 'program created with image')
    const progData = await progCreate.json()
    ok(!!progData.id, 'program has id')
    const progId = progData.id

    // Verify in public
    const pub16 = await api('GET', '/api/content')
    const allProgs = [...(pub16.data.home.featuredPrograms||[]), ...(pub16.data.ourWork.featuredPrograms||[])]
    ok(allProgs.find(p => p.id === progId), 'program in public API')

    // Delete
    const progDel = await api('DELETE', `/api/admin/programs/${progId}`)
    ok(progDel.ok, 'program deleted')
  } else {
    console.log('  ~ Skipping (no TEST_IMAGE_PATH)')
  }

  // 20. Gallery CRUD (with image if available)
  console.log('\n20. Gallery CRUD')
  if (TEST_IMAGE_PATH) {
    const FormData = (await import('form-data')).default
    const imgBuf = fs.readFileSync(TEST_IMAGE_PATH)
    const fd = new FormData()
    fd.append('files', imgBuf, { filename: 'e2e-gallery.png', contentType: 'image/png' })
    fd.append('category', 'e2e-test')
    fd.append('altEn', 'E2E Gallery item')
    fd.append('altBn', 'E2E গ্যালারি')
    const galCreate = await fetch(`${API_URL}/api/admin/gallery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    ok(galCreate.ok, 'gallery item uploaded')
    const galData = await galCreate.json()
    ok(galData.uploaded?.length > 0, 'gallery uploaded has items')
    const galId = galData.uploaded[0].id

    // Update
    const galUpd = await api('PATCH', `/api/admin/gallery/${galId}`, {altEn:'E2E Updated Gallery',category:'e2e-test'})
    ok(galUpd.ok, 'gallery item updated')

    // Delete
    const galDel = await api('DELETE', `/api/admin/gallery/${galId}`)
    ok(galDel.ok, 'gallery item deleted')
  } else {
    console.log('  ~ Skipping (no TEST_IMAGE_PATH)')
  }

  // 21. Documents CRUD (with image if available)
  console.log('\n21. Documents CRUD')
  if (TEST_IMAGE_PATH) {
    const FormData = (await import('form-data')).default
    const imgBuf = fs.readFileSync(TEST_IMAGE_PATH)
    const fd = new FormData()
    fd.append('pdf', imgBuf, { filename: 'e2e.pdf', contentType: 'application/pdf' })
    fd.append('titleEn', 'E2E Document Title')
    fd.append('titleBn', 'E2E ডকুমেন্ট')
    fd.append('descriptionEn', 'E2E Doc description')
    fd.append('date', '2026-01-15')
    const docCreate = await fetch(`${API_URL}/api/admin/documents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    ok(docCreate.ok, 'document created')
    const docData = await docCreate.json()
    ok(!!docData.id, 'document has id')

    // Update
    const docUpd = await api('PATCH', `/api/admin/documents/${docData.id}`, {titleEn: 'E2E Doc Updated'})
    ok(docUpd.ok, 'document updated')

    // Delete
    const docDel = await api('DELETE', `/api/admin/documents/${docData.id}`)
    ok(docDel.ok, 'document deleted')
  } else {
    console.log('  ~ Skipping (no TEST_IMAGE_PATH)')
  }

  // 22. Team CRUD (with image if available)
  console.log('\n22. Team CRUD')
  if (TEST_IMAGE_PATH) {
    const FormData = (await import('form-data')).default
    const imgBuf = fs.readFileSync(TEST_IMAGE_PATH)
    const fd = new FormData()
    fd.append('name', 'E2E Team Member')
    fd.append('roleEn', 'E2E Role')
    fd.append('roleBn', 'E2E ভূমিকা')
    fd.append('file', imgBuf, { filename: 'e2e-team.png', contentType: 'image/png' })
    const teamCreate = await fetch(`${API_URL}/api/admin/team`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    ok(teamCreate.ok, 'team member created')
    const teamData = await teamCreate.json()
    ok(!!teamData.id, 'team member has id')

    // Update
    const teamUpd = await api('PATCH', `/api/admin/team/${teamData.id}`, {name:'E2E Team Updated'})
    ok(teamUpd.ok, 'team member updated')

    // Delete
    const teamDel = await api('DELETE', `/api/admin/team/${teamData.id}`)
    ok(teamDel.ok, 'team member deleted')
  } else {
    console.log('  ~ Skipping (no TEST_IMAGE_PATH)')
  }

  // 23. Activity Posts CRUD (with image if available)
  console.log('\n23. Activity Posts CRUD')
  if (TEST_IMAGE_PATH) {
    const FormData = (await import('form-data')).default
    const imgBuf = fs.readFileSync(TEST_IMAGE_PATH)
    const fd = new FormData()
    fd.append('date', '2026-05-20')
    fd.append('titleEn', 'E2E Post Title')
    fd.append('titleBn', 'E2E পোস্ট')
    fd.append('bodyEn', 'E2E Post body text')
    fd.append('file', imgBuf, { filename: 'e2e-post.png', contentType: 'image/png' })
    const postCreate = await fetch(`${API_URL}/api/admin/activity-posts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    ok(postCreate.ok, 'activity post created')
    const postData = await postCreate.json()
    ok(!!postData.id, 'activity post has id')

    // Verify in public API
    const pub17 = await api('GET', '/api/content')
    const allPosts = [...(pub17.data.home.facebookPosts||[]), ...(pub17.data.contact.facebookPosts||[])]
    ok(allPosts.find(p => p.id === postData.id), 'post in public API')

    // Delete
    const postDel = await api('DELETE', `/api/admin/activity-posts/${postData.id}`)
    ok(postDel.ok, 'activity post deleted')
  } else {
    console.log('  ~ Skipping (no TEST_IMAGE_PATH)')
  }

  // 24. Partners CRUD (with image if available)
  console.log('\n24. Partners CRUD')
  if (TEST_IMAGE_PATH) {
    const FormData = (await import('form-data')).default
    const imgBuf = fs.readFileSync(TEST_IMAGE_PATH)
    const fd = new FormData()
    fd.append('name', 'E2E Partner')
    fd.append('file', imgBuf, { filename: 'e2e-partner.png', contentType: 'image/png' })
    const partnerCreate = await fetch(`${API_URL}/api/admin/partners`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    ok(partnerCreate.ok, 'partner created')
    const partnerData = await partnerCreate.json()
    ok(!!partnerData.id, 'partner has id')

    // Update
    const partnerUpd = await api('PATCH', `/api/admin/partners/${partnerData.id}`, {name:'E2E Partner Updated'})
    ok(partnerUpd.ok, 'partner updated')

    // Delete
    const partnerDel = await api('DELETE', `/api/admin/partners/${partnerData.id}`)
    ok(partnerDel.ok, 'partner deleted')
  } else {
    console.log('  ~ Skipping (no TEST_IMAGE_PATH)')
  }

  // --- CLEANUP: Restore original settings values ---
  console.log('\n25. Cleanup — restoring original values')
  const restore = {
    org_name: {valueEn:'Heritage of Hope Foundation'},
    navbar_subtitle: {valueEn:'Registered NGO | West Bengal',valueBn:'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ'},
    footer_mission: {valueEn:'Children, women and communities in South 24 Parganas, West Bengal.',valueBn:'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।'},
    donate_button_label: {valueEn:'Donate Now',valueBn:'সহযোগিতার হাত বাড়িয়ে দিন'},
    facebook_label: {valueEn:'Follow us on Facebook',valueBn:'ফেসবুকে আমাদের সঙ্গে থাকুন'},
    phone: {valueEn:'+91 98765 43210'},
    email: {valueEn:'heritageofhopefoundation@gmail.com'},
    facebook_url: {valueEn:'https://www.facebook.com/profile.php?id=61559891799273'},
    contact_phone_label: {valueEn:'Phone',valueBn:'ফোন'},
    contact_email_label: {valueEn:'Email',valueBn:'ইমেল'},
    contact_address_label: {valueEn:'Address',valueBn:'ঠিকানা'},
  }
  let restoreOk = 0
  for (const [k,v] of Object.entries(restore)) {
    const r = await api('PATCH', `/api/admin/content/settings/${k}`, v)
    if (r.ok) restoreOk++
  }
  ok(restoreOk === Object.keys(restore).length, `Restored ${restoreOk}/${Object.keys(restore).length} settings`)

  // --- SUMMARY ---
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Results: ${passed} passed, ${failed.length} failed${failed.length ? `\nFailures:\n  - ${failed.join('\n  - ')}` : ''}`)
  process.exit(failed.length ? 1 : 0)
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
