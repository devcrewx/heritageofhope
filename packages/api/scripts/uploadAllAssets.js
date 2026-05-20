import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

import { prisma } from '../src/lib/prisma.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsDir = path.resolve(__dirname, '../../web/public/assets')
const docsDir = path.resolve(__dirname, '../../web/public/docs')
const thumbsDir = path.join(docsDir, 'thumbs')

const FOLDER_MAP = {
  'pathsala.webp': 'heritage-of-hope/heroes',
  'health_camp.webp': 'heritage-of-hope/heroes',
  'blood_donation.webp': 'heritage-of-hope/heroes',
  'winter_prog.webp': 'heritage-of-hope/heroes',
  'monsoon.webp': 'heritage-of-hope/heroes',
  'bornporichoy.webp': 'heritage-of-hope/heroes',
  'profile_pic.webp': 'heritage-of-hope/brand',
  'logo.webp': 'heritage-of-hope/brand',
  'reg_cert.webp': 'heritage-of-hope/registration',
  'foundation.webp': 'heritage-of-hope/about',
  'get_involved_partner.webp': 'heritage-of-hope/partners',
  'gallery_learning.webp': 'heritage-of-hope/gallery',
  'gallery_health.webp': 'heritage-of-hope/gallery',
  'gallery_winter.webp': 'heritage-of-hope/gallery',
  'gallery_reg.webp': 'heritage-of-hope/gallery',
  'gallery_blood.webp': 'heritage-of-hope/gallery',
  'gallery_monsoon.webp': 'heritage-of-hope/gallery',
  'gallery_feast.webp': 'heritage-of-hope/gallery',
  'gallery_study.webp': 'heritage-of-hope/gallery',
  'gallery_mothers.webp': 'heritage-of-hope/gallery',
  'gallery_puja.webp': 'heritage-of-hope/gallery',
  'gallery_checkup.webp': 'heritage-of-hope/gallery',
  'gallery_joy.webp': 'heritage-of-hope/gallery',
  'gallery_celebrate.webp': 'heritage-of-hope/gallery',
  'team_member.webp': 'heritage-of-hope/team',
  'team_member_2.webp': 'heritage-of-hope/team',
  'team_member_3.webp': 'heritage-of-hope/team',
  'showcase_health.webp': 'heritage-of-hope/showcase',
  'showcase_comm.webp': 'heritage-of-hope/showcase',
  'showcase_winter.webp': 'heritage-of-hope/showcase',
  'winter_dist.webp': 'heritage-of-hope/showcase',
  'durga_puja.webp': 'heritage-of-hope/showcase',
  'cover_pic.webp': 'heritage-of-hope/brand',
  'bdc_pic.webp': 'heritage-of-hope/showcase',
}

function resolveAsset(file) {
  const p = path.join(assetsDir, file)
  if (fs.existsSync(p)) return p
  return null
}

function resolveDoc(file) {
  const p = path.join(docsDir, file)
  if (fs.existsSync(p)) return p
  return null
}

function resolveThumb(file) {
  const p = path.join(thumbsDir, file)
  if (fs.existsSync(p)) return p
  return null
}

async function uploadFile(filePath, folder, publicId, resourceType) {
  var rt = resourceType || 'image'
  var buffer = fs.readFileSync(filePath)
  return new Promise(function (resolve, reject) {
    var uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, public_id: publicId, resource_type: rt, overwrite: true },
      function (error, result) {
        if (error) reject(new Error('Cloudinary upload failed for ' + publicId + ': ' + error.message))
        else resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    uploadStream.end(buffer)
  })
}

async function main() {
  console.log('Starting bulk asset upload to Cloudinary...\n')
  var uploadMap = {}
  var errors = []

  // Upload all assets
  var assetFiles = Object.keys(FOLDER_MAP)
  for (var i = 0; i < assetFiles.length; i++) {
    var file = assetFiles[i]
    var folder = FOLDER_MAP[file]
    var filePath = resolveAsset(file)
    if (!filePath) {
      console.warn('  SKIP (not found): assets/' + file)
      continue
    }
    var publicId = path.parse(file).name
    try {
      var result = await uploadFile(filePath, folder, publicId)
      uploadMap['/assets/' + file] = result.url
      console.log('  OK  assets/' + file + ' -> ' + result.url)
    } catch (e) {
      errors.push('assets/' + file + ': ' + e.message)
      console.error('  FAIL assets/' + file + ': ' + e.message)
    }
  }

  // Upload docs
  var allDocFiles = fs.readdirSync(docsDir)
  for (var j = 0; j < allDocFiles.length; j++) {
    var docFile = allDocFiles[j]
    if (docFile.startsWith('.') || docFile === 'thumbs' || docFile === 'source-explanation.md') continue
    var docPath = resolveDoc(docFile)
    if (!docPath) continue
    var ext = path.extname(docFile).toLowerCase()
    var docResourceType = ext === '.pdf' ? 'raw' : 'image'
    var docFolder = 'heritage-of-hope/documents'
    var docPublicId = path.parse(docFile).name
    try {
      var result2 = await uploadFile(docPath, docFolder, docPublicId, docResourceType)
      uploadMap['/docs/' + docFile] = result2.url
      console.log('  OK  docs/' + docFile + ' -> ' + result2.url)
    } catch (e) {
      errors.push('docs/' + docFile + ': ' + e.message)
      console.error('  FAIL docs/' + docFile + ': ' + e.message)
    }
  }

  // Upload doc thumbnails
  if (fs.existsSync(thumbsDir)) {
    var thumbFiles = fs.readdirSync(thumbsDir)
    for (var k = 0; k < thumbFiles.length; k++) {
      var thumbFile = thumbFiles[k]
      if (thumbFile.startsWith('.')) continue
      var thumbPath = resolveThumb(thumbFile)
      if (!thumbPath) continue
      var thumbFolder = 'heritage-of-hope/docs/thumbs'
      var thumbPublicId = path.parse(thumbFile).name
      try {
        var result3 = await uploadFile(thumbPath, thumbFolder, thumbPublicId)
        uploadMap['/docs/thumbs/' + thumbFile] = result3.url
        console.log('  OK  docs/thumbs/' + thumbFile + ' -> ' + result3.url)
      } catch (e) {
        errors.push('docs/thumbs/' + thumbFile + ': ' + e.message)
        console.error('  FAIL docs/thumbs/' + thumbFile + ': ' + e.message)
      }
    }
  }

  console.log('\nUpload complete: ' + Object.keys(uploadMap).length + ' files uploaded, ' + errors.length + ' errors\n')

  // Update SiteContent records
  console.log('Updating SiteContent records...')
  var siteContentRows = await prisma.siteContent.findMany({
    where: {
      OR: [
        { valueEn: { startsWith: '/assets/' } },
        { valueEn: { startsWith: '/docs/' } },
      ]
    }
  })
  var siteContentUpdated = 0
  for (var m = 0; m < siteContentRows.length; m++) {
    var row = siteContentRows[m]
    var cloudUrl = uploadMap[row.valueEn]
    if (cloudUrl) {
      await prisma.siteContent.update({
        where: { id: row.id },
        data: { valueEn: cloudUrl }
      })
      siteContentUpdated++
      console.log('  SiteContent[' + row.page + '/' + row.section + '/' + row.fieldKey + ']: ' + row.valueEn + ' -> ' + cloudUrl)
    } else {
      console.warn('  SKIP SiteContent[' + row.page + '/' + row.section + '/' + row.fieldKey + ']: no upload for ' + row.valueEn)
    }
  }

  // Update gallery items
  console.log('\nUpdating Gallery items...')
  var galleryRows = await prisma.galleryItem.findMany({
    where: { url: { startsWith: '/assets/' } }
  })
  for (var n = 0; n < galleryRows.length; n++) {
    var item = galleryRows[n]
    var cloudUrl2 = uploadMap[item.url]
    if (cloudUrl2) {
      await prisma.galleryItem.update({
        where: { id: item.id },
        data: { url: cloudUrl2 }
      })
      console.log('  Gallery[' + item.id + ']: ' + item.url + ' -> ' + cloudUrl2)
    }
  }

  // Update document records
  console.log('\nUpdating Document records...')
  var docRows = await prisma.document.findMany({
    where: {
      OR: [
        { pdfUrl: { startsWith: '/docs/' } },
        { previewImgUrl: { startsWith: '/docs/' } },
      ]
    }
  })
  for (var p = 0; p < docRows.length; p++) {
    var doc = docRows[p]
    var updateData = {}
    if (doc.pdfUrl && uploadMap[doc.pdfUrl]) {
      updateData.pdfUrl = uploadMap[doc.pdfUrl]
    }
    if (doc.previewImgUrl && uploadMap[doc.previewImgUrl]) {
      updateData.previewImgUrl = uploadMap[doc.previewImgUrl]
    }
    if (Object.keys(updateData).length > 0) {
      await prisma.document.update({ where: { id: doc.id }, data: updateData })
      console.log('  Document[' + doc.id + ' ' + doc.titleEn + ']: updated')
    }
  }

  console.log('\nDone! ' + siteContentUpdated + ' SiteContent, ' + galleryRows.length + ' gallery, ' + docRows.length + ' doc records updated.')
  if (errors.length > 0) {
    console.error('\n' + errors.length + ' upload errors:\n' + errors.join('\n'))
  }

  await prisma.$disconnect()
}

main().catch(function (e) {
  console.error('Fatal:', e)
  prisma.$disconnect().then(function () { process.exit(1) }).catch(function () { process.exit(1) })
})
