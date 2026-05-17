import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { prisma } from '../src/lib/prisma.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../src/lib/cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsDir = path.resolve(__dirname, '../../web/public/docs')
const thumbsDir = path.resolve(docsDir, 'thumbs')
const outputDir = path.resolve(__dirname, '../var')
const tempDir = path.resolve(outputDir, 'document-temp')

const documents = [
  {
    titleEn: 'Trust Registration Certificate',
    titleBn: 'ট্রাস্ট নিবন্ধন সার্টিফিকেট',
    descriptionEn: 'Official trust registration deed for Heritage of Hope Foundation.',
    descriptionBn: 'হেরিটেজ অফ হোপ ফাউন্ডেশনের অফিসিয়াল ট্রাস্ট নিবন্ধন দলিল।',
    date: '2024-05-18',
    pdfFile: 'trust-registration-certificate.pdf',
    previewFile: path.join('thumbs', 'trust-registration-certificate.png'),
    pdfPublicId: 'trust-registration-certificate',
    previewPublicId: 'trust-registration-certificate-preview',
    sortOrder: 0,
    notes: 'from source-explanation.md item 2',
  },
  {
    titleEn: 'NGO DARPAN (NITI AAYOG)',
    titleBn: 'এনজিও ডার্পান (এনআইটিআই আয়োগ)',
    descriptionEn: 'NGO Darpan portal registration printout for the foundation.',
    descriptionBn: 'ফাউন্ডেশনের NGO Darpan পোর্টাল নিবন্ধনের প্রিন্টআউট।',
    date: '2024-06-21',
    pdfFile: 'ngo-darpan-niti-ayog.pdf',
    previewFile: path.join('thumbs', 'ngo-darpan-niti-ayog.png'),
    pdfPublicId: 'ngo-darpan-niti-ayog',
    previewPublicId: 'ngo-darpan-niti-ayog-preview',
    sortOrder: 1,
    notes: 'from source-explanation.md item 1',
  },
  {
    titleEn: '12A Certificate',
    titleBn: '১২এ সার্টিফিকেট',
    descriptionEn: 'Provisional registration under section 12A of the Income Tax Act.',
    descriptionBn: 'আয়কর আইনের ১২এ ধারার অধীনে প্রাথমিক নিবন্ধন।',
    date: '2025-11-30',
    pdfFile: 'hhp-12a.pdf',
    previewFile: path.join('thumbs', 'hhp-12a.png'),
    pdfPublicId: 'hhp-12a',
    previewPublicId: 'hhp-12a-preview',
    sortOrder: 2,
    notes: 'from source-explanation.md item 3',
  },
  {
    titleEn: '80G Certificate',
    titleBn: '৮০জি সার্টিফিকেট',
    descriptionEn: 'Provisional approval under section 80G of the Income Tax Act.',
    descriptionBn: 'আয়কর আইনের ৮০জি ধারার অধীনে প্রাথমিক অনুমোদন।',
    date: '2025-11-30',
    pdfFile: 'hhp-80g.pdf',
    previewFile: path.join('thumbs', 'hhp-80g.png'),
    pdfPublicId: 'hhp-80g',
    previewPublicId: 'hhp-80g-preview',
    sortOrder: 3,
    notes: 'from source-explanation.md item 4',
  },
  {
    titleEn: 'CSR Registration (CSR-1)',
    titleBn: 'সিএসআর নিবন্ধন (সিএসআর-১)',
    descriptionEn: 'MCA CSR registration confirmation for funded activities.',
    descriptionBn: 'তহবিলভিত্তিক কার্যক্রমের জন্য MCA-এর CSR নিবন্ধন নিশ্চিতকরণ।',
    date: '2025-12-03',
    pdfFile: 'csr-1-hhf.pdf',
    previewFile: path.join('thumbs', 'csr-1-hhf.png'),
    pdfPublicId: 'csr-1-hhf',
    previewPublicId: 'csr-1-hhf-preview',
    sortOrder: 4,
    notes: 'from source-explanation.md item 5',
  },
  {
    titleEn: 'Certificates & Awards',
    titleBn: 'শংসাপত্র ও পুরস্কার',
    descriptionEn: 'Recognition certificate from Thalassemic Guardians Association.',
    descriptionBn: 'থ্যালাসেমিক গার্ডিয়ানস অ্যাসোসিয়েশন থেকে স্বীকৃতি সনদ।',
    date: '2024-07-28',
    pdfFile: 'gratitude-certificate.jpeg',
    previewFile: path.join('thumbs', 'gratitude-certificate.jpeg'),
    pdfPublicId: 'gratitude-certificate',
    previewPublicId: 'gratitude-certificate-preview',
    sortOrder: 5,
    convertToPdf: true,
    notes: 'from source-explanation.md item 2 under awards',
  },
]

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function resolveDoc(fileName) {
  return path.join(docsDir, fileName)
}

function resolvePreview(fileName) {
  return path.join(docsDir, fileName)
}

function convertImageToPdf(imagePath, pdfPath) {
  const script = `
from PIL import Image
from pathlib import Path
image = Image.open(r"${imagePath}").convert("RGB")
Path(r"${path.dirname(pdfPath)}").mkdir(parents=True, exist_ok=True)
image.save(r"${pdfPath}", "PDF", resolution=300.0)
print(r"${pdfPath}")
`
  const result = spawnSync('python3', ['-c', script], { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(`Failed to convert ${imagePath} to PDF: ${result.stderr || result.stdout}`)
  }
  return pdfPath
}

async function uploadDocument(entry) {
  const sourcePath = resolveDoc(entry.pdfFile)
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source document: ${sourcePath}`)
  }

  const uploadPdfPath = entry.convertToPdf
    ? convertImageToPdf(sourcePath, path.join(tempDir, `${entry.pdfPublicId}.pdf`))
    : sourcePath

  const pdfBuffer = fs.readFileSync(uploadPdfPath)
  const pdfUpload = await uploadToCloudinary(pdfBuffer, 'heritage-of-hope/documents', {
    resourceType: 'raw',
    public_id: entry.pdfPublicId,
    overwrite: true,
  })

  let previewUpload = null
  if (entry.previewFile) {
    const previewPath = resolvePreview(entry.previewFile)
    if (!fs.existsSync(previewPath)) {
      throw new Error(`Missing preview asset: ${previewPath}`)
    }
    const previewBuffer = fs.readFileSync(previewPath)
    previewUpload = await uploadToCloudinary(previewBuffer, 'heritage-of-hope/documents/previews', {
      resourceType: 'image',
      public_id: entry.previewPublicId,
      overwrite: true,
      transformation: [{ width: 800, crop: 'limit', quality: 'auto:good' }],
    })
  }

  const existing = await prisma.document.findFirst({ where: { titleEn: entry.titleEn } })
  const data = {
    titleEn: entry.titleEn,
    titleBn: entry.titleBn,
    descriptionEn: entry.descriptionEn,
    descriptionBn: entry.descriptionBn,
    date: new Date(entry.date),
    pdfUrl: pdfUpload.secure_url,
    pdfPublicId: pdfUpload.public_id,
    previewImgUrl: previewUpload?.secure_url || null,
    previewImgPublicId: previewUpload?.public_id || null,
    sortOrder: entry.sortOrder,
  }

  if (existing) {
    if (existing.pdfPublicId && existing.pdfPublicId !== pdfUpload.public_id) {
      try { await deleteFromCloudinary(existing.pdfPublicId) } catch {}
    }
    if (existing.previewImgPublicId && existing.previewImgPublicId !== previewUpload?.public_id) {
      try { await deleteFromCloudinary(existing.previewImgPublicId) } catch {}
    }
    return prisma.document.update({ where: { id: existing.id }, data })
  }

  return prisma.document.create({ data })
}

async function main() {
  ensureDir(outputDir)
  ensureDir(tempDir)

  const report = { generatedAt: new Date().toISOString(), items: [] }

  try {
    for (const entry of documents) {
      const result = await uploadDocument(entry)
      report.items.push({
        titleEn: entry.titleEn,
        pdfPublicId: result.pdfPublicId,
        previewImgPublicId: result.previewImgPublicId,
        pdfUrl: result.pdfUrl,
        previewImgUrl: result.previewImgUrl,
        id: result.id,
      })
      console.log(`[uploaded] ${entry.titleEn}`)
    }

    const reportPath = path.join(outputDir, `documents-bulk-upload-${Date.now()}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log('Document upload report saved to', reportPath)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(async (error) => {
  console.error('Document bulk upload failed:', error)
  try {
    await prisma.$disconnect()
  } catch {}
  process.exit(1)
})
