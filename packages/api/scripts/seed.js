import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.adminUser.deleteMany()
    await prisma.activityPost.deleteMany()
    await prisma.volunteerRole.deleteMany()
    await prisma.fundAllocation.deleteMany()
    await prisma.donationTier.deleteMany()
    await prisma.partner.deleteMany()
    await prisma.coreValue.deleteMany()
    await prisma.teamMember.deleteMany()
    await prisma.document.deleteMany()
    await prisma.galleryItem.deleteMany()
    await prisma.impactStat.deleteMany()
    await prisma.siteContent.deleteMany()
    await prisma.program.deleteMany()

    // ===== IMPACT STATS =====
    console.log('Seeding impact stats...')
    await prisma.impactStat.createMany({
      data: [
        { value: '200', labelEn: 'Children Supported', labelBn: 'সাপোর্টেড শিশু', sortOrder: 0 },
        { value: '15', labelEn: 'Programs Running', labelBn: 'চলমান কর্মসূচি', sortOrder: 1 },
        { value: '3', labelEn: 'Villages Reached', labelBn: 'গ্রামে পৌঁছেছি', sortOrder: 2 },
        { value: '5', labelEn: 'Focus Areas', labelBn: 'ফোকাস এরিয়া', sortOrder: 3 },
      ],
    })

    // ===== SITE CONTENT =====
    console.log('Seeding site content...')
    await prisma.siteContent.createMany({
      data: [
        // Settings
        { page: 'settings', section: 'general', fieldKey: 'phone', valueEn: '+91 98765 43210', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'email', valueEn: 'heritageofhopefoundation@gmail.com', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'address', valueEn: 'Sukantapally, Subhas Gram, West Bengal 700147, India', valueBn: 'সুকান্তপল্লী, সুভাস গ্রাম, পশ্চিমবঙ্গ ৭০০১৪৭, ভারত' },
        { page: 'settings', section: 'general', fieldKey: 'facebook_url', valueEn: 'https://www.facebook.com/profile.php?id=61559891799273', valueBn: null },
        // Home
        { page: 'home', section: 'hero', fieldKey: 'eyebrow', valueEn: 'Lighting lives, one step at a time', valueBn: 'ছোট ছোট কাজ, বড় ভরসা' },
        { page: 'home', section: 'hero', fieldKey: 'headline', valueEn: 'Education, healthcare and dignity for underserved communities.', valueBn: 'প্রান্তিক মানুষের জন্য শিক্ষা, স্বাস্থ্য ও মর্যাদা।' },
      ],
    })

    // ===== PROGRAMS =====
    console.log('Seeding programs...')
    await prisma.program.createMany({
      data: [
        {
          slug: 'kishalaya-pathsala',
          imageUrl: '/assets/pathsala.webp',
          categoryEn: 'Education',
          categoryBn: 'শিক্ষা',
          titleEn: 'Kishalaya Pathsala',
          titleBn: 'কিশলয় পাঠশালা',
          descriptionEn: 'Community learning classes and study support for children in Kankandighi.',
          descriptionBn: 'কঙ্কনদীঘির বাচ্চাদের জন্য পাড়ার পড়াশোনার ক্লাস আর সাহায্য।',
          sortOrder: 0,
        },
        {
          slug: 'health-camps',
          imageUrl: '/assets/health_camp.webp',
          categoryEn: 'Healthcare',
          categoryBn: 'স্বাস্থ্য',
          titleEn: 'Free Health Camps',
          titleBn: 'বিনামূল্যের স্বাস্থ্য শিবির',
          descriptionEn: 'Basic checkups and consultations for families.',
          descriptionBn: 'পরিবারের জন্য বেসিক চেকআপ আর পরামর্শ।',
          sortOrder: 1,
        },
      ],
    })

    // ===== TEAM =====
    console.log('Seeding team members...')
    await prisma.teamMember.createMany({
      data: [
        {
          name: 'Arindam Tripathi',
          roleEn: 'Founder & Director',
          roleBn: 'প্রতিষ্ঠাতা ও পরিচালক',
          photoUrl: 'https://via.placeholder.com/400?text=Arindam',
          sortOrder: 0,
        },
      ],
    })

    // ===== DONATION TIERS =====
    console.log('Seeding donation tiers...')
    await prisma.donationTier.createMany({
      data: [
        { amount: 500, labelEn: 'Supporter', labelBn: 'সমর্থক', sortOrder: 0 },
        { amount: 1000, labelEn: 'Patron', labelBn: 'পৃষ্ঠপোষক', sortOrder: 1 },
      ],
    })

    // ===== FUND ALLOCATION =====
    console.log('Seeding fund allocation...')
    await prisma.fundAllocation.createMany({
      data: [
        { categoryEn: 'Education Programs', categoryBn: 'শিক্ষা কর্মসূচি', percentage: 40, sortOrder: 0 },
        { categoryEn: 'Healthcare', categoryBn: 'স্বাস্থ্য', percentage: 30, sortOrder: 1 },
        { categoryEn: 'Relief & Welfare', categoryBn: 'সহায়তা ও কল্যাণ', percentage: 20, sortOrder: 2 },
        { categoryEn: 'Operations', categoryBn: 'পরিচালনা', percentage: 10, sortOrder: 3 },
      ],
    })

    // ===== VOLUNTEER ROLES =====
    console.log('Seeding volunteer roles...')
    await prisma.volunteerRole.createMany({
      data: [
        { titleEn: 'Class Facilitator', titleBn: 'ক্লাস সহায়ক', sortOrder: 0 },
        { titleEn: 'Community Advocate', titleBn: 'সম্প্রদায় প্রবক্তা', sortOrder: 1 },
      ],
    })

    // ===== ACTIVITY POSTS =====
    console.log('Seeding activity posts...')
    await prisma.activityPost.createMany({
      data: [
        {
          date: new Date('2026-05-15'),
          titleEn: 'New Classes Launch',
          titleBn: 'নতুন ক্লাস শুরু',
          bodyEn: 'Our spring session of Kishalaya Pathsala classes is now running.',
          bodyBn: 'আমাদের বসন্ত কর্মসূচির কিশলয় পাঠশালা ক্লাস এখন চলছে।',
          isPublished: true,
          sortOrder: 0,
        },
      ],
    })

    // ===== GALLERY =====
    console.log('Seeding gallery items...')
    await prisma.galleryItem.createMany({
      data: [
        { url: '/assets/pathsala.webp', publicId: 'gallery-pathsala', category: 'Education', altEn: 'Classes', altBn: 'ক্লাস', sortOrder: 0 },
        { url: '/assets/health_camp.webp', publicId: 'gallery-health', category: 'Healthcare', altEn: 'Health Camp', altBn: 'স্বাস্থ্য শিবির', sortOrder: 1 },
      ],
    })

    // ===== ADMIN USER =====
    console.log('Seeding admin user...')
    const hashedPassword = await bcrypt.hash('Welcome@123', 12)
    await prisma.adminUser.create({
      data: {
        email: 'admin@heritageofhope.org',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    })

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📝 Admin credentials:')
    console.log('   Email: admin@heritageofhope.org')
    console.log('   Password: Welcome@123')
    console.log('\n⚠️  Change this password immediately!\n')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
