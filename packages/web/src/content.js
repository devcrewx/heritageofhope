export const text = (en, bn) => ({ en, bn })

export const resolve = (language, value) => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'object') {
    if ('en' in value || 'bn' in value) {
      const localized = value[language] ?? value.en ?? value.bn
      return typeof localized === 'string' || typeof localized === 'number' ? localized : ''
    }

    const firstRenderable = Object.values(value).find(
      (entry) => typeof entry === 'string' || typeof entry === 'number',
    )

    return firstRenderable ?? ''
  }

  return value
}

export const navItems = [
  { to: '/', label: text('Home', 'হোম') },
  { to: '/about', label: text('About', 'আমাদের কথা') },
  { to: '/our-work', label: text('Our Work', 'আমাদের কাজ') },
  { to: '/impact', label: text('Impact', 'ফলাফল') },
  { to: '/gallery', label: text('Gallery', 'ছবিঘর') },
  { to: '/get-involved', label: text('Get Involved', 'সাথে থাকুন') },
  { to: '/contact', label: text('Contact', 'যোগাযোগ') },
]

export const featuredPrograms = [
  {
    slug: 'kishalaya-pathsala',
    image: '/assets/pathsala.webp',
    category: text('Education', 'শিক্ষা'),
    title: text('Kishalaya Pathsala', 'কিশলয় পাঠশালা'),
    description: text(
      'Community learning classes and study support for children in Kankandighi.',
      'কঙ্কনদীঘির বাচ্চাদের জন্য পাড়ার পড়াশোনার ক্লাস আর সাহায্য।',
    ),
    highlight: text('Foundational learning', 'শুরু থেকে শেখা'),
  },
  {
    slug: 'health-camps',
    image: '/assets/health_camp.webp',
    category: text('Healthcare', 'স্বাস্থ্য'),
    title: text('Free Health Camps', 'বিনামূল্যের স্বাস্থ্য শিবির'),
    description: text(
      'Basic checkups, consultations, and referral help for families and children.',
      'পরিবার আর বাচ্চাদের জন্য বেসিক চেকআপ, পরামর্শ আর দরকার হলে অন্য জায়গায় পাঠানোর ব্যবস্থা।',
    ),
    highlight: text('Community first aid', 'প্রাথমিক স্বাস্থ্যসেবা'),
  },
  {
    slug: 'blood-donation',
    image: '/assets/blood_donation.webp',
    category: text('Healthcare', 'স্বাস্থ্য'),
    title: text('Blood Donation Drives', 'রক্তদান উদ্যোগ'),
    description: text(
      'Volunteer blood donation for thalassemia support and emergency care.',
      'থ্যালাসেমিয়ার বাচ্চা আর জরুরি চিকিৎসার কাজে স্বেচ্ছায় রক্তদান।',
    ),
    highlight: text('Life-saving action', 'জীবন বাঁচানোর উদ্যোগ'),
  },
  {
    slug: 'winter-programme',
    image: '/assets/winter_prog.webp',
    category: text('Welfare', 'কল্যাণ'),
    title: text('Winter Programme', 'শীতকালীন কর্মসূচি'),
    description: text(
      'Winter clothing, sweaters, and school bags for children in need.',
      'যেসব শিশুদের প্রয়োজন, তাদের জন্য শীতের পোশাক, সোয়েটার ও স্কুলব্যাগ।',
    ),
    highlight: text('Seasonal support', 'মৌসুমি সহায়তা'),
  },
  {
    slug: 'monsoon-relief',
    image: '/assets/monsoon.webp',
    category: text('Welfare', 'কল্যাণ'),
    title: text('Monsoon Relief', 'বর্ষাকালীন সহায়তা'),
    description: text(
      'Raincoats, umbrellas, and essentials to keep school access steady.',
      'স্কুলে আসা-যাওয়া সহজ রাখতে রেনকোট, ছাতা আর দরকারি জিনিস দেওয়া।',
    ),
    highlight: text('Education without interruption', 'বিঘ্নহীন শিক্ষা'),
  },
  {
    slug: 'bornporichoy',
    image: '/assets/bornporichoy.webp',
    category: text('Education', 'শিক্ষা'),
    title: text('Bornporichoy', 'বর্ণপরিচয়'),
    description: text(
      'Early literacy sessions for children who need extra learning support.',
      'যাদের একটু বেশি সাহায্য লাগে, তাদের জন্য পড়া-লেখা শেখার ক্লাস।',
    ),
    highlight: text('Reading support', 'পড়তে সাহায্য করা'),
  },
]

export const activityPosts = [
  {
    date: '04 Jan 2026',
    title: text('Winter Program 2026', 'শীতকালীন কর্মসূচি ২০২৬'),
    description: text(
      'Warm clothes and new school bags were distributed before the new school term started.',
      'নতুন স্কুল শুরু হওয়ার আগে শিশুদের হাতে গরম জামা ও নতুন স্কুল ব্যাগ তুলে দেওয়া হয়।',
    ),
    location: text('Kankandighi, Raidighi', 'কঙ্কনদীঘি, রাইদীঘি'),
  },
  {
    date: '14 Sep 2025',
    title: text('Durga Puja Dignity Drive', 'দুর্গাপূজা উপহার উদ্যোগ'),
    description: text(
      'Children received new clothes while mothers received sarees and household sheets.',
      'শিশুরা পেয়েছে নতুন জামা, মায়েরা পেয়েছে নতুন শাড়ি ও চাদর।',
    ),
    location: text('Kankandighi, Raidighi', 'কঙ্কনদীঘি, রাইদীঘি'),
  },
  {
    date: '13 Jul 2025',
    title: text('Monsoon Protection Initiative', 'বর্ষা সুরক্ষা উদ্যোগ'),
    description: text(
      'Raincoats and umbrellas helped families reach the learning space through the rainy season.',
      'রেনকোট ও ছাতা বর্ষাকালেও পরিবারগুলিকে শিক্ষাকেন্দ্রে পৌঁছাতে সাহায্য করেছে।',
    ),
    location: text('Kishalaya community', 'কিশলয় পরিবার'),
  },
]

export const facebookPosts = [
  {
    date: '04 Jan 2026',
    title: text('Winter Program 2026', 'শীতকালীন কর্মসূচি ২০২৬'),
    excerpt: text(
      'Warm clothes and school bags were distributed before the new term began.',
      'নতুন সেশন শুরুর আগে শিশুদের গরম জামা ও স্কুল ব্যাগ দেওয়া হয়।',
    ),
    image: '/assets/winter_prog.webp',
  },
  {
    date: '14 Sep 2025',
    title: text('Durga Puja Gift Drive', 'দুর্গাপূজা উপহার উদ্যোগ'),
    excerpt: text(
      'With OCWE we distributed clothes, sarees, and sheets before Durga Puja.',
      'OCWE-এর সহযোগিতায় দুর্গাপূজার আগে জামা, শাড়ি ও চাদর বিতরণ করা হয়।',
    ),
    image: '/assets/durga_puja.webp',
  },
  {
    date: '13 Jul 2025',
    title: text('Monsoon Relief Support', 'বর্ষার সহায়তা'),
    excerpt: text(
      'Raincoats and umbrellas helped children and families reach class in rain.',
      'বৃষ্টিতেও ক্লাসে আসতে শিশু ও পরিবারকে রেনকোট ও ছাতা দেওয়া হয়।',
    ),
    image: '/assets/monsoon.webp',
  },
  {
    date: '13 Apr 2025',
    title: text('Free Health Camp', 'বিনামূল্যের স্বাস্থ্য শিবির'),
    excerpt: text(
      'Free heart and sugar checkups were held with medical guidance support.',
      'বিনামূল্যে হার্ট ও সুগার পরীক্ষা এবং চিকিৎসা পরামর্শ দেওয়া হয়।',
    ),
    image: '/assets/health_camp.webp',
  },
  {
    date: '22 Dec 2024',
    title: text('Winter Clothing Distribution', 'শীতবস্ত্র বিতরণ'),
    excerpt: text(
      'Sweaters and warm shawls were shared with children and mothers.',
      'শিশু ও মায়েদের মধ্যে সোয়েটার ও গরম শাল বিতরণ করা হয়।',
    ),
    image: '/assets/winter_dist.webp',
  },
  {
    date: '01 Sep 2024',
    title: text('Kishalaya Pathsala Launch', 'কিশলয় পাঠশালার সূচনা'),
    excerpt: text(
      'Our new learning space launched in Kankandighi with local support.',
      'স্থানীয় সহযোগিতায় কঙ্কনদীঘিতে নতুন পাঠশালার সূচনা হয়।',
    ),
    image: '/assets/pathsala.webp',
  },
]

export const impactMetrics = [
  { value: '200+', label: text('children supported', 'শিশুর কাছে পৌঁছানো হয়েছে') },
  { value: '15+', label: text('health & education drives', 'স্বাস্থ্য ও শিক্ষা উদ্যোগ') },
  { value: '3+', label: text('active partner organizations', 'সক্রিয় সহযোগী সংস্থা') },
  { value: '5+', label: text('communities served', 'উপকৃত গ্রাম/এলাকা') },
]

export const fundAllocation = [
  { label: text('Education', 'শিক্ষা'), value: 45 },
  { label: text('Healthcare', 'স্বাস্থ্য'), value: 25 },
  { label: text('Relief drives', 'মৌসুমি কল্যাণ সহায়তা'), value: 20 },
  { label: text('Operations', 'পরিচালনা ব্যয়'), value: 10 },
]

export const galleryItems = [
  {
    category: text('Education', 'শিক্ষা'),
    title: text('Learning in Kishalaya', 'কিশলয়ে পাঠদান'),
    image: '/assets/gallery_learning.webp',
  },
  {
    category: text('Healthcare', 'স্বাস্থ্য'),
    title: text('Free health camp', 'বিনামূল্যের স্বাস্থ্য শিবির'),
    image: '/assets/gallery_health.webp',
  },
  {
    category: text('Welfare', 'কল্যাণ'),
    title: text('Winter distribution', 'শীতবস্ত্র পৌঁছে দেওয়া'),
    image: '/assets/gallery_winter.webp',
  },
  {
    category: text('Education', 'শিক্ষা'),
    title: text('Notebook distribution day', 'খাতা বিতরণের দিন'),
    image: '/assets/gallery_reg.webp',
  },
  {
    category: text('Healthcare', 'স্বাস্থ্য'),
    title: text('Blood donation drive', 'রক্তদান কর্মসূচি'),
    image: '/assets/gallery_blood.webp',
  },
  {
    category: text('Welfare', 'কল্যাণ'),
    title: text('Monsoon relief', 'বর্ষাকালীন সহায়তা'),
    image: '/assets/gallery_monsoon.webp',
  },
  {
    category: text('Welfare', 'কল্যাণ'),
    title: text('Community feast by the river', 'নদীর ধারে একসাথে খাওয়া'),
    image: '/assets/gallery_feast.webp',
  },
  {
    category: text('Education', 'শিক্ষা'),
    title: text('Students reading at Kishalaya', 'কিশলয়ে শিক্ষার্থীদের পঠনপাঠন'),
    image: '/assets/gallery_study.webp',
  },
  {
    category: text('Welfare', 'কল্যাণ'),
    title: text('Sarees for mothers — Durga Puja', 'মায়েদের জন্য শাড়ি — দুর্গাপূজা'),
    image: '/assets/gallery_mothers.webp',
  },
  {
    category: text('Welfare', 'কল্যাণ'),
    title: text('Durga Puja clothes for children', 'শিশুদের জন্য পূজার নতুন জামা'),
    image: '/assets/gallery_puja.webp',
  },
  {
    category: text('Healthcare', 'স্বাস্থ্য'),
    title: text('Pre-donation health checkup', 'রক্ত দেওয়ার আগে স্বাস্থ্য পরীক্ষা'),
    image: '/assets/gallery_checkup.webp',
  },
  {
    category: text('Welfare', 'কল্যাণ'),
    title: text('Children celebrating together', 'শিশুদের আনন্দ উদযাপন'),
    image: '/assets/gallery_joy.webp',
  },
]

export const showcaseImages = [
  {
    image: '/assets/showcase_winter.webp',
    label: text('Children receiving winter support', 'শিশুদের হাতে শীতের পোশাক'),
  },
  {
    image: '/assets/showcase_health.webp',
    label: text('Health camp participation', 'স্বাস্থ্য শিবিরে অংশগ্রহণ'),
  },
  {
    image: '/assets/showcase_comm.webp',
    label: text('Community registration and outreach', 'মানুষের পাশে, মানুষের সাথে'),
  },
  {
    image: '/assets/reg_cert.webp',
    label: text('Registration certificate', 'নিবন্ধন সনদ'),
  },
]

export const donationSteps = [
  {
    amount: '₹199',
    title: text('one child gets warm clothing', 'এক শিশুর জন্য শীতবস্ত্র'),
  },
  {
    amount: '₹500',
    title: text('learning materials for a month', 'এক মাসের শিক্ষা উপকরণ'),
  },
  {
    amount: '₹1000',
    title: text('health outreach support', 'স্বাস্থ্যসেবায় পাশে থাকা'),
  },
  {
    amount: '₹5000',
    title: text('sponsor a learning journey', 'একজনের শিক্ষার দায়িত্ব নিন'),
  },
]

export const volunteerRoles = [
  text('Teaching support', 'শিক্ষাদানে সহায়তা'),
  text('Event coordination', 'অনুষ্ঠান গোছানো'),
  text('Photography', 'ফটোগ্রাফি'),
  text('Social media', 'সামাজিক মাধ্যম'),
  text('Healthcare assistance', 'স্বাস্থ্যসেবায় সহায়তা'),
]

export const partners = [
  text('OCWE', 'OCWE'),
  text('B.P. Poddar Hospital', 'B.P. Poddar Hospital'),
  text('Thalassaemic Guardians Association', 'Thalassaemic Guardians Association'),
]

export const teamMembers = [
  {
    name: text('Founder Team', 'প্রতিষ্ঠাতা সদস্য'),
    role: text('Community coordination and field programs', 'জনসংযোগ ও মানুষের কাছে গিয়ে কাজ'),
    image: '/assets/team_member.webp',
  },
  {
    name: text('Program Support', 'কর্মসূচি সহায়তা'),
    role: text('Planning, logistics and volunteer support', 'পরিকল্পনা ও স্বেচ্ছাসেবকদের সামলানো'),
    image: '/assets/team_member_2.webp',
  },
  {
    name: text('Field Volunteers', 'সরাসরি সেবার স্বেচ্ছাসেবক'),
    role: text('Direct service delivery and follow-up', 'সরাসরি সেবা পৌঁছে দেওয়া ও খোঁজখবর রাখা'),
    image: '/assets/team_member_3.webp',
  },
]

export const contactDetails = {
  phone: '+91 084201 19790',
  email: 'heritageofhopefoundation@gmail.com',
  address: 'Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB, IN',
}

export const aboutDocuments = [
  { href: '/docs/trust-registration-certificate.pdf', thumb: '/docs/thumbs/trust-registration-certificate.png', title: text('Trust Registration Certificate', 'ট্রাস্ট নিবন্ধন সার্টিফিকেট'), meta: 'May 18, 2024', caption: text('Official trust registration deed (Deed No. IV-190200986/2024)', 'ট্রাস্ট নিবন্ধন দলিল (ডিড নং IV-190200986/2024)') },
  { href: '/docs/ngo-darpan-niti-ayog.pdf', thumb: '/docs/thumbs/ngo-darpan-niti-ayog.png', title: 'NGO DARPAN (NITI AAYOG)', meta: 'WB/2024/0426882', caption: 'NGO Darpan listing (NITI Aayog) — primary registration entry' },
  { href: '/docs/hhp-12a.pdf', thumb: '/docs/thumbs/hhp-12a.png', title: '12A (provisional)', meta: 'AY 2026–2029', caption: 'Provisional 12A registration (income tax exemption)' },
  { href: '/docs/hhp-80g.pdf', thumb: '/docs/thumbs/hhp-80g.png', title: '80G (provisional)', meta: 'AY 2026–2029', caption: 'Provisional 80G — donor tax deduction eligibility' },
  { href: '/docs/csr-1-hhf.pdf', thumb: '/docs/thumbs/csr-1-hhf.png', title: 'MCA CSR Registration (CSR-1)', meta: 'CSR00100906', caption: 'MCA confirmation for CSR-funded activities' },
  { href: '/docs/gratitude-certificate.jpeg', thumb: '/docs/thumbs/gratitude-certificate.jpeg', title: text('Certificates & awards', 'শংসাপত্র ও পুরস্কার'), meta: 'Jul 28, 2024', caption: text('Recognition certificate from Thalassemic Guardians Association', 'থ্যালাসেমিক গার্ডিয়ান্স এসোসিয়েশন থেকে সম্মাননাপত্র') },
]

export const siteContent = {
  navItems,
  siteMeta: {
    orgName: 'Heritage of Hope Foundation',
    navbarSubtitle: text('Registered NGO | West Bengal', 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ'),
    registeredBadge: text('Registered NGO', 'নিবন্ধিত সংস্থা'),
    estYear: 'Est. 2024',
    footerMission: text(
      'Children, women and communities in South 24 Parganas, West Bengal.',
      'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।',
    ),
  },
  home: {
    featuredPrograms,
    activityPosts,
    facebookPosts,
    impactMetrics,
    donationSteps,
    showcaseImages,
  },
  about: {
    teamMembers,
    partners,
    documents: aboutDocuments,
  },
  impact: {
    impactMetrics,
    fundAllocation,
  },
  gallery: {
    galleryItems,
    showcaseImages,
  },
  getInvolved: {
    donationSteps,
    volunteerRoles,
    contactDetails,
  },
  contact: {
    contactDetails,
    facebookPosts,
    showcaseImages,
  },
  ourWork: {
    featuredPrograms,
  },
}
