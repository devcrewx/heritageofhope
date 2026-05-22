import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  try {
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
        { value: '200', labelEn: 'children supported', labelBn: 'শিশুর কাছে পৌঁছানো হয়েছে', sortOrder: 0 },
        { value: '15', labelEn: 'health & education drives', labelBn: 'স্বাস্থ্য ও শিক্ষা উদ্যোগ', sortOrder: 1 },
        { value: '3', labelEn: 'active partner organizations', labelBn: 'সক্রিয় সহযোগী সংস্থা', sortOrder: 2 },
        { value: '5', labelEn: 'communities served', labelBn: 'উপকৃত গ্রাম/এলাকা', sortOrder: 3 },
      ],
    })

    // ===== DONATION TIERS =====
    console.log('Seeding donation tiers...')
    await prisma.donationTier.createMany({
      data: [
        { amount: 199, labelEn: 'one child gets warm clothing', labelBn: 'এক শিশুর জন্য শীতবস্ত্র', sortOrder: 0 },
        { amount: 500, labelEn: 'learning materials for a month', labelBn: 'এক মাসের শিক্ষা উপকরণ', sortOrder: 1 },
        { amount: 1000, labelEn: 'health outreach support', labelBn: 'স্বাস্থ্যসেবায় পাশে থাকা', sortOrder: 2 },
        { amount: 5000, labelEn: 'sponsor a learning journey', labelBn: 'একজনের শিক্ষার দায়িত্ব নিন', sortOrder: 3 },
      ],
    })

    // ===== VOLUNTEER ROLES =====
    console.log('Seeding volunteer roles...')
    await prisma.volunteerRole.createMany({
      data: [
        { titleEn: 'Teaching support', titleBn: 'শিক্ষাদানে সহায়তা', descriptionEn: 'Support field execution, coordination, and regular follow-up.', descriptionBn: 'মাঠের কাজ ও শিক্ষাদানে সহায়তা করুন।', sortOrder: 0 },
        { titleEn: 'Event coordination', titleBn: 'অনুষ্ঠান গোছানো', descriptionEn: 'Plan and coordinate community events and outreach programs.', descriptionBn: 'সামাজিক অনুষ্ঠান ও রিলিফ ড্রাইভের পরিকল্পনা ও সমন্বয় করুন।', sortOrder: 1 },
        { titleEn: 'Photography', titleBn: 'ফটোগ্রাফি', descriptionEn: 'Document field activities for reports and social media.', descriptionBn: 'প্রতিবেদন ও সোশ্যাল মিডিয়ার জন্য মাঠের কার্যক্রমের ছবি তুলুন।', sortOrder: 2 },
        { titleEn: 'Social media', titleBn: 'সামাজিক মাধ্যম', descriptionEn: 'Help share our story across digital platforms.', descriptionBn: 'আমাদের গল্প ডিজিটাল মাধ্যমে ছড়িয়ে দিতে সাহায্য করুন।', sortOrder: 3 },
        { titleEn: 'Healthcare assistance', titleBn: 'স্বাস্থ্যসেবায় সহায়তা', descriptionEn: 'Assist in health camps and medical outreach efforts.', descriptionBn: 'স্বাস্থ্য শিবির ও চিকিৎসা সেবায় সহায়তা করুন।', sortOrder: 4 },
      ],
    })

    // ===== SITE CONTENT =====
    console.log('Seeding site content...')
    await prisma.siteContent.createMany({
      data: [
        // ========== Settings ==========
        { page: 'settings', section: 'general', fieldKey: 'org_name', valueEn: 'Heritage of Hope Foundation', valueBn: 'হেরিটেজ অফ হোপ ফাউন্ডেশন' },
        { page: 'settings', section: 'general', fieldKey: 'navbar_subtitle', valueEn: 'Registered NGO | West Bengal', valueBn: 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ' },
        { page: 'settings', section: 'general', fieldKey: 'registered_badge', valueEn: 'Registered NGO', valueBn: 'নিবন্ধিত সংস্থা' },
        { page: 'settings', section: 'general', fieldKey: 'est_year', valueEn: 'Est. 2024', valueBn: 'প্রতিষ্ঠিত ২০২৪' },
        { page: 'settings', section: 'general', fieldKey: 'donate_button_label', valueEn: 'Donate Now', valueBn: 'সহযোগিতার হাত বাড়িয়ে দিন' },
        { page: 'settings', section: 'general', fieldKey: 'facebook_label', valueEn: 'Follow us on Facebook', valueBn: 'ফেসবুকে আমাদের সঙ্গে থাকুন' },
        { page: 'settings', section: 'general', fieldKey: 'contact_phone_label', valueEn: 'Phone', valueBn: 'ফোন' },
        { page: 'settings', section: 'general', fieldKey: 'contact_email_label', valueEn: 'Email', valueBn: 'ইমেল' },
        { page: 'settings', section: 'general', fieldKey: 'contact_address_label', valueEn: 'Address', valueBn: 'ঠিকানা' },
        { page: 'settings', section: 'general', fieldKey: 'logo_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210218/heritage-of-hope/brand/profile_pic.webp', valueBn: '' },
        { page: 'settings', section: 'general', fieldKey: 'footer_mission', valueEn: 'Children, women and communities in South 24 Parganas, West Bengal.', valueBn: 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।' },
        { page: 'settings', section: 'general', fieldKey: 'phone', valueEn: '+91 8420119790', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'email', valueEn: 'heritageofhopefoundation@gmail.com', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'address', valueEn: 'Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB, IN', valueBn: 'সুকান্তপল্লী, সুভাষ গ্রাম, ৭০০১৪৭, দক্ষিণ ২৪ পরগনা, পশ্চিমবঙ্গ, ভারত' },
        { page: 'settings', section: 'general', fieldKey: 'facebook_url', valueEn: 'https://www.facebook.com/profile.php?id=61559891799273', valueBn: null },
        { page: 'settings', section: 'general', fieldKey: 'hamburger_aria_label', valueEn: 'Open navigation', valueBn: 'মেনু খুলুন' },
        { page: 'settings', section: 'general', fieldKey: 'nav_aria_label', valueEn: 'Primary navigation', valueBn: 'প্রধান মেনু' },
        // Nav items
        { page: 'settings', section: 'navItems', fieldKey: 'home', valueEn: 'Home', valueBn: 'হোম' },
        { page: 'settings', section: 'navItems', fieldKey: 'about', valueEn: 'About', valueBn: 'আমাদের কথা' },
        { page: 'settings', section: 'navItems', fieldKey: 'ourWork', valueEn: 'Our Work', valueBn: 'আমাদের কাজ' },
        { page: 'settings', section: 'navItems', fieldKey: 'impact', valueEn: 'Impact', valueBn: 'ফলাফল' },
        { page: 'settings', section: 'navItems', fieldKey: 'gallery', valueEn: 'Gallery', valueBn: 'ছবিঘর' },
        { page: 'settings', section: 'navItems', fieldKey: 'getInvolved', valueEn: 'Get Involved', valueBn: 'সাথে থাকুন' },
        { page: 'settings', section: 'navItems', fieldKey: 'contact', valueEn: 'Contact', valueBn: 'যোগাযোগ' },

        // Contact page copy (matches ContactEditor field keys)
        { page: 'settings', section: 'contact', fieldKey: 'contact_page_title', valueEn: "We'd love to hear from you.", valueBn: 'আমরা আপনার কথা শুনতে চাই।' },
        { page: 'settings', section: 'contact', fieldKey: 'contact_page_intro', valueEn: 'Reach out to us for inquiries, partnerships, or just to say hello.', valueBn: 'কিছু জানতে চাইলে বা আমাদের সাথে কাজ করতে চাইলে সহজেই যোগাযোগ করুন।' },
        { page: 'settings', section: 'contact', fieldKey: 'contact_response_label', valueEn: 'Response time', valueBn: 'কত তাড়াতাড়ি উত্তর পাবেন' },
        { page: 'settings', section: 'contact', fieldKey: 'contact_response_value', valueEn: 'Usually within 2 business days', valueBn: 'সাধারণত ২ কর্মদিবসের মধ্যে' },
        { page: 'settings', section: 'contact', fieldKey: 'contact_form_label', valueEn: 'Contact form', valueBn: 'যোগাযোগের ফর্ম' },
        { page: 'settings', section: 'contact', fieldKey: 'contact_form_heading', valueEn: 'Send us a direct message', valueBn: 'সরাসরি একটা মেসেজ পাঠান' },

        // ========== Home ==========
        // Hero section
        { page: 'home', section: 'hero', fieldKey: 'eyebrow', valueEn: 'Lighting lives, one step at a time', valueBn: 'ছোট ছোট কাজ, বড় ভরসা' },
        { page: 'home', section: 'hero', fieldKey: 'headline', valueEn: 'Education, healthcare and dignity for underserved communities.', valueBn: 'প্রান্তিক মানুষের জন্য শিক্ষা, স্বাস্থ্য ও মর্যাদা।' },
        { page: 'home', section: 'hero', fieldKey: 'intro', valueEn: 'Heritage of Hope Foundation works across South 24 Parganas through learning spaces, health outreach and seasonal relief.', valueBn: 'হেরিটেজ অফ হোপ ফাউন্ডেশন দক্ষিণ ২৪ পরগণায় শিক্ষাকেন্দ্র, স্বাস্থ্যসেবা ও মৌসুমি সহায়তার মাধ্যমে কাজ করে।' },
        { page: 'home', section: 'hero', fieldKey: 'heroFootnote', valueEn: 'Empowering Communities | Registered NGO', valueBn: 'মানুষের পাশে | নিবন্ধিত সংস্থা' },
        { page: 'home', section: 'hero', fieldKey: 'heroImage', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', valueBn: null },
        { page: 'home', section: 'hero', fieldKey: 'figcaption', valueEn: 'Kishalaya Pathsala, Kankandighi | Community learning moment', valueBn: 'কিশলয় পাঠশালা, কঙ্কনদীঘি | পড়াশোনার সুন্দর মুহূর্ত' },
        // Trust badges (managed from Settings page)
        { page: 'settings', section: 'trustBadges', fieldKey: 'item_0', valueEn: 'Registered NGO', valueBn: 'নিবন্ধিত সংস্থা' },
        { page: 'settings', section: 'trustBadges', fieldKey: 'item_1', valueEn: 'Est. 2024', valueBn: 'প্রতিষ্ঠিত ২০২৪' },
        { page: 'settings', section: 'trustBadges', fieldKey: 'item_2', valueEn: 'Govt. of West Bengal', valueBn: 'পশ্চিমবঙ্গ সরকার' },
        { page: 'home', section: 'hero', fieldKey: 'regCertThumb', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210220/heritage-of-hope/registration/reg_cert.webp', valueBn: null },
        { page: 'home', section: 'hero', fieldKey: 'ctaPrimaryLabel', valueEn: 'Support a Program', valueBn: 'সহায়তা করুন' },
        { page: 'home', section: 'hero', fieldKey: 'ctaSecondaryLabel', valueEn: 'Explore Our Work', valueBn: 'আমাদের কাজ দেখুন' },
        { page: 'home', section: 'hero', fieldKey: 'certCaption', valueEn: 'Registration proof available on About page', valueBn: 'নিবন্ধনের প্রমাণ "আমাদের কথা" পাতায়' },
        // Page content labels
        { page: 'home', section: 'pageContent', fieldKey: 'statsLabel', valueEn: 'Our footprint so far', valueBn: 'আমাদের কাজের পরিধি' },
        { page: 'home', section: 'pageContent', fieldKey: 'pillarLabel', valueEn: 'Mission pillars', valueBn: 'মূল লক্ষ্য' },
        { page: 'home', section: 'pageContent', fieldKey: 'activityLabel', valueEn: 'From the Facebook timeline', valueBn: 'ফেসবুকের পাতা থেকে' },
        { page: 'home', section: 'pageContent', fieldKey: 'donationLabel', valueEn: 'Donate', valueBn: 'সাহায্য করুন' },
        { page: 'home', section: 'pageContent', fieldKey: 'statsHeading', valueEn: 'Impact snapshot', valueBn: 'পরিসংখ্যান' },
        { page: 'home', section: 'pageContent', fieldKey: 'activityHeading', valueEn: 'Stories, updates and event photos', valueBn: 'গল্প, আপডেট ও অনুষ্ঠানের ছবি' },
        // Mission heading
        { page: 'home', section: 'mission', fieldKey: 'heading', valueEn: 'What we do on the ground', valueBn: 'মানুষের দোরগোড়ায় আমাদের কাজ' },
        // CTA
        { page: 'home', section: 'cta', fieldKey: 'headline', valueEn: 'Your small gift creates big change.', valueBn: 'আপনার ছোট অনুদান বড় পরিবর্তন আনতে পারে।' },
        { page: 'home', section: 'cta', fieldKey: 'body', valueEn: 'Even small support helps us keep classes running, respond to health needs and serve families with dignity.', valueBn: 'অল্প সাহায্যেও আমাদের ক্লাস চালানো, স্বাস্থ্যকাজ সামলানো আর মানুষের পাশে থাকা সহজ হয়।' },
        // CTA button
        { page: 'home', section: 'cta', fieldKey: 'buttonLabel', valueEn: 'Donate now', valueBn: 'সহযোগিতার হাত বাড়িয়ে দিন' },
        // Showcase images
        { page: 'home', section: 'showcase', fieldKey: 'img1_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img1_labelEn', valueEn: 'Learning Space', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img1_labelBn', valueEn: 'শিক্ষা কেন্দ্র', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img2_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img2_labelEn', valueEn: 'Health Camp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img2_labelBn', valueEn: 'স্বাস্থ্য শিবির', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img3_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img3_labelEn', valueEn: 'Blood Donation', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img3_labelBn', valueEn: 'রক্তদান', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img4_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img4_labelEn', valueEn: 'Winter Program', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img4_labelBn', valueEn: 'শীতকালীন কর্মসূচি', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img5_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img5_labelEn', valueEn: 'Monsoon Relief', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img5_labelBn', valueEn: 'বর্ষা সহায়তা', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img6_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210217/heritage-of-hope/heroes/bornporichoy.webp', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img6_labelEn', valueEn: 'Literacy Sessions', valueBn: null },
        { page: 'home', section: 'showcase', fieldKey: 'img6_labelBn', valueEn: 'সাক্ষরতা কর্মসূচি', valueBn: null },

        // ========== About ==========
        // Hero
        { page: 'about', section: 'intro', fieldKey: 'title', valueEn: 'Rooted in community. Driven by impact.', valueBn: 'মানুষের মধ্যেই আমাদের শিকড়। কাজের ফলই আমাদের পথ দেখায়।' },
        { page: 'about', section: 'intro', fieldKey: 'paragraph', valueEn: 'We work directly with the people we serve, ensuring every initiative brings lasting, positive change.', valueBn: 'আমরা সরাসরি মানুষের পাশে দাঁড়াই — যাতে প্রতিটি উদ্যোগ সত্যিকারের ও দীর্ঘস্থায়ী পরিবর্তন আনে।' },
        { page: 'about', section: 'hero', fieldKey: 'heroImage', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210222/heritage-of-hope/about/foundation.webp', valueBn: null },
        // Story
        { page: 'about', section: 'story', fieldKey: 'heading', valueEn: 'Grounded in field realities', valueBn: 'মানুষের মাঝ থেকে' },
        { page: 'about', section: 'story', fieldKey: 'body', valueEn: 'The foundation began from direct work with children and women in underserved areas.', valueBn: 'শিশু আর নারীদের সঙ্গে কাজ করতে করতেই ফাউন্ডেশনের শুরু।' },
        // Mission & Vision
        { page: 'about', section: 'mission', fieldKey: 'statement', valueEn: 'To create lasting, positive change in the lives of children, women, and communities in South 24 Parganas.', valueBn: 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের জীবনে স্থায়ী, ইতিবাচক পরিবর্তন আনা।' },
        { page: 'about', section: 'mission', fieldKey: 'vision', valueEn: 'A community where every child has access to quality education, healthcare, and dignity.', valueBn: 'এমন এক সম্প্রদায় যেখানে প্রতিটি শিশু মানসম্পন্ন শিক্ষা, স্বাস্থ্যসেবা ও মর্যাদা পায়।' },
        // Values
        { page: 'about', section: 'values', fieldKey: 'value1_title', valueEn: 'Compassion', valueBn: 'সহানুভূতি' },
        { page: 'about', section: 'values', fieldKey: 'value2_title', valueEn: 'Transparency', valueBn: 'স্বচ্ছতা' },
        { page: 'about', section: 'values', fieldKey: 'value3_title', valueEn: 'Community', valueBn: 'সম্প্রদায়' },
        { page: 'about', section: 'values', fieldKey: 'value4_title', valueEn: 'Empowerment', valueBn: 'স্বনির্ভরতা' },
        // Registration
        { page: 'about', section: 'registration', fieldKey: 'body', valueEn: 'Heritage of Hope Foundation is a registered NGO committed to transparency and dedicated service in West Bengal.', valueBn: 'হেরিটেজ অফ হোপ ফাউন্ডেশন একটি নিবন্ধিত এনজিও, যা পশ্চিমবঙ্গে নিয়ম মেনে আর খোলামেলা ভাবে কাজ করছে।' },
        { page: 'about', section: 'registration', fieldKey: 'certImage', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210220/heritage-of-hope/registration/reg_cert.webp', valueBn: null },
        // Documents labels
        { page: 'about', section: 'pageContent', fieldKey: 'documentsLabel', valueEn: 'Documents', valueBn: 'দলিল' },
        { page: 'about', section: 'pageContent', fieldKey: 'documentsHeading', valueEn: 'Official documents', valueBn: 'সরকারি কাগজপত্র' },
        { page: 'about', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'About', valueBn: 'আমাদের কথা' },
        { page: 'about', section: 'pageContent', fieldKey: 'storyLabel', valueEn: 'Our story', valueBn: 'আমাদের গল্প' },
        { page: 'about', section: 'pageContent', fieldKey: 'missionLabel', valueEn: 'Mission', valueBn: 'লক্ষ্য' },
        { page: 'about', section: 'pageContent', fieldKey: 'visionLabel', valueEn: 'Vision', valueBn: 'দৃষ্টি' },
        { page: 'about', section: 'pageContent', fieldKey: 'valuesLabel', valueEn: 'Guided by shared principles', valueBn: 'আমাদের মূলনীতি' },
        { page: 'about', section: 'pageContent', fieldKey: 'valuesHeading', valueEn: 'How we work', valueBn: 'আমাদের কাজের পদ্ধতি' },
        { page: 'about', section: 'pageContent', fieldKey: 'regLabel', valueEn: 'Legally registered and transparent', valueBn: 'আইনিভাবে নিবন্ধিত ও স্বচ্ছ' },
        { page: 'about', section: 'pageContent', fieldKey: 'regHeading', valueEn: 'Registration and accountability', valueBn: 'নিবন্ধন ও জবাবদিহিতা' },
        { page: 'about', section: 'pageContent', fieldKey: 'certLabel', valueEn: 'Registration certificate', valueBn: 'নিবন্ধন সনদ' },
        { page: 'about', section: 'pageContent', fieldKey: 'partnersLabel', valueEn: 'Partners', valueBn: 'সহযোগী' },
        { page: 'about', section: 'pageContent', fieldKey: 'teamLabel', valueEn: 'Dedicated people, doing important work', valueBn: 'নিষ্ঠাবান মানুষ, গুরুত্বপূর্ণ কাজ' },
        { page: 'about', section: 'pageContent', fieldKey: 'teamHeading', valueEn: 'Team snapshot', valueBn: 'দলের পরিচিতি' },

        // ========== Our Work ==========
        { page: 'our-work', section: 'hero', fieldKey: 'title', valueEn: 'Initiatives designed for real-world impact.', valueBn: 'আমাদের কাজগুলো আসল দরকার মাথায় রেখেই করা হয়।' },
        { page: 'our-work', section: 'hero', fieldKey: 'intro', valueEn: 'Our active programs focus on education, healthcare, and community welfare to bring comprehensive support to those who need it most.', valueBn: 'শিক্ষা, স্বাস্থ্য আর সমাজকল্যাণ—এই তিন দিকেই আমরা কাজ করি, যাতে মানুষের কাছে ঠিক সময়ে সাহায্য পৌঁছে যায়।' },
        { page: 'our-work', section: 'hero', fieldKey: 'heroImage', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', valueBn: null },
        { page: 'our-work', section: 'focus', fieldKey: 'tag1', valueEn: 'Education', valueBn: 'শিক্ষা' },
        { page: 'our-work', section: 'focus', fieldKey: 'tag2', valueEn: 'Healthcare', valueBn: 'স্বাস্থ্য' },
        { page: 'our-work', section: 'focus', fieldKey: 'tag3', valueEn: 'Welfare', valueBn: 'কল্যাণ' },
        { page: 'our-work', section: 'approach', fieldKey: 'heading', valueEn: 'How we execute programs', valueBn: 'কীভাবে আমরা কাজগুলো করি' },
        { page: 'our-work', section: 'approach', fieldKey: 'step1', valueEn: 'Identify community needs', valueBn: 'পাড়ার দরকারটা আগে বুঝে নিই' },
        { page: 'our-work', section: 'approach', fieldKey: 'step2', valueEn: 'Collaborate with local partners', valueBn: 'স্থানীয় অংশীদারদের সাথে যৌথ উদ্যোগ' },
        { page: 'our-work', section: 'approach', fieldKey: 'step3', valueEn: 'Execute program and track impact', valueBn: 'কাজটা করি আর কী হলো দেখি' },
        { page: 'our-work', section: 'approach', fieldKey: 'step4', valueEn: 'Provide ongoing support and review', valueBn: 'চলতে থাকা সহায়তা আর খোঁজখবর রাখি' },
        { page: 'our-work', section: 'join', fieldKey: 'meta', valueEn: 'Join the mission', valueBn: 'আমাদের সাথে থাকুন' },
        { page: 'our-work', section: 'join', fieldKey: 'body', valueEn: 'By partnering with us or volunteering, you help us bring these programs to life in underserved communities.', valueBn: 'আমাদের সাথে যুক্ত হয়ে আপনিও প্রান্তিক মানুষের কাছে এই সেবাগুলো পৌঁছে দিতে পারেন।' },
        { page: 'our-work', section: 'join', fieldKey: 'button', valueEn: 'Support this work', valueBn: 'এই কাজটায় পাশে থাকুন' },
        // Page content
        { page: 'our-work', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'Our Work', valueBn: 'আমাদের কাজ' },
        { page: 'our-work', section: 'pageContent', fieldKey: 'focusLabel', valueEn: 'Focus areas', valueBn: 'ফোকাস এরিয়া' },
        { page: 'our-work', section: 'pageContent', fieldKey: 'approachLabel', valueEn: 'Our Approach', valueBn: 'আমাদের পদ্ধতি' },
        { page: 'our-work', section: 'pageContent', fieldKey: 'joinLabel', valueEn: 'Join the mission', valueBn: 'আমাদের সাথে থাকুন' },
        // Showcase images — legacy featuredProgram images (6)
        { page: 'our-work', section: 'showcase', fieldKey: 'img1_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img1_labelEn', valueEn: 'Kishalaya Pathsala', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img1_labelBn', valueEn: 'কিশলয় পাঠশালা', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img2_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img2_labelEn', valueEn: 'Free Health Camps', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img2_labelBn', valueEn: 'বিনামূল্যের স্বাস্থ্য শিবির', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img3_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img3_labelEn', valueEn: 'Blood Donation Drives', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img3_labelBn', valueEn: 'রক্তদান উদ্যোগ', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img4_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img4_labelEn', valueEn: 'Winter Programme', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img4_labelBn', valueEn: 'শীতকালীন কর্মসূচি', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img5_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img5_labelEn', valueEn: 'Monsoon Relief', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img5_labelBn', valueEn: 'বর্ষাকালীন সহায়তা', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img6_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210217/heritage-of-hope/heroes/bornporichoy.webp', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img6_labelEn', valueEn: 'Bornporichoy', valueBn: null },
        { page: 'our-work', section: 'showcase', fieldKey: 'img6_labelBn', valueEn: 'বর্ণপরিচয়', valueBn: null },

        // ========== Impact ==========
        { page: 'impact', section: 'intro', fieldKey: 'title', valueEn: 'Transparency and measurable change.', valueBn: 'স্বচ্ছতা আর কাজের ফলাফল।' },
        { page: 'impact', section: 'intro', fieldKey: 'paragraph', valueEn: 'Explore the numbers and stories that showcase the direct results of our community-driven approach.', valueBn: 'আমাদের কাজের ফল আর মানুষের বদলে যাওয়ার গল্পগুলো দেখুন।' },
        { page: 'impact', section: 'hero', fieldKey: 'promise', valueEn: 'Accountability to our donors and community.', valueBn: 'দাতাদের কাছে পরিষ্কার হিসাব আর মানুষের কাছে জবাবদিহিতা।' },
        { page: 'impact', section: 'feedback', fieldKey: 'label', valueEn: 'Community Feedback', valueBn: 'মানুষের কথা' },
        { page: 'impact', section: 'feedback', fieldKey: 'quote', valueEn: '"Thanks to Kishalaya Pathsala and the Foundation, our children receive dedicated guidance and winter support that keeps them learning year-round."', valueBn: '"কিশলয় পাঠশালা ও ফাউন্ডেশনের কারণে আমাদের ছেলেমেয়েরা যত্নশীল শিক্ষা ও শীতের সহায়তা পাচ্ছে, যা তাদের সারা বছর পড়াশোনায় যুক্ত রাখে।"' },
        { page: 'impact', section: 'report', fieldKey: 'label', valueEn: 'Annual report', valueBn: 'বার্ষিক রিপোর্ট' },
        { page: 'impact', section: 'report', fieldKey: 'status', valueEn: 'Our 2025-2026 Impact Report is currently being compiled and will be available for download soon.', valueBn: '২০২৫-২৬ সালের কাজের রিপোর্ট এখন তৈরি হচ্ছে, শীঘ্রই ডাউনলোড করতে পারবেন।' },
        // Page content
        { page: 'impact', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'Impact', valueBn: 'ফলাফল' },
        { page: 'impact', section: 'pageContent', fieldKey: 'promiseLabel', valueEn: 'Our Promise', valueBn: 'আমাদের অঙ্গীকার' },
        { page: 'impact', section: 'pageContent', fieldKey: 'fundLabel', valueEn: 'Fund utilization', valueBn: 'তহবিলের ব্যবহার' },
        { page: 'impact', section: 'pageContent', fieldKey: 'fundHeading', valueEn: 'How support is used', valueBn: 'সাহায্য কীভাবে কাজে লাগে' },
        { page: 'impact', section: 'pageContent', fieldKey: 'feedbackLabel', valueEn: 'Community Feedback', valueBn: 'মানুষের মতামত' },
        { page: 'impact', section: 'pageContent', fieldKey: 'reportLabel', valueEn: 'Annual report', valueBn: 'বার্ষিক রিপোর্ট' },

        // ========== Get Involved ==========
        { page: 'getInvolved', section: 'intro', fieldKey: 'title', valueEn: 'Join us in making a difference.', valueBn: 'পরিবর্তন আনতে পাশে থাকুন।' },
        { page: 'getInvolved', section: 'intro', fieldKey: 'paragraph', valueEn: 'Whether through donations, volunteering, or partnerships, your involvement drives our mission forward.', valueBn: 'অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব—যেভাবেই পারেন, পাশে থাকলে আমাদের কাজ এগোয়।' },
        { page: 'getInvolved', section: 'hero', fieldKey: 'heroImage', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210223/heritage-of-hope/partners/get_involved_partner.webp', valueBn: null },
        // Bank details
        { page: 'getInvolved', section: 'bank', fieldKey: 'label', valueEn: 'Bank details', valueBn: 'ব্যাংক তথ্য' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'accountName', valueEn: 'Heritage of Hope Foundation', valueBn: 'Heritage of Hope Foundation' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'bankName', valueEn: 'State Bank of India, Ruby Park Branch', valueBn: 'স্টেট ব্যাংক অফ ইন্ডিয়া, রুবি পার্ক ব্রাঞ্চ' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'accountNumber', valueEn: 'A/C No: 43107075580', valueBn: 'হিসাব নম্বর: 43107075580' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'ifsc', valueEn: 'IFSC: SBIN0008438', valueBn: 'আইএফএসসি: SBIN0008438' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'chequeLabel', valueEn: 'View specimen cheque', valueBn: 'চেক দেখুন' },
        { page: 'getInvolved', section: 'bank', fieldKey: 'chequeUrl', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210262/heritage-of-hope/documents/empty-cheque.jpg', valueBn: null },
        // UPI
        { page: 'getInvolved', section: 'upi', fieldKey: 'qrTitle', valueEn: 'Scan to donate', valueBn: 'স্ক্যান করে অনুদান দিন' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'qrAlt', valueEn: 'Official UPI QR code for donations', valueBn: 'দানের জন্য আনুষ্ঠানিক ইউপিআই কিউআর কোড' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'qrUrl', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210270/heritage-of-hope/documents/upi-qr.jpg', valueBn: null },
        { page: 'getInvolved', section: 'upi', fieldKey: 'intentUrl', valueEn: 'upi://pay?pa=8420119790%40okbizaxis&pn=Heritage%20of%20Hope%20Foundation&cu=INR', valueBn: null },
        { page: 'getInvolved', section: 'upi', fieldKey: 'ctaText', valueEn: 'Pay via UPI app', valueBn: 'UPI অ্যাপ দিয়ে পেমেন্ট করুন' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'hint', valueEn: 'On mobile, this opens your installed UPI app directly.', valueBn: 'মোবাইলে চাপলে আপনার UPI অ্যাপ খুলে যাবে।' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'fallback', valueEn: 'If no UPI app opens on this device, please use the QR code above to complete payment.', valueBn: 'এই ডিভাইসে UPI অ্যাপ না খুললে, উপরের QR কোড স্ক্যান করে পেমেন্ট সম্পন্ন করুন।' },
        { page: 'getInvolved', section: 'upi', fieldKey: 'body', valueEn: 'Scan this official UPI QR code to donate. You can also use the bank details above for direct transfers. After donating, email us your UTR for a receipt.', valueBn: 'আনুষ্ঠানিক ইউপিআই কিউআর কোড স্ক্যান করে অনুদান দিন। চাইলে উপরের ব্যাংক তথ্য দিয়েও টাকা পাঠাতে পারেন। দানের পরে রসিদের জন্য UTR ইমেল করুন।' },
        // Page content labels
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'donationLabel', valueEn: 'Donation ladder', valueBn: 'অনুদানে কী বদলায়' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'donationHeading', valueEn: 'What your support can do', valueBn: 'আপনার সাহায্যে কী করা যায়' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'paymentLabel', valueEn: 'UPI payment', valueBn: 'ইউপিআই পেমেন্ট' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'paymentHeading', valueEn: 'Scan to donate', valueBn: 'স্ক্যান করে অনুদান দিন' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'volunteerLabel', valueEn: 'Volunteer', valueBn: 'স্বেচ্ছাসেবা' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'volunteerHeading', valueEn: 'People matter more than perfection', valueBn: 'মানুষই আমাদের সবচেয়ে বড় শক্তি' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'volunteerFormLabel', valueEn: 'Volunteer form', valueBn: 'স্বেচ্ছাসেবক ফর্ম' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'volunteerFormHeading', valueEn: 'Join the team', valueBn: 'দলে যোগ দিন' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'partnerLabel', valueEn: 'Partner with us', valueBn: 'আমাদের সাথে কাজ করুন' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'partnerHeading', valueEn: 'For CSR, hospitals and institutions', valueBn: 'কর্পোরেট, হাসপাতাল ও অন্যান্য প্রতিষ্ঠানের জন্য' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'partnerSubtitle', valueEn: 'Partnerships help scale learning spaces, health camps, and seasonal support.', valueBn: 'একসাথে কাজ করলে আমরা আরও বেশি মানুষের কাছে পড়াশোনা আর স্বাস্থ্যসেবা পৌঁছে দিতে পারি।' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'partnerFormLabel', valueEn: 'Partner inquiry', valueBn: 'পার্টনারশিপের কথা' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'partnerFormHeading', valueEn: 'Start a collaboration', valueBn: 'চলুন একসাথে কাজ করি' },
        { page: 'getInvolved', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'Get Involved', valueBn: 'সাথে থাকুন' },
        // Volunteer section
        { page: 'getInvolved', section: 'volunteer', fieldKey: 'heading', valueEn: 'Join us in making a difference', valueBn: 'পরিবর্তন আনতে পাশে থাকুন' },
        { page: 'getInvolved', section: 'volunteer', fieldKey: 'description', valueEn: 'Your time and skills can make a real difference. Join our team of dedicated volunteers and help us bring change to underserved communities.', valueBn: 'আপনার সময় ও দক্ষতা সত্যিকারের পরিবর্তন আনতে পারে। আমাদের নিবেদিত স্বেচ্ছাসেবক দলে যোগ দিন এবং প্রান্তিক জনগোষ্ঠীর জীবন বদলে দিন।' },
        { page: 'getInvolved', section: 'partner', fieldKey: 'heading', valueEn: 'Partner with us', valueBn: 'আমাদের সাথে কাজ করুন' },
        { page: 'getInvolved', section: 'partner', fieldKey: 'description', valueEn: 'Partnerships help scale learning spaces, health camps, and seasonal support with accountability.', valueBn: 'একসাথে কাজ করলে আমরা শিক্ষা, স্বাস্থ্য আর মৌসুমি সাহায্য আরও বেশি মানুষের কাছে পৌঁছে দিতে পারি।' },
        { page: 'getInvolved', section: 'partner', fieldKey: 'image', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210223/heritage-of-hope/partners/get_involved_partner.webp', valueBn: null },
        // Volunteer form labels
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'nameLabel', valueEn: 'Name', valueBn: 'নাম' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'emailLabel', valueEn: 'Email', valueBn: 'ইমেল' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'phoneLabel', valueEn: 'Phone', valueBn: 'ফোন' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'phoneValidation', valueEn: 'Please enter a valid phone number', valueBn: 'একটি বৈধ ফোন নম্বর দিন' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'interestLabel', valueEn: 'Area of interest', valueBn: 'আগ্রহের ক্ষেত্র' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'interestPlaceholder', valueEn: 'Choose one', valueBn: 'একটি নির্বাচন করুন' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'availabilityLabel', valueEn: 'Availability', valueBn: 'সুযোগ' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'availabilityPlaceholder', valueEn: 'Choose one', valueBn: 'একটি নির্বাচন করুন' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'availabilityWeekends', valueEn: 'Weekends', valueBn: 'সপ্তাহান্তে' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'availabilityWeekdays', valueEn: 'Weekdays', valueBn: 'সপ্তাহের দিন' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'availabilityOccasional', valueEn: 'Occasionally', valueBn: 'মাঝে মাঝে' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'messageLabel', valueEn: 'Message', valueBn: 'বার্তা' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'submitLabel', valueEn: 'Submit volunteer interest', valueBn: 'স্বেচ্ছাসেবক আগ্রহ জমা দিন' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'submittingLabel', valueEn: 'Submitting...', valueBn: 'জমা দেওয়া হচ্ছে...' },
        { page: 'getInvolved', section: 'volunteerFormLabels', fieldKey: 'errorMessage', valueEn: 'Failed to submit form. Please try again.', valueBn: 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' },
        // Partner form labels
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'orgNameLabel', valueEn: 'Organization name', valueBn: 'প্রতিষ্ঠানের নাম' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'contactPersonLabel', valueEn: 'Contact person', valueBn: 'যোগাযোগকারী ব্যক্তি' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'emailLabel', valueEn: 'Email', valueBn: 'ইমেল' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'phoneLabel', valueEn: 'Phone number', valueBn: 'ফোন নম্বর' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'phoneValidation', valueEn: 'Please enter a valid phone number', valueBn: 'একটি বৈধ ফোন নম্বর দিন' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'partnershipTypeLabel', valueEn: 'Type of partnership', valueBn: 'অংশীদারিত্বের ধরন' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'partnershipTypePlaceholder', valueEn: 'Choose one', valueBn: 'একটি নির্বাচন করুন' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'partnershipTypeCsr', valueEn: 'CSR', valueBn: 'সিএসআর' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'partnershipTypeHospital', valueEn: 'Hospital / Medical', valueBn: 'হাসপাতাল / মেডিকেল' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'partnershipTypeInstitution', valueEn: 'Institution / School', valueBn: 'প্রতিষ্ঠান / স্কুল' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'partnershipTypeOther', valueEn: 'Other', valueBn: 'অন্যান্য' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'messageLabel', valueEn: 'Message', valueBn: 'বার্তা' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'submitLabel', valueEn: 'Submit partner inquiry', valueBn: 'অংশীদার অনুসন্ধান জমা দিন' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'submittingLabel', valueEn: 'Submitting...', valueBn: 'জমা দেওয়া হচ্ছে...' },
        { page: 'getInvolved', section: 'partnerFormLabels', fieldKey: 'errorMessage', valueEn: 'Failed to submit form. Please try again.', valueBn: 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' },
        // UPI labels
        { page: 'getInvolved', section: 'upiLabels', fieldKey: 'buttonLabel', valueEn: 'Pay via UPI app', valueBn: 'UPI অ্যাপের মাধ্যমে পেমেন্ট করুন' },
        { page: 'getInvolved', section: 'upiLabels', fieldKey: 'mobileHint', valueEn: 'On mobile, this opens your installed UPI app directly.', valueBn: 'মোবাইলে, এটি সরাসরি আপনার UPI অ্যাপ খুলবে।' },
        { page: 'getInvolved', section: 'upiLabels', fieldKey: 'fallbackHint', valueEn: 'If no UPI app opens on this device, please use the QR code above to complete payment.', valueBn: 'যদি UPI অ্যাপ না খোলে, তাহলে QR কোড ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন।' },
        { page: 'getInvolved', section: 'upiLabels', fieldKey: 'qrHint', valueEn: 'Scan this official UPI QR code to donate. You can also use the bank details above for direct transfers. After donating, email us your UTR for a receipt.', valueBn: 'দান করতে অফিসিয়াল UPI QR কোড স্ক্যান করুন। সরাসরি ব্যাংক ট্রান্সফারের জন্য উপরের ব্যাংক বিবরণ ব্যবহার করুন।' },

        // ========== Contact ==========
        { page: 'contact', section: 'mosaic', fieldKey: 'img1_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210229/heritage-of-hope/gallery/gallery_winter.webp', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img1_labelEn', valueEn: 'Children receiving winter support', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img1_labelBn', valueEn: 'শিশুদের হাতে শীতের পোশাক', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img2_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210228/heritage-of-hope/gallery/gallery_health.webp', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img2_labelEn', valueEn: 'Health camp participation', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img2_labelBn', valueEn: 'স্বাস্থ্য শিবিরে অংশগ্রহণ', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img3_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210235/heritage-of-hope/gallery/gallery_mothers.webp', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img3_labelEn', valueEn: 'Community registration and outreach', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img3_labelBn', valueEn: 'মানুষের পাশে, মানুষের সাথে', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img4_url', valueEn: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210220/heritage-of-hope/registration/reg_cert.webp', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img4_labelEn', valueEn: 'Registration certificate', valueBn: null },
        { page: 'contact', section: 'mosaic', fieldKey: 'img4_labelBn', valueEn: 'নিবন্ধন সনদ', valueBn: null },
        // Page content
        { page: 'contact', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'Contact', valueBn: 'যোগাযোগ' },
        { page: 'contact', section: 'pageContent', fieldKey: 'facebookLabel', valueEn: 'Featured from Facebook', valueBn: 'ফেসবুকের পাতা থেকে' },
        { page: 'contact', section: 'pageContent', fieldKey: 'facebookHeading', valueEn: 'Recent moments from the page', valueBn: 'সাম্প্রতিক মুহূর্তগুলো' },
        // Map embed
        { page: 'contact', section: 'map', fieldKey: 'embedUrl', valueEn: 'https://www.google.com/maps?q=Sukantapally,+Subhas+Gram,+West+Bengal+700147&output=embed', valueBn: null },
        // Contact form labels
        { page: 'contact', section: 'formLabels', fieldKey: 'nameLabel', valueEn: 'Name', valueBn: 'নাম' },
        { page: 'contact', section: 'formLabels', fieldKey: 'namePlaceholder', valueEn: 'Your name', valueBn: 'আপনার নাম' },
        { page: 'contact', section: 'formLabels', fieldKey: 'emailLabel', valueEn: 'Email', valueBn: 'ইমেল' },
        { page: 'contact', section: 'formLabels', fieldKey: 'emailPlaceholder', valueEn: 'you@example.com', valueBn: '' },
        { page: 'contact', section: 'formLabels', fieldKey: 'subjectLabel', valueEn: 'Subject', valueBn: 'বিষয়' },
        { page: 'contact', section: 'formLabels', fieldKey: 'messageLabel', valueEn: 'Message', valueBn: 'বার্তা' },
        { page: 'contact', section: 'formLabels', fieldKey: 'messagePlaceholder', valueEn: 'Tell us how you want to help', valueBn: '' },
        { page: 'contact', section: 'formLabels', fieldKey: 'submitLabel', valueEn: 'Send message', valueBn: 'বার্তা পাঠান' },
        { page: 'contact', section: 'formLabels', fieldKey: 'submittingLabel', valueEn: 'Sending...', valueBn: 'পাঠানো হচ্ছে...' },
        { page: 'contact', section: 'formLabels', fieldKey: 'errorMessage', valueEn: 'Failed to submit form. Please try again.', valueBn: 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' },
        // ===== Gallery page labels =====
        { page: 'gallery', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'Gallery', valueBn: 'ছবিঘর' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'heading', valueEn: 'Moments of hope and action.', valueBn: 'আমাদের সমাজসেবামূলক কাজের কিছু বিশেষ মুহূর্ত।' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'intro', valueEn: 'A visual journey through our health camps, learning centers, and community outreach events.', valueBn: 'আমাদের স্বাস্থ্য শিবির, শিক্ষাকেন্দ্র এবং বিভিন্ন সামাজিক অনুষ্ঠানের কিছু খণ্ডচিত্র।' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterLabel', valueEn: 'Explore', valueBn: 'ঘুরে দেখুন' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterText', valueEn: 'Filter photos by our core impact areas.', valueBn: 'কোন কাজের ছবি দেখতে চান, সেটা বেছে নিন।' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterAriaLabel', valueEn: 'Gallery categories', valueBn: 'ছবির বিভাগ' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterChipAll', valueEn: 'All', valueBn: 'সব' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterChipEducation', valueEn: 'Education', valueBn: 'শিক্ষা' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterChipHealthcare', valueEn: 'Healthcare', valueBn: 'স্বাস্থ্য' },
        { page: 'gallery', section: 'pageContent', fieldKey: 'filterChipWelfare', valueEn: 'Welfare', valueBn: 'কল্যাণ' },

        // ===== Thank You page =====
        { page: 'thankYou', section: 'pageContent', fieldKey: 'eyebrow', valueEn: 'Submission received', valueBn: 'আপনার বার্তাটি আমরা পেয়েছি' },
        { page: 'thankYou', section: 'pageContent', fieldKey: 'heading', valueEn: 'Thank you for reaching out.', valueBn: 'যোগাযোগ করার জন্য ধন্যবাদ।' },
        { page: 'thankYou', section: 'pageContent', fieldKey: 'body', valueEn: 'We will review your message and respond as soon as possible.', valueBn: 'আপনার বার্তাটা দেখে আমরা দ্রুতই যোগাযোগ করব।' },
        { page: 'thankYou', section: 'pageContent', fieldKey: 'buttonLabel', valueEn: 'Return home', valueBn: 'মূল পাতায় ফিরে যান' },

        // ===== Not Found page =====
        { page: 'notFound', section: 'pageContent', fieldKey: 'eyebrow', valueEn: '404', valueBn: '404' },
        { page: 'notFound', section: 'pageContent', fieldKey: 'heading', valueEn: 'Page not found', valueBn: 'পেজ পাওয়া যায়নি' },
        { page: 'notFound', section: 'pageContent', fieldKey: 'body', valueEn: 'Return to the homepage to continue exploring.', valueBn: 'হোমপেজে ফিরে গিয়ে আবার ঘুরে দেখুন।' },
        { page: 'notFound', section: 'pageContent', fieldKey: 'buttonLabel', valueEn: 'Go home', valueBn: 'মূল পাতায় ফিরে যান' },
      ],
    })

    // ===== GALLERY =====
    console.log('Seeding gallery items...')
    await prisma.galleryItem.createMany({
      data: [
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210226/heritage-of-hope/gallery/gallery_learning.webp', publicId: 'gallery-learning', category: 'Education', altEn: 'Learning in Kishalaya', altBn: 'কিশলয়ে পাঠদান', sortOrder: 0 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210228/heritage-of-hope/gallery/gallery_health.webp', publicId: 'gallery-health', category: 'Healthcare', altEn: 'Free health camp', altBn: 'বিনামূল্যের স্বাস্থ্য শিবির', sortOrder: 1 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210229/heritage-of-hope/gallery/gallery_winter.webp', publicId: 'gallery-winter', category: 'Welfare', altEn: 'Winter distribution', altBn: 'শীতবস্ত্র পৌঁছে দেওয়া', sortOrder: 2 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210230/heritage-of-hope/gallery/gallery_reg.webp', publicId: 'gallery-reg', category: 'Education', altEn: 'Notebook distribution day', altBn: 'খাতা বিতরণের দিন', sortOrder: 3 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210232/heritage-of-hope/gallery/gallery_blood.webp', publicId: 'gallery-blood', category: 'Healthcare', altEn: 'Blood donation drive', altBn: 'রক্তদান কর্মসূচি', sortOrder: 4 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210233/heritage-of-hope/gallery/gallery_monsoon.webp', publicId: 'gallery-monsoon', category: 'Welfare', altEn: 'Monsoon relief', altBn: 'বর্ষাকালীন সহায়তা', sortOrder: 5 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210235/heritage-of-hope/gallery/gallery_feast.webp', publicId: 'gallery-feast', category: 'Welfare', altEn: 'Community feast by the river', altBn: 'নদীর ধারে একসাথে খাওয়া', sortOrder: 6 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210238/heritage-of-hope/gallery/gallery_study.webp', publicId: 'gallery-study', category: 'Education', altEn: 'Students reading at Kishalaya', altBn: 'কিশলয়ে শিক্ষার্থীদের পঠনপাঠন', sortOrder: 7 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210239/heritage-of-hope/gallery/gallery_mothers.webp', publicId: 'gallery-mothers', category: 'Welfare', altEn: 'Sarees for mothers — Durga Puja', altBn: 'মায়েদের জন্য শাড়ি — দুর্গাপূজা', sortOrder: 8 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210242/heritage-of-hope/gallery/gallery_puja.webp', publicId: 'gallery-puja', category: 'Welfare', altEn: 'Durga Puja clothes for children', altBn: 'শিশুদের জন্য পূজার নতুন জামা', sortOrder: 9 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210243/heritage-of-hope/gallery/gallery_checkup.webp', publicId: 'gallery-checkup', category: 'Healthcare', altEn: 'Pre-donation health checkup', altBn: 'রক্ত দেওয়ার আগে স্বাস্থ্য পরীক্ষা', sortOrder: 10 },
        { url: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210244/heritage-of-hope/gallery/gallery_joy.webp', publicId: 'gallery-joy', category: 'Welfare', altEn: 'Children celebrating together', altBn: 'শিশুদের আনন্দ উদযাপন', sortOrder: 11 },
      ],
    })

    // ===== DOCUMENTS =====
    console.log('Seeding documents...')
    await prisma.document.createMany({
      data: [
        { titleEn: 'Trust Registration Certificate', titleBn: 'ট্রাস্ট নিবন্ধন সার্টিফিকেট', pdfUrl: 'https://res.cloudinary.com/dsa6xl7wt/raw/upload/v1779010554/heritage-of-hope/documents/trust-registration-certificate', previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210282/heritage-of-hope/docs/thumbs/trust-registration-certificate.png', date: new Date('2024-05-18'), descriptionEn: 'Official trust registration deed (Deed No. IV-190200986/2024)', descriptionBn: 'ট্রাস্ট নিবন্ধন দলিল (ডিড নং IV-190200986/2024)', sortOrder: 0 },
        { titleEn: 'NGO DARPAN (NITI AAYOG)', titleBn: null, pdfUrl: 'https://res.cloudinary.com/dsa6xl7wt/raw/upload/v1779010559/heritage-of-hope/documents/ngo-darpan-niti-ayog', previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210276/heritage-of-hope/docs/thumbs/ngo-darpan-niti-ayog.png', date: new Date('2024-01-01'), descriptionEn: 'NGO Darpan listing (NITI Aayog) — primary registration entry', descriptionBn: null, sortOrder: 1 },
        { titleEn: '12A Certificate (provisional)', titleBn: '১২এ শংসাপত্র (অস্থায়ী)', pdfUrl: 'https://res.cloudinary.com/dsa6xl7wt/raw/upload/v1779010561/heritage-of-hope/documents/hhp-12a', previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210274/heritage-of-hope/docs/thumbs/hhp-12a.png', date: new Date('2026-04-01'), descriptionEn: 'Provisional 12A registration (income tax exemption)', descriptionBn: 'অস্থায়ী ১২এ নিবন্ধন (আয়কর ছাড়)', sortOrder: 2 },
        { titleEn: '80G Certificate (provisional)', titleBn: '৮০জি শংসাপত্র (অস্থায়ী)', pdfUrl: 'https://res.cloudinary.com/dsa6xl7wt/raw/upload/v1779010564/heritage-of-hope/documents/hhp-80g', previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210275/heritage-of-hope/docs/thumbs/hhp-80g.png', date: new Date('2026-04-01'), descriptionEn: 'Provisional 80G — donor tax deduction eligibility', descriptionBn: 'অস্থায়ী ৮০জি — দাতার কর ছাড়ের যোগ্যতা', sortOrder: 3 },
        { titleEn: 'MCA CSR Registration (CSR-1)', titleBn: null, pdfUrl: 'https://res.cloudinary.com/dsa6xl7wt/raw/upload/v1779010568/heritage-of-hope/documents/csr-1-hhf', previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210271/heritage-of-hope/docs/thumbs/csr-1-hhf.png', date: new Date('2024-01-01'), descriptionEn: 'MCA confirmation for CSR-funded activities', descriptionBn: null, sortOrder: 4 },
        { titleEn: 'Certificates & Awards', titleBn: 'শংসাপত্র ও পুরস্কার', pdfUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210263/heritage-of-hope/documents/gratitude-certificate.jpg', previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210273/heritage-of-hope/docs/thumbs/gratitude-certificate.jpg', date: new Date('2024-07-28'), descriptionEn: 'Recognition certificate from Thalassemic Guardians Association', descriptionBn: 'থ্যালাসেমিক গার্ডিয়ান্স এসোসিয়েশন থেকে সম্মাননাপত্র', sortOrder: 5 },
      ],
    })

    // ===== TEAM MEMBERS =====
    console.log('Seeding team members...')
    await prisma.teamMember.createMany({
      data: [
        { name: 'Founder Team', roleEn: 'Community coordination and field programs', roleBn: 'জনসংযোগ ও মানুষের কাছে গিয়ে কাজ', photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210247/heritage-of-hope/team/team_member.webp', photoPublicId: 'team_member', sortOrder: 0 },
        { name: 'Program Support', roleEn: 'Planning, logistics and volunteer support', roleBn: 'পরিকল্পনা ও স্বেচ্ছাসেবকদের সামলানো', photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210251/heritage-of-hope/team/team_member_2.webp', photoPublicId: 'team_member_2', sortOrder: 1 },
        { name: 'Field Volunteers', roleEn: 'Direct service delivery and follow-up', roleBn: 'সরাসরি সেবা পৌঁছে দেওয়া ও খোঁজখবর রাখা', photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210255/heritage-of-hope/team/team_member_3.webp', photoPublicId: 'team_member_3', sortOrder: 2 },
      ],
    })

    // ===== FUND ALLOCATION =====
    console.log('Seeding fund allocation...')
    await prisma.fundAllocation.createMany({
      data: [
        { categoryEn: 'Education', categoryBn: 'শিক্ষা', percentage: 45, sortOrder: 0 },
        { categoryEn: 'Healthcare', categoryBn: 'স্বাস্থ্য', percentage: 25, sortOrder: 1 },
        { categoryEn: 'Relief drives', categoryBn: 'মৌসুমি কল্যাণ সহায়তা', percentage: 20, sortOrder: 2 },
        { categoryEn: 'Operations', categoryBn: 'পরিচালনা ব্যয়', percentage: 10, sortOrder: 3 },
      ],
    })

    // ===== PARTNERS =====
    console.log('Seeding partners...')
    await prisma.partner.createMany({
      data: [
        { name: 'OCWE', sortOrder: 0 },
        { name: 'B.P. Poddar Hospital', sortOrder: 1 },
        { name: 'Thalassaemic Guardians Association', sortOrder: 2 },
      ],
    })

    // ===== PROGRAMS =====
    console.log('Seeding programs...')
    await prisma.program.createMany({
      data: [
        { slug: 'kishalaya-pathsala', imageUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', imagePublicId: 'pathsala', categoryEn: 'Education', categoryBn: 'শিক্ষা', titleEn: 'Kishalaya Pathsala', titleBn: 'কিশলয় পাঠশালা', descriptionEn: 'Community learning classes and study support for children in Kankandighi.', descriptionBn: 'কঙ্কনদীঘির বাচ্চাদের জন্য পাড়ার পড়াশোনার ক্লাস আর সাহায্য।', highlightEn: 'Foundational learning', highlightBn: 'শুরু থেকে শেখা', sortOrder: 0 },
        { slug: 'health-camps', imageUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp', imagePublicId: 'health_camp', categoryEn: 'Healthcare', categoryBn: 'স্বাস্থ্য', titleEn: 'Free Health Camps', titleBn: 'বিনামূল্যের স্বাস্থ্য শিবির', descriptionEn: 'Basic checkups, consultations, and referral help for families and children.', descriptionBn: 'পরিবার আর বাচ্চাদের জন্য বেসিক চেকআপ, পরামর্শ আর রেফারেল হেল্প।', highlightEn: 'Community first aid', highlightBn: 'প্রাথমিক স্বাস্থ্যসেবা', sortOrder: 1 },
        { slug: 'blood-donation', imageUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp', imagePublicId: 'blood_donation', categoryEn: 'Healthcare', categoryBn: 'স্বাস্থ্য', titleEn: 'Blood Donation Drives', titleBn: 'রক্তদান উদ্যোগ', descriptionEn: 'Volunteer blood donation for thalassemia support and emergency care.', descriptionBn: 'থ্যালাসেমিয়ার বাচ্চা আর জরুরি চিকিৎসার কাজে স্বেচ্ছায় রক্তদান।', highlightEn: 'Life-saving action', highlightBn: 'জীবন বাঁচানোর উদ্যোগ', sortOrder: 2 },
        { slug: 'winter-programme', imageUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp', imagePublicId: 'winter_prog', categoryEn: 'Welfare', categoryBn: 'কল্যাণ', titleEn: 'Winter Programme', titleBn: 'শীতকালীন কর্মসূচি', descriptionEn: 'Winter clothing, sweaters, and school bags for children in need.', descriptionBn: 'যেসব শিশুদের প্রয়োজন, তাদের জন্য শীতের পোশাক, সোয়েটার ও স্কুলব্যাগ।', highlightEn: 'Seasonal support', highlightBn: 'মৌসুমি সহায়তা', sortOrder: 3 },
        { slug: 'monsoon-relief', imageUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp', imagePublicId: 'monsoon', categoryEn: 'Welfare', categoryBn: 'কল্যাণ', titleEn: 'Monsoon Relief', titleBn: 'বর্ষাকালীন সহায়তা', descriptionEn: 'Raincoats, umbrellas, and essentials to keep school access steady.', descriptionBn: 'স্কুলে আসা-যাওয়া সহজ রাখতে রেনকোট, ছাতা আর দরকারি জিনিস দেওয়া।', highlightEn: 'Education without interruption', highlightBn: 'বিঘ্নহীন শিক্ষা', sortOrder: 4 },
        { slug: 'bornporichoy', imageUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210217/heritage-of-hope/heroes/bornporichoy.webp', imagePublicId: 'bornporichoy', categoryEn: 'Education', categoryBn: 'শিক্ষা', titleEn: 'Bornoporichoy', titleBn: 'বর্ণপরিচয়', descriptionEn: 'Reading and writing sessions for young learners to build foundational literacy.', descriptionBn: 'ছোটদের জন্য পড়া-লেখার ক্লাস, ভিত্তি গড়ে তোলার জন্য।', highlightEn: 'Early literacy', highlightBn: 'শিক্ষার শুরু', sortOrder: 5 },
      ],
    })

    // ===== ACTIVITY POSTS (Facebook posts) =====
    console.log('Seeding activity posts...')
    await prisma.activityPost.createMany({
      data: [
        {
          date: new Date('2026-01-04'),
          titleEn: 'Winter Program 2026',
          titleBn: 'শীতকালীন কর্মসূচি ২০২৬',
          bodyEn: 'Warm clothes and school bags were distributed before the new term began.',
          bodyBn: 'নতুন সেশন শুরুর আগে শিশুদের গরম জামা ও স্কুল ব্যাগ দেওয়া হয়।',
          photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp',
          photoPublicId: 'winter_prog',
          sortOrder: 0,
        },
        {
          date: new Date('2025-09-14'),
          titleEn: 'Durga Puja Gift Drive',
          titleBn: 'দুর্গাপূজা উপহার উদ্যোগ',
          bodyEn: 'With OCWE we distributed clothes, sarees, and sheets before Durga Puja.',
          bodyBn: 'OCWE-এর সহযোগিতায় দুর্গাপূজার আগে জামা, শাড়ি ও চাদর বিতরণ করা হয়।',
          photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210242/heritage-of-hope/gallery/gallery_puja.webp',
          photoPublicId: 'gallery-puja',
          sortOrder: 1,
        },
        {
          date: new Date('2025-07-13'),
          titleEn: 'Monsoon Relief Support',
          titleBn: 'বর্ষার সহায়তা',
          bodyEn: 'Raincoats and umbrellas helped children and families reach class in rain.',
          bodyBn: 'বৃষ্টিতেও ক্লাসে আসতে শিশু ও পরিবারকে রেনকোট ও ছাতা দেওয়া হয়।',
          photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp',
          photoPublicId: 'monsoon',
          sortOrder: 2,
        },
        {
          date: new Date('2025-04-13'),
          titleEn: 'Free Health Camp',
          titleBn: 'বিনামূল্যের স্বাস্থ্য শিবির',
          bodyEn: 'Free heart and sugar checkups were held with medical guidance support.',
          bodyBn: 'বিনামূল্যে হার্ট ও সুগার পরীক্ষা এবং চিকিৎসা পরামর্শ দেওয়া হয়।',
          photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp',
          photoPublicId: 'health_camp',
          sortOrder: 3,
        },
        {
          date: new Date('2024-12-22'),
          titleEn: 'Winter Clothing Distribution',
          titleBn: 'শীতবস্ত্র বিতরণ',
          bodyEn: 'Sweaters and warm shawls were shared with children and mothers.',
          bodyBn: 'শিশু ও মায়েদের মধ্যে সোয়েটার ও গরম শাল বিতরণ করা হয়।',
          photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210229/heritage-of-hope/gallery/gallery_winter.webp',
          photoPublicId: 'gallery-winter',
          sortOrder: 4,
        },
        {
          date: new Date('2024-09-01'),
          titleEn: 'Kishalaya Pathsala Launch',
          titleBn: 'কিশলয় পাঠশালার সূচনা',
          bodyEn: 'Our new learning space launched in Kankandighi with local support.',
          bodyBn: 'স্থানীয় সহযোগিতায় কঙ্কনদীঘিতে নতুন পাঠশালার সূচনা হয়।',
          photoUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp',
          photoPublicId: 'pathsala',
          sortOrder: 5,
        },
      ],
    })

    // ===== ADMIN USER =====
    console.log('Seeding admin user...')
    const hashedPassword = await bcrypt.hash('7in9GOQMbXdwZnwm', 12)

        email: 'heritageofhopefoundation@gmail.com',

    console.log('   Email: heritageofhopefoundation@gmail.com')
    console.log('   Password: 7in9GOQMbXdwZnwm')
    console.log('\n⚠️  Change this password immediately!\n')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
