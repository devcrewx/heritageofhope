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
  },
    home: {
    hero: {
      eyebrow: text('', ''),
      headline: text('', ''),
      intro: text('', ''),
      heroFootnote: text('', ''),
      heroImage: '',
      badge1: text('', ''),
      badge2: text('', ''),
      badge3: text('', ''),
      regCertThumb: '',
      figcaption: text('', ''),
    },
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
      roles: [],
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
    pageContent: {
      eyebrow: text('', ''),
      facebookLabel: text('', ''),
      facebookHeading: text('', ''),
    },
    mapEmbedUrl: '',
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
