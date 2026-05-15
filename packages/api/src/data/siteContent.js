import { prisma } from '../lib/prisma.js'
import {
  facebookPosts,
  contactDetails,
  navItems,
  showcaseImages,
  documents,
  featuredPrograms as fallbackFeaturedPrograms,
} from './staticContent.js'

/**
 * Fetch all site content from database and combine with hardcoded items.
 * This function retrieves seeded data from Supabase and merges it with
 * design system items (nav, programs, contacts) that are static.
 */
export async function getSiteContent() {
  try {
    // Fetch all database-backed content in parallel
    const [
      settings,
      ourWorkContent,
      impactStats,
      galleryItems,
      teamMembers,
      partners,
      donationTiers,
      fundAllocation,
      volunteerRoles,
      activityPosts,
      coreValues,
    ] = await Promise.all([
      prisma.siteContent.findMany({ where: { page: 'settings' } }),
      prisma.siteContent.findMany({ where: { page: 'our-work' } }),
      prisma.impactStat.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.partner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.donationTier.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.fundAllocation.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.volunteerRole.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.activityPost.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.coreValue.findMany({ orderBy: { sortOrder: 'asc' } }),
      // Fetch programs from DB instead of using the static bundle
      prisma.program.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    // (programs fetched directly below when transforming)

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
      phone: settingsMap.phone?.en || contactDetails.phone,
      email: settingsMap.email?.en || contactDetails.email,
      address: settingsMap.address?.en || contactDetails.address,
      facebookUrl: settingsMap.facebook_url?.en || 'https://www.facebook.com/profile.php?id=61559891799273',
    }

    // Transform database records to match frontend structure
    const transformedImpactMetrics = impactStats.map((stat) => ({
      value: stat.value,
      label: { en: stat.labelEn, bn: stat.labelBn || stat.labelEn },
    }))

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
      },
      about: {
        teamMembers: transformedTeamMembers,
        partners: transformedPartners,
        documents,
        coreValues: transformedCoreValues,
      },
      impact: {
        impactMetrics: transformedImpactMetrics,
        fundAllocation: transformedFundAllocation,
      },
      gallery: {
        galleryItems: transformedGalleryItems,
        showcaseImages: showcaseImages.gallery,
      },
      getInvolved: {
        donationSteps: transformedDonationTiers,
        volunteerRoles: transformedVolunteerRoles,
        contactDetails: contactDetailsFromSettings,
      },
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
    return webSiteContent
  }
}
