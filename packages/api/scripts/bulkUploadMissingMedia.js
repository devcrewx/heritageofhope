import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '../src/lib/prisma.js'
import { uploadToCloudinary, cloudinary } from '../src/lib/cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsDir = path.resolve(__dirname, '../../web/public/assets')
const reportDir = path.resolve(__dirname, '../var')

const mediaJobs = [
  {
    label: 'gallery-pathsala',
    model: 'galleryItem',
    id: 23,
    file: 'pathsala.webp',
    folder: 'heritage-of-hope/gallery',
    publicId: 'gallery-pathsala',
    resourceType: 'image',
    update: (result) => ({ url: result.secure_url, publicId: result.public_id }),
  },
  {
    label: 'gallery-health',
    model: 'galleryItem',
    id: 24,
    file: 'health_camp.webp',
    folder: 'heritage-of-hope/gallery',
    publicId: 'gallery-health',
    resourceType: 'image',
    update: (result) => ({ url: result.secure_url, publicId: result.public_id }),
  },
  {
    label: 'team-arindam-tripathi',
    model: 'teamMember',
    id: 11,
    file: 'team_member.webp',
    folder: 'heritage-of-hope/team',
    publicId: 'arindam-tripathi',
    resourceType: 'image',
    update: (result) => ({ photoUrl: result.secure_url, photoPublicId: result.public_id }),
  },
  {
    label: 'program-kishalaya-pathsala',
    model: 'program',
    id: 13,
    file: 'pathsala.webp',
    folder: 'heritage-of-hope/programs',
    publicId: 'kishalaya-pathsala',
    resourceType: 'image',
    update: (result) => ({ imageUrl: result.secure_url, imagePublicId: result.public_id }),
  },
  {
    label: 'program-health-camps',
    model: 'program',
    id: 14,
    file: 'health_camp.webp',
    folder: 'heritage-of-hope/programs',
    publicId: 'health-camps',
    resourceType: 'image',
    update: (result) => ({ imageUrl: result.secure_url, imagePublicId: result.public_id }),
  },
  {
    label: 'post-new-classes-launch',
    model: 'activityPost',
    id: 9,
    file: 'pathsala.webp',
    folder: 'heritage-of-hope/posts',
    publicId: 'new-classes-launch',
    resourceType: 'image',
    update: (result) => ({ photoUrl: result.secure_url, photoPublicId: result.public_id }),
  },
]

function resolveAsset(file) {
  return path.join(assetsDir, file)
}

async function uploadAndLink(job) {
  const assetPath = resolveAsset(job.file)
  if (!fs.existsSync(assetPath)) {
    return { job: job.label, status: 'skipped', reason: `missing local asset: ${assetPath}` }
  }

  const buffer = fs.readFileSync(assetPath)
  const uploadResult = await uploadToCloudinary(buffer, job.folder, {
    public_id: job.publicId,
    resourceType: job.resourceType,
    overwrite: true,
  })

  const model = prisma[job.model]
  const updated = await model.update({
    where: { id: job.id },
    data: job.update(uploadResult),
  })

  return {
    job: job.label,
    status: 'updated',
    id: job.id,
    model: job.model,
    assetPath,
    cloudinaryPublicId: uploadResult.public_id,
    cloudinaryUrl: uploadResult.secure_url,
    record: updated,
  }
}

async function main() {
  const report = { generatedAt: new Date().toISOString(), results: [] }

  try {
    for (const job of mediaJobs) {
      const result = await uploadAndLink(job)
      report.results.push(result)
      console.log(`[${result.status}] ${job.label}`)
    }

    fs.mkdirSync(reportDir, { recursive: true })
    const outPath = path.join(reportDir, `bulk-upload-${Date.now()}.json`)
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
    console.log('Bulk upload report saved to', outPath)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(async (error) => {
  console.error('Bulk upload failed:', error)
  try {
    await prisma.$disconnect()
  } catch {}
  process.exit(1)
})
