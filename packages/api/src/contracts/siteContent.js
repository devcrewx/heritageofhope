/**
 * Canonical shape for GET /api/content
 *
 * Every key here must exist in the API response.
 * Strings use { en: '', bn: '' } for bilingual.
 * Scalar strings are monolingual (phone, email, URLs).
 */

import { text } from './text.js'

export const CONTRACT_VERSION = '1.0.0'

export const siteContentContract = {
  navItems: [
    { to: '/', label: text('Home', 'হোম') },
    { to: '/about', label: text('About', 'আমাদের কথা') },
    { to: '/our-work', label: text('Our Work', 'আমাদের কাজ') },
    { to: '/impact', label: text('Impact', 'ফলাফল') },
    { to: '/gallery', label: text('Gallery', 'ছবিঘর') },
    { to: '/get-involved', label: text('Get Involved', 'সাথে থাকুন') },
    { to: '/contact', label: text('Contact', 'যোগাযোগ') },
  ],
  siteMeta: {
    orgName: '',
    navSubtitle: text('', ''),
    logoUrl: '',
    phone: '',
    email: '',
    address: text('', ''),
    facebookUrl: '',
    footerMission: text('', ''),
    registeredBadge: text('', ''),
    estYear: '',
    donateButtonLabel: text('Donate Now', 'সহযোগিতার হাত বাড়িয়ে দিন'),
    facebookLabel: text('Follow us on Facebook', 'ফেসবুকে আমাদের সঙ্গে থাকুন'),
    hamburgerAriaLabel: text('Open navigation', 'মেনু খুলুন'),
    navAriaLabel: text('Primary navigation', 'প্রধান মেনু'),
  },
    home: {
    hero: {
      eyebrow: text('', ''),
      headline: text('', ''),
      intro: text('', ''),
      heroFootnote: text('', ''),
      heroImage: '',
      regCertThumb: '',
      figcaption: text('', ''),
      ctaPrimaryLabel: text('Support a Program', 'সহায়তা করুন'),
      ctaSecondaryLabel: text('Explore Our Work', 'আমাদের কাজ দেখুন'),
      certCaption: text('Registration proof available on About page', 'নিবন্ধনের প্রমাণ "আমাদের কথা" পাতায়'),
    },
    trustBadges: [],
    pageContent: {
      statsLabel: text('', ''),
      statsHeading: text('', ''),
      pillarLabel: text('', ''),
      activityLabel: text('', ''),
      activityHeading: text('', ''),
      donationLabel: text('', ''),
    },
    impactMetrics: [],
    featuredPrograms: [],
    facebookPosts: [],
    showcaseImages: [],
    mission: {
      heading: text('', ''),
    },
    cta: {
      headline: text('', ''),
      body: text('', ''),
      buttonLabel: text('', ''),
    },
  },
  about: {
    hero: {
      pageTitle: text('', ''),
      intro: text('', ''),
      heroImage: '',
    },
    pageContent: {
      eyebrow: text('', ''),
      storyLabel: text('', ''),
      missionLabel: text('', ''),
      visionLabel: text('', ''),
      valuesLabel: text('', ''),
      valuesHeading: text('', ''),
      regLabel: text('', ''),
      regHeading: text('', ''),
      certLabel: text('', ''),
      partnersLabel: text('', ''),
      teamLabel: text('', ''),
      teamHeading: text('', ''),
      documentsLabel: text('', ''),
      documentsHeading: text('', ''),
    },
    story: {
      heading: text('', ''),
      body: text('', ''),
    },
    mission: text('', ''),
    vision: text('', ''),
    values: [],
    teamMembers: [],
    documents: [],
    partners: [],
    registration: {
      body: text('', ''),
      certImage: '',
    },
  },
  ourWork: {
    hero: {
      pageTitle: text('', ''),
      intro: text('', ''),
    },
    pageContent: {
      eyebrow: text('', ''),
      approachLabel: text('', ''),
      focusLabel: text('Focus areas', 'ফোকাস এরিয়া'),
      joinLabel: text('', ''),
    },
    focusTags: [],
    featuredPrograms: [],
    approach: {
      heading: text('', ''),
      steps: [],
    },
    joinBox: {
      body: text('', ''),
      buttonLabel: text('', ''),
    },
    showcaseImages: [],
  },
  impact: {
    hero: {
      pageTitle: text('', ''),
      subHeadline: text('', ''),
      promise: text('', ''),
    },
    pageContent: {
      eyebrow: text('', ''),
      promiseLabel: text('', ''),
      fundLabel: text('', ''),
      fundHeading: text('', ''),
      feedbackLabel: text('', ''),
      reportLabel: text('', ''),
    },
    impactMetrics: [],
    fundAllocation: [],
    testimonial: {
      quote: text('', ''),
    },
    annualReport: {
      body: text('', ''),
    },
  },
  gallery: {
    pageContent: {
      eyebrow: text('', ''),
      heading: text('', ''),
      intro: text('', ''),
      filterLabel: text('', ''),
      filterText: text('', ''),
      filterChipAll: text('All', 'সব'),
      filterChipEducation: text('Education', 'শিক্ষা'),
      filterChipHealthcare: text('Healthcare', 'স্বাস্থ্য'),
      filterChipWelfare: text('Welfare', 'কল্যাণ'),
      filterAriaLabel: text('Gallery categories', 'ছবির বিভাগ'),
    },
    items: [],
  },
  getInvolved: {
    hero: {
      pageTitle: text('', ''),
      intro: text('', ''),
    },
    pageContent: {
      eyebrow: text('', ''),
      donationLabel: text('', ''),
      donationHeading: text('', ''),
      paymentLabel: text('', ''),
      paymentHeading: text('', ''),
      volunteerLabel: text('', ''),
      volunteerHeading: text('', ''),
      volunteerFormLabel: text('', ''),
      volunteerFormHeading: text('', ''),
      partnerLabel: text('', ''),
      partnerHeading: text('', ''),
      partnerSubtitle: text('', ''),
      partnerFormLabel: text('', ''),
      partnerFormHeading: text('', ''),
      bankLabel: text('Bank details', 'ব্যাংক তথ্য'),
      chequeModalTitle: text('Specimen cheque', 'নমুনা চেক'),
      chequeButtonLabel: text('View specimen cheque', 'চেক দেখুন'),
    },
    bankDetails: {
      accountName: '',
      bankName: '',
      accountNumber: '',
      ifsc: '',
    },
    upiImage: '',
    upiDeepLink: '',
    donationTiers: [],
    volunteer: {
      heading: text('', ''),
      description: text('', ''),
      roles: [],
    },
    volunteerFormLabels: {
      nameLabel: text('Name', 'নাম'),
      emailLabel: text('Email', 'ইমেল'),
      phoneLabel: text('Phone', 'ফোন'),
      phoneValidation: text('Please enter a valid phone number', 'একটি বৈধ ফোন নম্বর দিন'),
      interestLabel: text('Area of interest', 'আগ্রহের ক্ষেত্র'),
      interestPlaceholder: text('Choose one', 'একটি নির্বাচন করুন'),
      availabilityLabel: text('Availability', 'সুযোগ'),
      availabilityPlaceholder: text('Choose one', 'একটি নির্বাচন করুন'),
      availabilityWeekends: text('Weekends', 'সপ্তাহান্তে'),
      availabilityWeekdays: text('Weekdays', 'সপ্তাহের দিন'),
      availabilityOccasional: text('Occasionally', 'মাঝে মাঝে'),
      messageLabel: text('Message', 'বার্তা'),
      submitLabel: text('Submit volunteer interest', 'স্বেচ্ছাসেবক আগ্রহ জমা দিন'),
      submittingLabel: text('Submitting...', 'জমা দেওয়া হচ্ছে...'),
      errorMessage: text('Failed to submit form. Please try again.', 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'),
    },
    partnerFormLabels: {
      orgNameLabel: text('Organization name', 'প্রতিষ্ঠানের নাম'),
      contactPersonLabel: text('Contact person', 'যোগাযোগকারী ব্যক্তি'),
      emailLabel: text('Email', 'ইমেল'),
      phoneLabel: text('Phone number', 'ফোন নম্বর'),
      phoneValidation: text('Please enter a valid phone number', 'একটি বৈধ ফোন নম্বর দিন'),
      partnershipTypeLabel: text('Type of partnership', 'অংশীদারিত্বের ধরন'),
      partnershipTypePlaceholder: text('Choose one', 'একটি নির্বাচন করুন'),
      partnershipTypeCsr: text('CSR', 'সিএসআর'),
      partnershipTypeHospital: text('Hospital / Medical', 'হাসপাতাল / মেডিকেল'),
      partnershipTypeInstitution: text('Institution / School', 'প্রতিষ্ঠান / স্কুল'),
      partnershipTypeOther: text('Other', 'অন্যান্য'),
      messageLabel: text('Message', 'বার্তা'),
      submitLabel: text('Submit partner inquiry', 'অংশীদার অনুসন্ধান জমা দিন'),
      submittingLabel: text('Submitting...', 'জমা দেওয়া হচ্ছে...'),
      errorMessage: text('Failed to submit form. Please try again.', 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'),
    },
    upiLabels: {
      buttonLabel: text('Pay via UPI app', 'UPI অ্যাপের মাধ্যমে পেমেন্ট করুন'),
      mobileHint: text('On mobile, this opens your installed UPI app directly.', 'মোবাইলে, এটি সরাসরি আপনার UPI অ্যাপ খুলবে।'),
      fallbackHint: text('If no UPI app opens on this device, please use the QR code above to complete payment.', 'যদি UPI অ্যাপ না খোলে, তাহলে QR কোড ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন।'),
      qrHint: text('Scan this official UPI QR code to donate. You can also use the bank details above for direct transfers. After donating, email us your UTR for a receipt.', 'দান করতে অফিসিয়াল UPI QR কোড স্ক্যান করুন। সরাসরি ব্যাংক ট্রান্সফারের জন্য উপরের ব্যাংক বিবরণ ব্যবহার করুন।'),
    },
    partnerSection: {
      heading: text('', ''),
      body: text('', ''),
      image: '',
    },
    specimenChequeImage: '',
  },
  contact: {
    pageTitle: text('', ''),
    intro: text('', ''),
    responseLabel: text('', ''),
    responseValue: text('', ''),
    formLabel: text('', ''),
    formHeading: text('', ''),
    phoneLabel: text('Phone', 'ফোন'),
    emailLabel: text('Email', 'ইমেল'),
    addressLabel: text('Address', 'ঠিকানা'),
    visitFacebookLabel: text('Visit Official Facebook Page \u2192', 'অফিসিয়াল ফেসবুক পেজ দেখুন \u2192'),
    mapTitle: text('Heritage of Hope Foundation location', 'হেরিটেজ অফ হোপ ফাউন্ডেশনের অবস্থান'),
    pageContent: {
      eyebrow: text('', ''),
      facebookLabel: text('', ''),
      facebookHeading: text('', ''),
    },
    mapEmbedUrl: '',
    formLabels: {
      nameLabel: text('Name', 'নাম'),
      namePlaceholder: text('Your name', 'আপনার নাম'),
      emailLabel: text('Email', 'ইমেল'),
      emailPlaceholder: text('you@example.com', ''),
      subjectLabel: text('Subject', 'বিষয়'),
      messageLabel: text('Message', 'বার্তা'),
      messagePlaceholder: text('Tell us how you want to help', ''),
      submitLabel: text('Send message', 'বার্তা পাঠান'),
      submittingLabel: text('Sending...', 'পাঠানো হচ্ছে...'),
      errorMessage: text('Failed to submit form. Please try again.', 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'),
    },
    mosaicImages: [],
    facebookPosts: [],
  },
  thankYou: {
    pageContent: {
      eyebrow: text('', ''),
      heading: text('', ''),
      body: text('', ''),
      buttonLabel: text('', ''),
    },
  },
  notFound: {
    pageContent: {
      eyebrow: text('', ''),
      heading: text('', ''),
      body: text('', ''),
      buttonLabel: text('', ''),
    },
  },
}

export const CONTRACT_PATHS = extractPaths(siteContentContract)

function extractPaths(obj, prefix = '') {
  const paths = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    paths.push(path)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      paths.push(...extractPaths(value, path))
    }
  }
  return paths.sort()
}

export function validateContract(response) {
  const errors = []
  const missing = CONTRACT_PATHS.filter((p) => {
    const val = p.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), response)
    return val === undefined
  })
  if (missing.length) {
    errors.push(`Missing keys: ${missing.join(', ')}`)
  }
  if (!response.navItems || !response.navItems.length) {
    errors.push('navItems missing or empty')
  }
  return {
    valid: errors.length === 0,
    errors,
    missingKeys: missing,
  }
}
