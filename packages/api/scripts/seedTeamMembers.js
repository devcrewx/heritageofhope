import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '../src/lib/prisma.js'
import { uploadToCloudinary } from '../src/lib/cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsDir = path.resolve(__dirname, '../../web/public/assets')

const members = [
  {
    name: 'Founder Team',
    roleEn: 'Community coordination and field programs',
    roleBn: 'জনসংযোগ ও মানুষের কাছে গিয়ে কাজ',
    file: 'team_member.webp',
    sortOrder: 0,
  },
  {
    name: 'Program Support',
    roleEn: 'Planning, logistics and volunteer support',
    roleBn: 'পরিকল্পনা ও স্বেচ্ছাসেবকদের সামলানো',
    file: 'team_member_2.webp',
    sortOrder: 1,
  },
  {
    name: 'Field Volunteers',
    roleEn: 'Direct service delivery and follow-up',
    roleBn: 'সরাসরি সেবা পৌঁছে দেওয়া ও খোঁজখবর রাখা',
    file: 'team_member_3.webp',
    sortOrder: 2,
  },
]

async function main() {
  console.log('Seeding team members...')

  for (const member of members) {
    const assetPath = path.join(assetsDir, member.file)
    if (!fs.existsSync(assetPath)) {
      console.error(`  ✗ File not found: ${assetPath}`)
      continue
    }

    const buffer = fs.readFileSync(assetPath)
    const publicId = member.file.replace(/\.webp$/, '')

    console.log(`  Uploading ${member.file}...`)
    const result = await uploadToCloudinary(buffer, 'heritage-of-hope/team', {
      public_id: publicId,
      resourceType: 'image',
      overwrite: true,
    })

    console.log(`  Creating "${member.name}"...`)
    await prisma.teamMember.create({
      data: {
        name: member.name,
        roleEn: member.roleEn,
        roleBn: member.roleBn,
        photoUrl: result.secure_url,
        photoPublicId: result.public_id,
        sortOrder: member.sortOrder,
      },
    })
  }

  console.log('Team members seeded successfully!')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
}).finally(() => prisma.$disconnect())
