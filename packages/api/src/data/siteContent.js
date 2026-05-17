import { prisma } from '../lib/prisma.js'
import {
  facebookPosts,
  contactDetails,
  navItems,
  showcaseImages,
  documents as staticDocuments,
  featuredPrograms as fallbackFeaturedPrograms,
  impactMetrics as fallbackImpactMetrics,
} from './staticContent.js'

const fallbackDocuments = [
  { title: { en: '12A Certificate', bn: '১२এ শংসাপত্র' }, href: '#', thumb: '/docs/thumbs/pdf-thumb.svg' },
  { title: { en: '80G Certificate', bn: '৮०जी शंसापत्र' }, href: '#', thumb: '/docs/thumbs/pdf-thumb.svg' },
]

function buildFallbackSiteContent() {
  return {
    navItems,
    home: {
      featuredPrograms: fallbackFeaturedPrograms,
      activityPosts: facebookPosts,
      facebookPosts,
      impactMetrics: fallbackImpactMetrics,
      donationSteps: [],
      showcaseImages: showcaseImages.home,
      hero: {},
      mission: {},
      cta: {},
    },
    about: {
      teamMembers: [],
      partners: [],
      documents: fallbackDocuments,
      coreValues: [],
      pageContent: {},
    },
    impact: {
      impactMetrics: fallbackImpactMetrics,
      fundAllocation: [],
      pageContent: {},
    },
    gallery: {
      galleryItems: showcaseImages.gallery,
      showcaseImages: showcaseImages.gallery,
    },
    getInvolved: {
      donationSteps: [],
      volunteerRoles: [],
      contactDetails,
      pageContent: {},
    },
    siteMeta: contactDetails,
    contact: {
      contactDetails,
      facebookPosts,
      showcaseImages: showcaseImages.contact,
    },
    ourWork: {
      featuredPrograms: fallbackFeaturedPrograms,
      pageContent: {},
    },
  }
}

/**
 * Fetch all site content from database and combine with hardcoded items.
 * This function retrieves seeded data from Supabase and merges it with
 * design system items (nav, programs, contacts) that are static.
 * 
 * Uses sequential batching to avoid exhausting Supabase free tier connection pool (15 max).
 */
export async function getSiteContent() {
  try {
    // Batch 1: Fetch page content (5 queries)
    const [
      settings,
      homeContent,
      aboutContent,
      impactContent,
      getInvolvedContent,
    ] = await Promise.all([
      prisma.siteContent.findMany({ where: { page: 'settings' } }),
      prisma.siteContent.findMany({ where: { page: 'home' } }),
      prisma.siteContent.findMany({ where: { page: 'about' } }),
      prisma.siteContent.findMany({ where: { page: 'impact' } }),
      prisma.siteContent.findMany({ where: { page: 'getInvolved' } }),
    ])

    // Also fetch our-work page content
    const ourWorkContent = await prisma.siteContent.findMany({ where: { page: 'our-work' } })

    // Batch 2: Fetch data tables (5 queries)
    const [
      impactStats,
      galleryItems,
      teamMembers,
      partners,
      documents,
    ] = await Promise.all([
      prisma.impactStat.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.document.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    // Batch 3: Fetch remaining (5 queries)
    const [
      donationTiers,
      fundAllocation,
      volunteerRoles,
      activityPosts,
      coreValues,
    ] = await Promise.all([
      prisma.donationTier.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.fundAllocation.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.volunteerRole.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.activityPost.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.coreValue.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    // Transform and organize all content into the siteContent object structure

    const settingsMap = settings.reduce((accumulator, item) => {
      accumulator[item.fieldKey] = {
        en: item.valueEn,
        bn: item.valueBn,
      }

      return accumulator
    }, {})

    const ourWorkMap = ourWorkContent.reduce((accumulator, item) => {
      if (!accumulator[item.section]) {
        accumulator[item.section] = {}
      }

      accumulator[item.section][item.fieldKey] = {
        en: item.valueEn,
        bn: item.valueBn,
      }

      return accumulator
    }, {})

    const contactDetailsFromSettings = {
      orgName: settingsMap.org_name?.en || 'Heritage of Hope Foundation',
      navbarSubtitle: {
        en: settingsMap.navbar_subtitle?.en || 'Registered NGO | West Bengal',
        bn: settingsMap.navbar_subtitle?.bn || 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ',
      },
      registeredBadge: {
        en: settingsMap.registered_badge?.en || 'Registered NGO',
        bn: settingsMap.registered_badge?.bn || 'নিবন্ধিত সংস্থা',
      },
      estYear: settingsMap.est_year?.en || 'Est. 2024',
      footerMission: {
        en: settingsMap.footer_mission?.en || 'Children, women and communities in South 24 Parganas, West Bengal.',
        bn: settingsMap.footer_mission?.bn || 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।',
      },
      phone: settingsMap.phone?.en || contactDetails.phone,
      email: settingsMap.email?.en || contactDetails.email,
      address: settingsMap.address?.en || contactDetails.address,
      facebookUrl: settingsMap.facebook_url?.en || 'https://www.facebook.com/profile.php?id=61559891799273',
    }

    // Transform database records to match frontend structure
    const transformedImpactMetrics = (impactStats && impactStats.length > 0)
      ? impactStats.map((stat) => {
          const raw = String(stat.value || '')
          const digitsOnly = /^\d+$/.test(raw)
          return {
            value: digitsOnly ? `${raw}+` : raw,
            label: { en: stat.labelEn, bn: stat.labelBn || stat.labelEn },
          }
        })
      : fallbackImpactMetrics

    // Build maps for pages that store structured key/value rows (home, about, impact, getInvolved)
    const buildPageMap = (rows) =>
      rows.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = {}
        acc[item.section][item.fieldKey] = { en: item.valueEn, bn: item.valueBn }
        return acc
      }, {})

    const homeMap = buildPageMap(homeContent || [])
    const aboutMap = buildPageMap(aboutContent || [])
    const impactMap = buildPageMap(impactContent || [])
    const getInvolvedMap = buildPageMap(getInvolvedContent || [])

    const transformedGalleryItems = galleryItems.map((item) => ({
      image: item.url,
      title: { en: item.altEn, bn: item.altBn || item.altEn },
      category: { en: item.category, bn: item.category }, // TODO: add category_bn to schema
    }))

    const transformedTeamMembers = teamMembers.map((member) => ({
      name: { en: member.name, bn: member.name }, // TODO: add name_bn to schema
      role: { en: member.roleEn, bn: member.roleBn || member.roleEn },
      image: member.photoUrl,
    }))

    const transformedPartners = partners.map((p) => p.name)

    // If programs were fetched from DB, transform them to the frontend shape
    let transformedPrograms = fallbackFeaturedPrograms
    try {
      const dbPrograms = await prisma.program.findMany({ orderBy: { sortOrder: 'asc' } })
      if (dbPrograms.length > 0) {
        transformedPrograms = dbPrograms.map((p) => ({
          slug: p.slug,
          image: p.imageUrl,
          category: { en: p.categoryEn, bn: p.categoryBn || p.categoryEn },
          title: { en: p.titleEn, bn: p.titleBn || p.titleEn },
          description: { en: p.descriptionEn, bn: p.descriptionBn || p.descriptionEn },
          highlight: { en: p.highlightEn || '', bn: p.highlightBn || '' },
        }))
      }
    } catch (e) {
      // fall back to static bundle if programs table missing
      transformedPrograms = fallbackFeaturedPrograms
    }

    const transformedDonationTiers = donationTiers.map((tier) => ({
      amount: `₹${tier.amount}`,
      title: { en: tier.labelEn, bn: tier.labelBn || tier.labelEn },
    }))

    const transformedFundAllocation = fundAllocation.map((fund) => ({
      label: { en: fund.categoryEn, bn: fund.categoryBn || fund.categoryEn },
      value: fund.percentage,
    }))

    const transformedVolunteerRoles = volunteerRoles.map((role) => ({
      en: role.titleEn,
      bn: role.titleBn || role.titleEn,
    }))

    const transformedActivityPosts = activityPosts.map((post) => ({
      date: post.date.toISOString().split('T')[0], // YYYY-MM-DD format
      title: { en: post.titleEn, bn: post.titleBn || post.titleEn },
      description: {
        en: post.bodyEn,
        bn: post.bodyBn || post.bodyEn,
      },
    }))

    const transformedCoreValues = coreValues.map((value) => ({
      en: value.titleEn,
      bn: value.titleBn || value.titleEn,
    }))

    const transformedDocuments = documents && documents.length > 0 
      ? documents.map((doc) => ({
          title: { en: doc.titleEn, bn: doc.titleBn || doc.titleEn },
          href: doc.url || doc.documentUrl || '#',
          thumb: doc.thumbnailUrl || doc.previewUrl || '/docs/thumbs/pdf-thumb.svg',
          description: { en: doc.descriptionEn || '', bn: doc.descriptionBn || doc.descriptionEn || '' },
          meta: doc.meta,
          caption: { en: doc.captionEn, bn: doc.captionBn || doc.captionEn },
        }))
      : fallbackDocuments  // Use fallback from staticContent if DB is empty

    // Construct response matching original siteContent structure
    return {
      navItems,
      home: {
        featuredPrograms: transformedPrograms,
        activityPosts: transformedActivityPosts,
        facebookPosts,
        impactMetrics: transformedImpactMetrics,
        donationSteps: transformedDonationTiers,
        showcaseImages: showcaseImages.home,
        // admin-managed fields (hero, mission, cta)
        hero: {
          eyebrow: homeMap.hero?.eyebrow,
          headline: homeMap.hero?.headline,
          intro: homeMap.hero?.intro,
          badge1: homeMap.hero?.badge1,
          badge2: homeMap.hero?.badge2,
          badge3: homeMap.hero?.badge3,
        },
        pageContent: {
          heroImage: homeMap.hero?.heroImage,
        },
        mission: {
          heading: homeMap.mission?.heading,
        },
        cta: {
          headline: homeMap.cta?.headline,
          body: homeMap.cta?.body,
        },
      },
      about: {
        teamMembers: transformedTeamMembers,
        partners: transformedPartners,
        documents: transformedDocuments,
        coreValues: transformedCoreValues,
        pageContent: {
          title: aboutMap.intro?.title,
          intro: aboutMap.intro?.paragraph,
          heroImage: aboutMap.hero?.heroImage,
          story: aboutMap.story?.body,
          mission: aboutMap.mission?.statement,
          vision: aboutMap.mission?.vision,
          values: [
            aboutMap.values?.value1_title,
            aboutMap.values?.value2_title,
            aboutMap.values?.value3_title,
            aboutMap.values?.value4_title,
          ].filter(Boolean),
        },
      },
      impact: {
        impactMetrics: transformedImpactMetrics,
        fundAllocation: transformedFundAllocation,
        pageContent: {
          title: impactMap.intro?.title,
          intro: impactMap.intro?.paragraph,
          metrics: transformedImpactMetrics,
          fundAllocation: transformedFundAllocation,
          feedbackLabel: impactMap.feedback?.label,
          feedback: impactMap.feedback?.quote,
          reportLabel: impactMap.report?.label,
          report: impactMap.report?.status,
        },
      },
      gallery: {
        galleryItems: transformedGalleryItems,
        showcaseImages: showcaseImages.gallery,
      },
      getInvolved: {
        donationSteps: transformedDonationTiers,
        volunteerRoles: transformedVolunteerRoles,
        contactDetails: contactDetailsFromSettings,
        pageContent: {
          title: getInvolvedMap.intro?.title,
          intro: getInvolvedMap.intro?.paragraph,
          heroImage: getInvolvedMap.hero?.heroImage,
          bankLabel: getInvolvedMap.bank?.label,
          bank: {
            name: getInvolvedMap.bank?.name,
            branch: getInvolvedMap.bank?.branch,
            account: getInvolvedMap.bank?.account,
            ifsc: getInvolvedMap.bank?.ifsc,
          },
          chequeSpecimenLabel: getInvolvedMap.bank?.chequeLabel,
          chequeSpecimen: getInvolvedMap.bank?.chequeUrl,
          qrTitle: getInvolvedMap.upi?.qrTitle,
          upiQrAlt: getInvolvedMap.upi?.qrAlt,
          upiQr: getInvolvedMap.upi?.qrUrl,
          upiQrImage: getInvolvedMap.payment?.upiQrImage,
          upiIntentUrl: getInvolvedMap.upi?.intentUrl,
          upiCta: getInvolvedMap.upi?.ctaText,
          upiHint: getInvolvedMap.upi?.hint,
          upiFallback: getInvolvedMap.upi?.fallback,
          qrBody: getInvolvedMap.upi?.body,
          donationSteps: (
            (
              getInvolvedMap.donation?.steps ? JSON.parse(getInvolvedMap.donation?.steps) : null
            ) || null
          ) ?? transformedDonationTiers,
          volunteerRoles: (
            (
              getInvolvedMap.volunteer?.roles ? JSON.parse(getInvolvedMap.volunteer?.roles) : null
            ) || null
          ) ?? transformedVolunteerRoles,
          volunteer: {
            heading: getInvolvedMap.volunteer?.heading,
            description: getInvolvedMap.volunteer?.description,
          },
          partner: {
            heading: getInvolvedMap.partner?.heading,
            description: getInvolvedMap.partner?.description,
          },
        },
      },
      siteMeta: contactDetailsFromSettings,
      contact: {
        contactDetails: contactDetailsFromSettings,
        facebookPosts,
        showcaseImages: showcaseImages.contact,
      },
      ourWork: {
        featuredPrograms: transformedPrograms,
        pageContent: {
          title: ourWorkMap.hero?.title,
          intro: ourWorkMap.hero?.intro,
          heroImage: ourWorkMap.hero?.heroImage,
          focusTags: [ourWorkMap.focus?.tag1, ourWorkMap.focus?.tag2, ourWorkMap.focus?.tag3].filter(Boolean),
          approachHeading: ourWorkMap.approach?.heading,
          approachSteps: [
            ourWorkMap.approach?.step1,
            ourWorkMap.approach?.step2,
            ourWorkMap.approach?.step3,
            ourWorkMap.approach?.step4,
          ].filter(Boolean),
          joinMeta: ourWorkMap.join?.meta,
          joinBody: ourWorkMap.join?.body,
          joinButton: ourWorkMap.join?.button,
        },
      },
    }
  } catch (error) {
    console.error('Error fetching site content:', error)
    // Fallback to web content if DB fails
    return buildFallbackSiteContent()
  }
}
