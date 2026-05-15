/**
 * Static content fallbacks for the API.
 * These serve as defaults when database records are missing.
 * This file contains no external package dependencies and is safe for deployment.
 */

export const navItems = [
  { to: '/', label: { en: 'Home', bn: 'হোম' } },
  { to: '/about', label: { en: 'About', bn: 'আমাদের কথা' } },
  { to: '/our-work', label: { en: 'Our Work', bn: 'আমাদের কাজ' } },
  { to: '/impact', label: { en: 'Impact', bn: 'ফলাফল' } },
  { to: '/gallery', label: { en: 'Gallery', bn: 'ছবিঘর' } },
  { to: '/get-involved', label: { en: 'Get Involved', bn: 'সাথে থাকুন' } },
  { to: '/contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
]

export const contactDetails = {
  phone: '+91 98765 43210',
  email: 'heritageofhopefoundation@gmail.com',
  address: 'Sukantapally, Subhas Gram, West Bengal 700147, India',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61559891799273',
}

export const facebookPosts = [
  {
    date: '15 May 2026',
    title: { en: 'Community Learning', bn: 'সম্প্রদায়ের শিক্ষা' },
    excerpt: { en: 'Supporting educational initiatives in underserved areas.', bn: 'প্রান্তিক এলাকায় শিক্ষা কর্মসূচি চালু করছি।' },
    image: '/assets/pathsala.webp',
  },
  {
    date: '10 May 2026',
    title: { en: 'Health Camps', bn: 'স্বাস্থ্য শিবির' },
    excerpt: { en: 'Free health checkups in local communities.', bn: 'স্থানীয় সম্প্রদায়ে স্বাস্থ্য পরীক্ষা।' },
    image: '/assets/health_camp.webp',
  },
  {
    date: '05 May 2026',
    title: { en: 'Winter Relief', bn: 'শীতকালীন সহায়তা' },
    excerpt: { en: 'Distributing warm clothes and essentials.', bn: 'শীতের পোশাক ও দৈনন্দিন জিনিস বিতরণ।' },
    image: '/assets/winter_prog.webp',
  },
]

export const showcaseImages = {
  home: [
    { image: '/assets/pathsala.webp', label: { en: 'Learning Space', bn: 'শিক্ষা কেন্দ্র' } },
    { image: '/assets/health_camp.webp', label: { en: 'Health Camp', bn: 'স্বাস্থ্য শিবির' } },
    { image: '/assets/blood_donation.webp', label: { en: 'Blood Donation', bn: 'রক্তদান' } },
    { image: '/assets/winter_prog.webp', label: { en: 'Winter Program', bn: 'শীতকালীন কর্মসূচি' } },
    { image: '/assets/monsoon.webp', label: { en: 'Monsoon Relief', bn: 'বর্ষা সহায়তা' } },
    { image: '/assets/bornporichoy.webp', label: { en: 'Literacy Sessions', bn: 'সাক্ষরতা কর্মসূচি' } },
  ],
  about: [
    { image: '/assets/team_photo.webp', label: { en: 'Our Team', bn: 'আমাদের দল' } },
  ],
  gallery: [
    { image: '/assets/pathsala.webp', label: { en: 'Learning Centers', bn: 'শিক্ষা কেন্দ্র' } },
    { image: '/assets/health_camp.webp', label: { en: 'Health Initiatives', bn: 'স্বাস্থ্য কর্মসূচি' } },
    { image: '/assets/blood_donation.webp', label: { en: 'Community Support', bn: 'সম্প্রদায় সেবা' } },
  ],
  contact: [
    { image: '/assets/pathsala.webp', label: { en: 'In Action', bn: 'সক্রিয় অবস্থায়' } },
    { image: '/assets/health_camp.webp', label: { en: 'Together', bn: 'একসাথে' } },
    { image: '/assets/winter_prog.webp', label: { en: 'Making a Difference', bn: 'পরিবর্তন আনছি' } },
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
    previewImgUrl: '/assets/documents/12a_preview.jpg',
  },
  {
    titleEn: '80G Certificate',
    titleBn: '৮০জি শংসাপত্র',
    date: '2024-03-15',
    descriptionEn: 'Donation deduction certificate under section 80G',
    descriptionBn: 'ধারা ৮০জি অনুযায়ী দান ছাড়ের শংসাপত্র',
    pdfUrl: '#',
    previewImgUrl: '/assets/documents/80g_preview.jpg',
  },
]

export const featuredPrograms = [
  {
    slug: 'kishalaya-pathsala',
    image: '/assets/pathsala.webp',
    category: { en: 'Education', bn: 'শিক্ষা' },
    title: { en: 'Kishalaya Pathsala', bn: 'কিশলয় পাঠশালা' },
    description: { en: 'Community learning classes and study support for children in Kankandighi.', bn: 'কঙ্কনদীঘির বাচ্চাদের জন্য পাড়ার পড়াশোনার ক্লাস আর সাহায্য।' },
    highlight: { en: 'Foundational learning', bn: 'শুরু থেকে শেখা' },
  },
  {
    slug: 'health-camps',
    image: '/assets/health_camp.webp',
    category: { en: 'Healthcare', bn: 'স্বাস্থ্য' },
    title: { en: 'Free Health Camps', bn: 'বিনামূল্যের স্বাস্থ্য শিবির' },
    description: { en: 'Basic checkups, consultations, and referral help for families and children.', bn: 'পরিবার আর বাচ্চাদের জন্য বেসিক চেকআপ, পরামর্শ আর দরকার হলে অন্য জায়গায় পাঠানোর ব্যবস্থা।' },
    highlight: { en: 'Community first aid', bn: 'প্রাথমিক স্বাস্থ্যসেবা' },
  },
  {
    slug: 'blood-donation',
    image: '/assets/blood_donation.webp',
    category: { en: 'Healthcare', bn: 'স্বাস্থ্য' },
    title: { en: 'Blood Donation Drives', bn: 'রক্তদান উদ্যোগ' },
    description: { en: 'Volunteer blood donation for thalassemia support and emergency care.', bn: 'থ্যালাসেমিয়ার বাচ্চা আর জরুরি চিকিৎসার কাজে স্বেচ্ছায় রক্তদান।' },
    highlight: { en: 'Life-saving action', bn: 'জীবন বাঁচানোর উদ্যোগ' },
  },
  {
    slug: 'winter-programme',
    image: '/assets/winter_prog.webp',
    category: { en: 'Welfare', bn: 'কল্যাণ' },
    title: { en: 'Winter Programme', bn: 'শীতকালীন কর্মসূচি' },
    description: { en: 'Winter clothing, sweaters, and school bags for children in need.', bn: 'যেসব শিশুদের প্রয়োজন, তাদের জন্য শীতের পোশাক, সোয়েটার ও স্কুলব্যাগ।' },
    highlight: { en: 'Seasonal support', bn: 'মৌসুমি সহায়তা' },
  },
  {
    slug: 'monsoon-relief',
    image: '/assets/monsoon.webp',
    category: { en: 'Welfare', bn: 'কল্যাণ' },
    title: { en: 'Monsoon Relief', bn: 'বর্ষাকালীন সহায়তা' },
    description: { en: 'Raincoats, umbrellas, and essentials to keep school access steady.', bn: 'স্কুলে আসা-যাওয়া সহজ রাখতে রেনকোট, ছাতা আর দরকারি জিনিস দেওয়া।' },
    highlight: { en: 'Education without interruption', bn: 'বিঘ্নহীন শিক্ষা' },
  },
  {
    slug: 'bornporichoy',
    image: '/assets/bornporichoy.webp',
    category: { en: 'Education', bn: 'শিক্ষা' },
    title: { en: 'Bornporichoy', bn: 'বর্ণপরিচয়' },
    description: { en: 'Early literacy sessions for children who need extra learning support.', bn: 'যাদের একটু বেশি সাহায্য লাগে, তাদের জন্য পড়া-লেখা শেখার ক্লাস।' },
    highlight: { en: 'Reading support', bn: 'পড়তে সাহায্য করা' },
  },
]
