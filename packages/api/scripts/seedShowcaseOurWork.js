import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '../src/lib/prisma.js'
import { uploadToCloudinary } from '../src/lib/cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsDir = path.resolve(__dirname, '../../web/public/assets')

const images = [
  { file: 'showcase_winter.webp', publicId: 'showcase-winter', labelEn: 'Children receiving winter support', labelBn: 'শিশুদের হাতে শীতের পোশাক' },
  { file: 'showcase_health.webp', publicId: 'showcase-health', labelEn: 'Health camp participation', labelBn: 'স্বাস্থ্য শিবিরে অংশগ্রহণ' },
  { file: 'showcase_comm.webp', publicId: 'showcase-comm', labelEn: 'Community registration and outreach', labelBn: 'মানুষের পাশে, মানুষের সাথে' },
]

async function main() {
  console.log('Uploading showcase images and seeding our-work content...')

  // First delete any existing showcase records for our-work
  await prisma.siteContent.deleteMany({
    where: { page: 'our-work', section: 'showcase' },
  })

  for (let i = 0; i < images.length; i++) {
    const img = images[i]
    const idx = i + 1
    const assetPath = path.join(assetsDir, img.file)

    if (!fs.existsSync(assetPath)) {
      console.error(`  ✗ File not found: ${assetPath}`)
      continue
    }

    const buffer = fs.readFileSync(assetPath)
    console.log(`  Uploading ${img.file}...`)
    const result = await uploadToCloudinary(buffer, 'heritage-of-hope/our-work', {
      public_id: img.publicId,
      resourceType: 'image',
      overwrite: true,
    })

    console.log(`  Seeding img${idx}_url, img${idx}_labelEn, img${idx}_labelBn...`)
    await prisma.siteContent.createMany({
      data: [
        {
          page: 'our-work',
          section: 'showcase',
          fieldKey: `img${idx}_url`,
          valueEn: result.secure_url,
          valueBn: null,
        },
        {
          page: 'our-work',
          section: 'showcase',
          fieldKey: `img${idx}_labelEn`,
          valueEn: img.labelEn,
          valueBn: null,
        },
        {
          page: 'our-work',
          section: 'showcase',
          fieldKey: `img${idx}_labelBn`,
          valueEn: img.labelBn,
          valueBn: null,
        },
      ],
    })
  }

  console.log('Our Work showcase images seeded successfully!')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
}).finally(() => prisma.$disconnect())
