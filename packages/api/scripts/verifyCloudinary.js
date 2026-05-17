import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { prisma } from '../src/lib/prisma.js'
import { cloudinary } from '../src/lib/cloudinary.js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function checkResource(publicId, opts = {}) {
  try {
    const res = await cloudinary.api.resource(publicId, opts)
    return { exists: true, info: res }
  } catch (err) {
    return { exists: false, error: err.message }
  }
}

async function run() {
  const report = { generatedAt: new Date().toISOString(), checks: [] }

  // Gallery items
  const gallery = await prisma.galleryItem.findMany()
  for (const g of gallery) {
    if (g.publicId) {
      const r = await checkResource(g.publicId, { resource_type: 'image' })
      report.checks.push({ table: 'GalleryItem', id: g.id, field: 'publicId', publicId: g.publicId, ...r })
    } else {
      report.checks.push({ table: 'GalleryItem', id: g.id, field: 'publicId', publicId: null, exists: false, error: 'no publicId in DB' })
    }
  }

  // Team members
  const members = await prisma.teamMember.findMany()
  for (const m of members) {
    if (m.photoPublicId) {
      const r = await checkResource(m.photoPublicId, { resource_type: 'image' })
      report.checks.push({ table: 'TeamMember', id: m.id, field: 'photoPublicId', publicId: m.photoPublicId, ...r })
    } else {
      report.checks.push({ table: 'TeamMember', id: m.id, field: 'photoPublicId', publicId: null, exists: false, error: 'no photoPublicId in DB' })
    }
  }

  // Documents (pdfs and preview images)
  const docs = await prisma.document.findMany()
  for (const d of docs) {
    if (d.pdfPublicId) {
      const r = await checkResource(d.pdfPublicId, { resource_type: 'raw' })
      report.checks.push({ table: 'Document', id: d.id, field: 'pdfPublicId', publicId: d.pdfPublicId, ...r })
    } else {
      report.checks.push({ table: 'Document', id: d.id, field: 'pdfPublicId', publicId: null, exists: false, error: 'no pdfPublicId in DB' })
    }
    if (d.previewImgPublicId) {
      const r2 = await checkResource(d.previewImgPublicId, { resource_type: 'image' })
      report.checks.push({ table: 'Document', id: d.id, field: 'previewImgPublicId', publicId: d.previewImgPublicId, ...r2 })
    } else {
      report.checks.push({ table: 'Document', id: d.id, field: 'previewImgPublicId', publicId: null, exists: false, error: 'no previewImgPublicId in DB' })
    }
  }

  // Partners
  const partners = await prisma.partner.findMany()
  for (const p of partners) {
    if (p.logoPublicId) {
      const r = await checkResource(p.logoPublicId, { resource_type: 'image' })
      report.checks.push({ table: 'Partner', id: p.id, field: 'logoPublicId', publicId: p.logoPublicId, ...r })
    } else {
      report.checks.push({ table: 'Partner', id: p.id, field: 'logoPublicId', publicId: null, exists: false, error: 'no logoPublicId in DB' })
    }
  }

  // Activity posts
  const posts = await prisma.activityPost.findMany()
  for (const post of posts) {
    if (post.photoPublicId) {
      const r = await checkResource(post.photoPublicId, { resource_type: 'image' })
      report.checks.push({ table: 'ActivityPost', id: post.id, field: 'photoPublicId', publicId: post.photoPublicId, ...r })
    } else {
      report.checks.push({ table: 'ActivityPost', id: post.id, field: 'photoPublicId', publicId: null, exists: false, error: 'no photoPublicId in DB' })
    }
  }

  // Programs
  const programs = await prisma.program.findMany()
  for (const prog of programs) {
    if (prog.imagePublicId) {
      const r = await checkResource(prog.imagePublicId, { resource_type: 'image' })
      report.checks.push({ table: 'Program', id: prog.id, field: 'imagePublicId', publicId: prog.imagePublicId, ...r })
    } else {
      report.checks.push({ table: 'Program', id: prog.id, field: 'imagePublicId', publicId: null, exists: false, error: 'no imagePublicId in DB' })
    }
  }

  // SiteContent: treat valueBn as possible public_id when it looks like a Cloudinary id
  const siteContents = await prisma.siteContent.findMany({ where: { valueBn: { not: null } } })
  for (const sc of siteContents) {
    const v = sc.valueBn && sc.valueBn.trim()
    if (!v) {
      report.checks.push({ table: 'SiteContent', id: sc.id, field: 'valueBn', publicId: null, exists: false, error: 'empty valueBn' })
      continue
    }
    // Skip full URLs
    if (/^https?:\/\//i.test(v)) {
      report.checks.push({ table: 'SiteContent', id: sc.id, field: 'valueBn', publicId: v, exists: true, note: 'valueBn appears to be a URL, skipped resource check' })
      continue
    }
    // Heuristic: treat short strings without slashes as public_id
    if (!v.includes('/')) {
      const r = await checkResource(v, { resource_type: 'image' })
      report.checks.push({ table: 'SiteContent', id: sc.id, field: 'valueBn', publicId: v, ...r })
    } else {
      report.checks.push({ table: 'SiteContent', id: sc.id, field: 'valueBn', publicId: v, exists: false, note: 'valueBn contains slash; skipped' })
    }
  }

  const outDir = path.resolve(process.cwd(), 'var')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `cloudinary-verification-${Date.now()}.json`)
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log('Verification complete — report saved to', outPath)
  await prisma.$disconnect()
}

run().catch(async (err) => {
  console.error('Verification script failed:', err)
  try { await prisma.$disconnect() } catch (e) {}
  process.exit(1)
})
