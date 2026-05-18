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

export const impactMetrics = [
  { value: '200+', label: { en: 'children supported', bn: 'শিশুর কাছে পৌঁছানো হয়েছে' } },
  { value: '15+', label: { en: 'health & education drives', bn: 'স্বাস্থ্য ও শিক্ষা উদ্যোগ' } },
  { value: '3+', label: { en: 'active partner organizations', bn: 'সক্রিয় সহযোগী সংস্থা' } },
  { value: '5+', label: { en: 'communities served', bn: 'উপকৃত গ্রাম/এলাকা' } },
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
  // Note: Programs are loaded from database at runtime
  // This empty array prevents legacy/ghost images from appearing as fallback
  // The actual programs are fetched and transformed from the database
]
