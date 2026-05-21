/**
 * Static content fallbacks for the API.
 * These serve as defaults when database records are missing.
 * This file contains no external package dependencies and is safe for deployment.
 */

export const navItems = [
  { to: '/', fieldKey: 'home', label: { en: 'Home', bn: 'হোম' } },
  { to: '/about', fieldKey: 'about', label: { en: 'About', bn: 'আমাদের কথা' } },
  { to: '/our-work', fieldKey: 'ourWork', label: { en: 'Our Work', bn: 'আমাদের কাজ' } },
  { to: '/impact', fieldKey: 'impact', label: { en: 'Impact', bn: 'ফলাফল' } },
  { to: '/gallery', fieldKey: 'gallery', label: { en: 'Gallery', bn: 'ছবিঘর' } },
  { to: '/get-involved', fieldKey: 'getInvolved', label: { en: 'Get Involved', bn: 'সাথে থাকুন' } },
  { to: '/contact', fieldKey: 'contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
]

export const contactDetails = {
  phone: '+91 98765 43210',
  email: 'heritageofhopefoundation@gmail.com',
  address: 'Sukantapally, Subhas Gram, 700147, South 24 Pgs, WB, IN',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61559891799273',
}

export const facebookPosts = [
  {
    date: '04 Jan 2026',
    title: { en: 'Winter Program 2026', bn: 'শীতকালীন কর্মসূচি ২০২৬' },
    excerpt: { en: 'Warm clothes and school bags were distributed before the new term began.', bn: 'নতুন সেশন শুরুর আগে শিশুদের গরম জামা ও স্কুল ব্যাগ দেওয়া হয়।' },
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp',
  },
  {
    date: '14 Sep 2025',
    title: { en: 'Durga Puja Gift Drive', bn: 'দুর্গাপূজা উপহার উদ্যোগ' },
    excerpt: { en: 'With OCWE we distributed clothes, sarees, and sheets before Durga Puja.', bn: 'OCWE-এর সহযোগিতায় দুর্গাপূজার আগে জামা, শাড়ি ও চাদর বিতরণ করা হয়।' },
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210242/heritage-of-hope/gallery/gallery_puja.webp',
  },
  {
    date: '13 Jul 2025',
    title: { en: 'Monsoon Relief Support', bn: 'বর্ষার সহায়তা' },
    excerpt: { en: 'Raincoats and umbrellas helped children and families reach class in rain.', bn: 'বৃষ্টিতেও ক্লাসে আসতে শিশু ও পরিবারকে রেনকোট ও ছাতা দেওয়া হয়।' },
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp',
  },
  {
    date: '13 Apr 2025',
    title: { en: 'Free Health Camp', bn: 'বিনামূল্যের স্বাস্থ্য শিবির' },
    excerpt: { en: 'Free heart and sugar checkups were held with medical guidance support.', bn: 'বিনামূল্যে হার্ট ও সুগার পরীক্ষা এবং চিকিৎসা পরামর্শ দেওয়া হয়।' },
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp',
  },
  {
    date: '22 Dec 2024',
    title: { en: 'Winter Clothing Distribution', bn: 'শীতবস্ত্র বিতরণ' },
    excerpt: { en: 'Sweaters and warm shawls were shared with children and mothers.', bn: 'শিশু ও মায়েদের মধ্যে সোয়েটার ও গরম শাল বিতরণ করা হয়।' },
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210229/heritage-of-hope/gallery/gallery_winter.webp',
  },
  {
    date: '01 Sep 2024',
    title: { en: 'Kishalaya Pathsala Launch', bn: 'কিশলয় পাঠশালার সূচনা' },
    excerpt: { en: 'Our new learning space launched in Kankandighi with local support.', bn: 'স্থানীয় সহযোগিতায় কঙ্কনদীঘিতে নতুন পাঠশালার সূচনা হয়।' },
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp',
  },
]

export const impactMetrics = [
  { value: '200+', label: { en: 'children supported', bn: 'শিশুর কাছে পৌঁছানো হয়েছে' } },
  { value: '15+', label: { en: 'health & education drives', bn: 'স্বাস্থ্য ও শিক্ষা উদ্যোগ' } },
  { value: '3+', label: { en: 'active partner organizations', bn: 'সক্রিয় সহযোগী সংস্থা' } },
  { value: '5+', label: { en: 'communities served', bn: 'উপকৃত গ্রাম/এলাকা' } },
]

export const showcaseImages = {
  home: [
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', label: { en: 'Learning Space', bn: 'শিক্ষা কেন্দ্র' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp', label: { en: 'Health Camp', bn: 'স্বাস্থ্য শিবির' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp', label: { en: 'Blood Donation', bn: 'রক্তদান' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp', label: { en: 'Winter Program', bn: 'শীতকালীন কর্মসূচি' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp', label: { en: 'Monsoon Relief', bn: 'বর্ষা সহায়তা' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210217/heritage-of-hope/heroes/bornporichoy.webp', label: { en: 'Literacy Sessions', bn: 'সাক্ষরতা কর্মসূচি' } },
  ],
  about: [
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210247/heritage-of-hope/team/team_member.webp', label: { en: 'Our Team', bn: 'আমাদের দল' } },
  ],
  gallery: [
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', label: { en: 'Learning Centers', bn: 'শিক্ষা কেন্দ্র' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp', label: { en: 'Health Initiatives', bn: 'স্বাস্থ্য কর্মসূচি' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp', label: { en: 'Community Support', bn: 'সম্প্রদায় সেবা' } },
  ],
  contact: [
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210229/heritage-of-hope/gallery/gallery_winter.webp', label: { en: 'Children receiving winter support', bn: 'শিশুদের হাতে শীতের পোশাক' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210228/heritage-of-hope/gallery/gallery_health.webp', label: { en: 'Health camp participation', bn: 'স্বাস্থ্য শিবিরে অংশগ্রহণ' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210235/heritage-of-hope/gallery/gallery_mothers.webp', label: { en: 'Community registration and outreach', bn: 'মানুষের পাশে, মানুষের সাথে' } },
    { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210220/heritage-of-hope/registration/reg_cert.webp', label: { en: 'Registration certificate', bn: 'নিবন্ধন সনদ' } },
  ],
}

export const documents = [
  {
    titleEn: '12A Certificate',
    titleBn: '১২এ শংসাপত্র',
    date: '2024-03-15',
    descriptionEn: 'Tax exemption certificate under section 12A',
    descriptionBn: 'ধারা ১২এ অনুযায়ী ট্যাক্স ছাড় সার্টিফিকেট',
    pdfUrl: '#',
    previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210274/heritage-of-hope/docs/thumbs/hhp-12a.png',
  },
  {
    titleEn: '80G Certificate',
    titleBn: '৮০জি শংসাপত্র',
    date: '2024-03-15',
    descriptionEn: 'Donation deduction certificate under section 80G',
    descriptionBn: 'ধারা ৮০জি অনুযায়ী দান ছাড়ের শংসাপত্র',
    pdfUrl: '#',
    previewImgUrl: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210275/heritage-of-hope/docs/thumbs/hhp-80g.png',
  },
]

export const ourWorkShowcase = [
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp', label: { en: 'Kishalaya Pathsala', bn: 'কিশলয় পাঠশালা' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp', label: { en: 'Free Health Camps', bn: 'বিনামূল্যের স্বাস্থ্য শিবির' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp', label: { en: 'Blood Donation Drives', bn: 'রক্তদান উদ্যোগ' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp', label: { en: 'Winter Programme', bn: 'শীতকালীন কর্মসূচি' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp', label: { en: 'Monsoon Relief', bn: 'বর্ষাকালীন সহায়তা' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210217/heritage-of-hope/heroes/bornporichoy.webp', label: { en: 'Bornporichoy', bn: 'বর্ণপরিচয়' } },
]

export const teamMembers = [
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210247/heritage-of-hope/team/team_member.webp', name: { en: 'Founder Team', bn: 'প্রতিষ্ঠাতা সদস্য' }, role: { en: 'Community coordination and field programs', bn: 'জনসংযোগ ও মানুষের কাছে গিয়ে কাজ' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210251/heritage-of-hope/team/team_member_2.webp', name: { en: 'Program Support', bn: 'কর্মসূচি সহায়তা' }, role: { en: 'Planning, logistics and volunteer support', bn: 'পরিকল্পনা ও স্বেচ্ছাসেবকদের সামলানো' } },
  { image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210255/heritage-of-hope/team/team_member_3.webp', name: { en: 'Field Volunteers', bn: 'সরাসরি সেবার স্বেচ্ছাসেবক' }, role: { en: 'Direct service delivery and follow-up', bn: 'সরাসরি সেবা পৌঁছে দেওয়া ও খোঁজখবর রাখা' } },
]

export const featuredPrograms = [
  {
    slug: 'kishalaya-pathsala',
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210209/heritage-of-hope/heroes/pathsala.webp',
    category: { en: 'Education', bn: 'শিক্ষা' },
    title: { en: 'Kishalaya Pathsala', bn: 'কিশলয় পাঠশালা' },
    description: { en: 'Community learning classes and study support for children in Kankandighi.', bn: 'কঙ্কনদীঘির বাচ্চাদের জন্য পাড়ার পড়াশোনার ক্লাস আর সাহায্য।' },
    highlight: { en: 'Foundational learning', bn: 'শুরু থেকে শেখা' },
  },
  {
    slug: 'health-camps',
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210211/heritage-of-hope/heroes/health_camp.webp',
    category: { en: 'Healthcare', bn: 'স্বাস্থ্য' },
    title: { en: 'Free Health Camps', bn: 'বিনামূল্যের স্বাস্থ্য শিবির' },
    description: { en: 'Basic checkups, consultations, and referral help for families and children.', bn: 'পরিবার আর বাচ্চাদের জন্য বেসিক চেকআপ, পরামর্শ আর রেফারেল হেল্প।' },
    highlight: { en: 'Community first aid', bn: 'প্রাথমিক স্বাস্থ্যসেবা' },
  },
  {
    slug: 'blood-donation',
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210213/heritage-of-hope/heroes/blood_donation.webp',
    category: { en: 'Healthcare', bn: 'স্বাস্থ্য' },
    title: { en: 'Blood Donation Drives', bn: 'রক্তদান উদ্যোগ' },
    description: { en: 'Volunteer blood donation for thalassemia support and emergency care.', bn: 'থ্যালাসেমিয়ার বাচ্চা আর জরুরি চিকিৎসার কাজে স্বেচ্ছায় রক্তদান।' },
    highlight: { en: 'Life-saving action', bn: 'জীবন বাঁচানোর উদ্যোগ' },
  },
  {
    slug: 'winter-programme',
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210214/heritage-of-hope/heroes/winter_prog.webp',
    category: { en: 'Welfare', bn: 'কল্যাণ' },
    title: { en: 'Winter Programme', bn: 'শীতকালীন কর্মসূচি' },
    description: { en: 'Winter clothing, sweaters, and school bags for children in need.', bn: 'যেসব শিশুদের প্রয়োজন, তাদের জন্য শীতের পোশাক, সোয়েটার ও স্কুলব্যাগ।' },
    highlight: { en: 'Seasonal support', bn: 'মৌসুমি সহায়তা' },
  },
  {
    slug: 'monsoon-relief',
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210216/heritage-of-hope/heroes/monsoon.webp',
    category: { en: 'Welfare', bn: 'কল্যাণ' },
    title: { en: 'Monsoon Relief', bn: 'বর্ষাকালীন সহায়তা' },
    description: { en: 'Raincoats, umbrellas, and essentials to keep school access steady.', bn: 'স্কুলে আসা-যাওয়া সহজ রাখতে রেনকোট, ছাতা আর দরকারি জিনিস দেওয়া।' },
    highlight: { en: 'Education without interruption', bn: 'বিঘ্নহীন শিক্ষা' },
  },
  {
    slug: 'bornporichoy',
    image: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210217/heritage-of-hope/heroes/bornporichoy.webp',
    category: { en: 'Education', bn: 'শিক্ষা' },
    title: { en: 'Bornoporichoy', bn: 'বর্ণপরিচয়' },
    description: { en: 'Reading and writing sessions for young learners to build foundational literacy.', bn: 'ছোটদের জন্য পড়া-লেখার ক্লাস, ভিত্তি গড়ে তোলার জন্য।' },
    highlight: { en: 'Early literacy', bn: 'শিক্ষার শুরু' },
  },
]
