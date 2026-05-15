import { prisma } from '../src/lib/prisma.js'

async function seed() {
  const samples = [
    {
      slug: 'community-literacy',
      imageUrl: '/assets/pathsala.webp',
      categoryEn: 'Education',
      categoryBn: 'শিক্ষা',
      titleEn: 'Community Literacy Classes',
      titleBn: 'কমিউনিটি সাক্ষরতা ক্লাস',
      descriptionEn: 'After-school learning and remedial support for children.',
      descriptionBn: 'বিদ্যালয়ের পরে পড়াশোনা ও সহায়তা।',
      highlightEn: 'Foundational learning',
      highlightBn: 'প্রাথমিক শিক্ষা',
    },
    {
      slug: 'free-health-camps',
      imageUrl: '/assets/health_camp.webp',
      categoryEn: 'Healthcare',
      categoryBn: 'স্বাস্থ্য',
      titleEn: 'Free Health Camps',
      titleBn: 'বিনামূল্যের স্বাস্থ্য শিবির',
      descriptionEn: 'Basic checkups, consultations and referrals for families.',
      descriptionBn: 'পারিবারিক বেসিক চেকআপ ও পরামর্শ।',
      highlightEn: 'Community first aid',
      highlightBn: 'প্রাথমিক স্বাস্থ্যসেবা',
    },
    {
      slug: 'winter-support',
      imageUrl: '/assets/winter_prog.webp',
      categoryEn: 'Welfare',
      categoryBn: 'কল্যাণ',
      titleEn: 'Winter Support Program',
      titleBn: 'শীতকালীন সহায়তা',
      descriptionEn: 'Warm clothing and school supplies for children in need.',
      descriptionBn: 'আবশ্যক শিশুদের জন্য উষ্ণ পোশাক ও স্কুল সামগ্রী।',
      highlightEn: 'Seasonal support',
      highlightBn: 'মৌসুমি সহায়তা',
    },
  ]

  for (const p of samples) {
    try {
      const existing = await prisma.program.findUnique({ where: { slug: p.slug } })
      if (existing) {
        await prisma.program.update({ where: { id: existing.id }, data: p })
        console.log('Updated program', p.slug)
      } else {
        await prisma.program.create({ data: p })
        console.log('Created program', p.slug)
      }
    } catch (err) {
      console.error('Seed error for', p.slug, err.message)
    }
  }

  // show count
  const count = await prisma.program.count()
  console.log('Programs count:', count)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
