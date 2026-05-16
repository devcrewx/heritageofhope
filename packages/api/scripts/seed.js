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
        { page: 'settings', section: 'general', fieldKey: 'org_name', valueEn: 'Heritage of Hope Foundation', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'navbar_subtitle', valueEn: 'Registered NGO | West Bengal', valueBn: 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ' },
        { page: 'settings', section: 'general', fieldKey: 'registered_badge', valueEn: 'Registered NGO', valueBn: 'নিবন্ধিত সংস্থা' },
        { page: 'settings', section: 'general', fieldKey: 'est_year', valueEn: 'Est. 2024', valueBn: 'প্রতিষ্ঠিত ২০২৪' },
        { page: 'settings', section: 'general', fieldKey: 'footer_mission', valueEn: 'Children, women and communities in South 24 Parganas, West Bengal.', valueBn: 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।' },
        { page: 'settings', section: 'general', fieldKey: 'phone', valueEn: '+91 98765 43210', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'email', valueEn: 'heritageofhopefoundation@gmail.com', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'address', valueEn: 'Sukantapally, Subhas Gram, West Bengal 700147, India', valueBn: 'সুকান্তপল্লী, সুভাস গ্রাম, পশ্চিমবঙ্গ ৭০০১৪৭, ভারত' },
        { page: 'settings', section: 'general', fieldKey: 'facebook_url', valueEn: 'https://www.facebook.com/profile.php?id=61559891799273', valueBn: null },
        // Home
        { page: 'home', section: 'hero', fieldKey: 'eyebrow', valueEn: 'Lighting lives, one step at a time', valueBn: 'ছোট ছোট কাজ, বড় ভরসা' },
        { page: 'home', section: 'hero', fieldKey: 'headline', valueEn: 'Education, healthcare and dignity for underserved communities.', valueBn: 'প্রান্তিক মানুষের জন্য শিক্ষা, স্বাস্থ্য ও মর্যাদা।' },
        { page: 'home', section: 'hero', fieldKey: 'intro', valueEn: 'Heritage of Hope Foundation works across South 24 Parganas through learning spaces, health outreach and seasonal relief.', valueBn: 'হেরিটেজ অফ হোপ ফাউন্ডেশন দক্ষিণ ২৪ পরগণায় শিক্ষাকেন্দ্র, স্বাস্থ্যসেবা ও মৌসুমি সহায়তার মাধ্যমে কাজ করে.' },
        // About
        { page: 'about', section: 'intro', fieldKey: 'title', valueEn: 'Rooted in community. Driven by impact.', valueBn: 'মানুষের মধ্যেই আমাদের শিকড়। কাজের ফলই আমাদের পথ দেখায়।' },
        { page: 'about', section: 'intro', fieldKey: 'paragraph', valueEn: 'We work directly with the people we serve, ensuring every initiative brings lasting, positive change.', valueBn: 'আমরা সরাসরি মানুষের পাশে দাঁড়াই — যাতে প্রতিটি উদ্যোগ সত্যিকারের ও দীর্ঘস্থায়ী পরিবর্তন আনে।' },
        { page: 'about', section: 'story', fieldKey: 'body', valueEn: 'The foundation began from direct work with children and women in underserved areas.', valueBn: 'শিশু আর নারীদের সঙ্গে কাজ করতে করতেই ফাউন্ডেশনের শুরু।' },
        { page: 'about', section: 'mission', fieldKey: 'statement', valueEn: 'To create lasting, positive change in the lives of children, women, and communities in South 24 Parganas.', valueBn: 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের জীবনে স্থায়ী, ইতিবাচক পরিবর্তন আনা।' },
        { page: 'about', section: 'mission', fieldKey: 'vision', valueEn: 'A community where every child has access to quality education, healthcare, and dignity.', valueBn: 'এমন একটি সম্প্রদায় যেখানে প্রতিটি শিশু মানসম্পন্ন শিক্ষা, স্বাস্থ্যসেবা ও মর্যাদা পায়।' },
        { page: 'about', section: 'values', fieldKey: 'value1_title', valueEn: 'Compassion', valueBn: 'সহানুভূতি' },
        { page: 'about', section: 'values', fieldKey: 'value2_title', valueEn: 'Transparency', valueBn: 'স্বচ্ছতা' },
        { page: 'about', section: 'values', fieldKey: 'value3_title', valueEn: 'Community', valueBn: 'সম্প্রদায়' },
        { page: 'about', section: 'values', fieldKey: 'value4_title', valueEn: 'Empowerment', valueBn: 'স্বনির্ভরতা' },
        // Get Involved
        { page: 'getInvolved', section: 'intro', fieldKey: 'title', valueEn: 'Join us in making a difference.', valueBn: 'পরিবর্তন আনতে পাশে থাকুন।' },
        { page: 'getInvolved', section: 'intro', fieldKey: 'paragraph', valueEn: 'Whether through donations, volunteering, or partnerships, your involvement drives our mission forward.', valueBn: 'অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব—যেভাবেই পারেন, পাশে থাকলে আমাদের কাজ এগোয়।' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'label', valueEn: 'Bank details', valueBn: 'ব্যাংক তথ্য' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'name', valueEn: 'Heritage of Hope Foundation', valueBn: 'Heritage of Hope Foundation' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'branch', valueEn: 'State Bank of India, Ruby Park Branch', valueBn: 'স্টেট ব্যাংক অফ ইন্ডিয়া, রুবি পার্ক ব্রাঞ্চ' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'account', valueEn: 'A/C No: 43107075580', valueBn: 'হিসাব নম্বর: 43107075580' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'ifsc', valueEn: 'IFSC: SBIN0008438', valueBn: 'আইএফএসসি: SBIN0008438' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'chequeLabel', valueEn: 'View specimen cheque', valueBn: 'চেক দেখুন' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'chequeUrl', valueEn: '/docs/empty-cheque.jpeg', valueBn: '/docs/empty-cheque.jpeg' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'qrTitle', valueEn: 'Scan to donate', valueBn: 'স্ক্যান করে অনুদান দিন' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'qrAlt', valueEn: 'Official UPI QR code for donations', valueBn: 'দানের জন্য আনুষ্ঠানিক ইউপিআই কিউআর কোড' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'qrUrl', valueEn: '/docs/upi-qr.jpeg', valueBn: '/docs/upi-qr.jpeg' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'intentUrl', valueEn: 'upi://pay?pa=8420119790%40okbizaxis&pn=Heritage%20of%20Hope%20Foundation&cu=INR', valueBn: 'upi://pay?pa=8420119790%40okbizaxis&pn=Heritage%20of%20Hope%20Foundation&cu=INR' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'ctaText', valueEn: 'Pay via UPI app', valueBn: 'UPI অ্যাপ দিয়ে পেমেন্ট করুন' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'hint', valueEn: 'On mobile, this opens your installed UPI app directly.', valueBn: 'মোবাইলে চাপলে আপনার UPI অ্যাপ খুলে যাবে।' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'fallback', valueEn: 'If no UPI app opens on this device, please use the QR code above to complete payment.', valueBn: 'এই ডিভাইসে UPI অ্যাপ না খুললে, উপরের QR কোড স্ক্যান করে পেমেন্ট সম্পন্ন করুন।' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'body', valueEn: 'Scan this official UPI QR code to donate. You can also use the bank details above for direct transfers. After donating, email us your UTR for a receipt.', valueBn: 'আনুষ্ঠানিক ইউপিআই কিউআর কোড স্ক্যান করে অনুদান দিন। চাইলে উপরের ব্যাংক তথ্য দিয়েও টাকা পাঠাতে পারেন। দানের পরে রসিদের জন্য UTR ইমেল করুন।' },
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
