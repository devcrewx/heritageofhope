import { prisma } from '../lib/prisma.js'
import { siteContentContract } from '../contracts/siteContent.js'
import {
  facebookPosts as staticFacebookPosts,
  contactDetails as staticContactDetails,
  navItems,
  showcaseImages as staticShowcaseImages,
  teamMembers as fallbackTeamMembers,
  ourWorkShowcase as fallbackOurWorkShowcase,
  featuredPrograms as fallbackFeaturedPrograms,
  impactMetrics as fallbackImpactMetrics,
} from './staticContent.js'

const fallbackDocuments = [
  { title: { en: '12A Certificate', bn: '১২এ শংসাপত্র' }, href: '#', thumb: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210277/heritage-of-hope/docs/thumbs/pdf-thumb.svg' },
  { title: { en: '80G Certificate', bn: '৮০জি শংসাপত্র' }, href: '#', thumb: 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210277/heritage-of-hope/docs/thumbs/pdf-thumb.svg' },
]

function buildFallbackSiteContent() {
  const c = JSON.parse(JSON.stringify(siteContentContract))
  c.siteMeta.orgName = 'Heritage of Hope Foundation'
  c.siteMeta.phone = staticContactDetails.phone
  c.siteMeta.email = staticContactDetails.email
  c.siteMeta.address = { en: staticContactDetails.address, bn: staticContactDetails.address }
  c.siteMeta.facebookUrl = staticContactDetails.facebookUrl
  c.siteMeta.footerMission = { en: 'Children, women and communities in South 24 Parganas, West Bengal.', bn: 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।' }
  c.siteMeta.registeredBadge = { en: 'Registered NGO', bn: 'নিবন্ধিত সংস্থা' }
  c.siteMeta.estYear = 'Est. 2024'
  c.home.trustBadges = [
    { en: 'Registered NGO', bn: 'নিবন্ধিত সংস্থা' },
    { en: 'Est. 2024', bn: 'প্রতিষ্ঠিত ২০২৪' },
    { en: 'Govt. of West Bengal', bn: 'পশ্চিমবঙ্গ সরকার' },
  ]
  c.home.featuredPrograms = fallbackFeaturedPrograms
  c.home.facebookPosts = staticFacebookPosts
  c.home.impactMetrics = fallbackImpactMetrics
  c.home.showcaseImages = staticShowcaseImages.home
  c.about.documents = fallbackDocuments
  c.gallery.items = staticShowcaseImages.gallery
  c.gallery.showcaseImages = staticShowcaseImages.gallery
  c.contact.mosaicImages = staticShowcaseImages.contact
  c.contact.facebookPosts = staticFacebookPosts
  return c
}

export async function getSiteContent() {
  try {
    const [
      settings,
      homeContent,
      aboutContent,
      impactContent,
      getInvolvedContent,
      galleryContent,
      contactContent,
      thankYouContent,
      notFoundContent,
    ] = await Promise.all([
      prisma.siteContent.findMany({ where: { page: 'settings' } }),
      prisma.siteContent.findMany({ where: { page: 'home' } }),
      prisma.siteContent.findMany({ where: { page: 'about' } }),
      prisma.siteContent.findMany({ where: { page: 'impact' } }),
      prisma.siteContent.findMany({ where: { page: 'getInvolved' } }),
      prisma.siteContent.findMany({ where: { page: 'gallery' } }),
      prisma.siteContent.findMany({ where: { page: 'contact' } }),
      prisma.siteContent.findMany({ where: { page: 'thankYou' } }),
      prisma.siteContent.findMany({ where: { page: 'notFound' } }),
    ])

    const ourWorkContent = await prisma.siteContent.findMany({ where: { page: 'our-work' } })

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

    const [
      donationTiers,
      fundAllocation,
      volunteerRoles,
      activityPosts,
    ] = await Promise.all([
      prisma.donationTier.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.fundAllocation.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.volunteerRole.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.activityPost.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    const settingsMap = settings.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = {}
      acc[item.section][item.fieldKey] = { en: item.valueEn, bn: item.valueBn }
      return acc
    }, {})

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
    const galleryMap = buildPageMap(galleryContent || [])
    const contactMap = buildPageMap(contactContent || [])
    const ourWorkMap = ourWorkContent.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = {}
      acc[item.section][item.fieldKey] = { en: item.valueEn, bn: item.valueBn }
      return acc
    }, {})

    const transformedImpactMetrics = (impactStats && impactStats.length > 0)
      ? impactStats.map((stat) => {
          const raw = String(stat.value || '')
          const digitsOnly = /^\d+$/.test(raw)
          return {
            id: stat.id,
            value: digitsOnly ? `${raw}+` : raw,
            label: { en: stat.labelEn, bn: stat.labelBn || stat.labelEn },
          }
        })
      : fallbackImpactMetrics

    const transformedTeamMembers = teamMembers.length > 0
      ? teamMembers.map((member) => ({
          id: member.id,
          image: member.photoUrl || '',
          name: { en: member.name, bn: member.name },
          role: { en: member.roleEn, bn: member.roleBn || member.roleEn },
        }))
      : fallbackTeamMembers

    const transformedPartners = partners.map((p) => ({
      en: p.name,
      bn: p.name,
    }))

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
    } catch {
      transformedPrograms = fallbackFeaturedPrograms
    }

    const transformedDonationTiers = donationTiers.map((tier) => ({
      id: tier.id,
      amount: tier.amount,
      label: { en: tier.labelEn, bn: tier.labelBn || tier.labelEn },
    }))

    const transformedFundAllocation = fundAllocation.map((fund) => ({
      id: fund.id,
      category: { en: fund.categoryEn, bn: fund.categoryBn || fund.categoryEn },
      percentage: fund.percentage,
    }))

    const transformedVolunteerRoles = volunteerRoles.map((role) => ({
      id: role.id,
      title: { en: role.titleEn, bn: role.titleBn || role.titleEn },
      description: { en: role.descriptionEn || '', bn: role.descriptionBn || role.descriptionEn || '' },
    }))

    const transformedActivityPosts = activityPosts.map((post) => ({
      date: post.date.toISOString().split('T')[0],
      image: post.photoUrl || '',
      title: { en: post.titleEn, bn: post.titleBn || post.titleEn },
      excerpt: { en: post.bodyEn, bn: post.bodyBn || post.bodyEn },
    }))

    const transformedCoreValues = [];
    for (let i = 1; i <= 4; i++) {
      const title = aboutMap.values?.[`value${i}_title`];
      const description = aboutMap.values?.[`value${i}_description`];
      if (title?.en) {
        transformedCoreValues.push({
          title: { en: title.en, bn: title.bn || title.en },
          description: { en: description?.en || '', bn: description?.bn || description?.en || '' },
        });
      }
    }

    const transformedDocuments = documents && documents.length > 0
      ? documents.map((doc) => ({
          id: doc.id,
          title: { en: doc.titleEn, bn: doc.titleBn || doc.titleEn },
          description: { en: doc.descriptionEn || '', bn: doc.descriptionBn || doc.descriptionEn || '' },
          date: doc.date ? doc.date.toISOString().split('T')[0] : '',
          pdfUrl: doc.pdfUrl || doc.url || '#',
          thumbUrl: doc.previewImgUrl || doc.thumbnailUrl || 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210277/heritage-of-hope/docs/thumbs/pdf-thumb.svg',
        }))
      : fallbackDocuments

    const c = JSON.parse(JSON.stringify(siteContentContract))

    c.siteMeta = {
      orgName: settingsMap.general?.org_name?.en || 'Heritage of Hope Foundation',
      navSubtitle: {
        en: settingsMap.general?.navbar_subtitle?.en || 'Registered NGO | West Bengal',
        bn: settingsMap.general?.navbar_subtitle?.bn || 'নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ',
      },
      logoUrl: settingsMap.general?.logo_url?.en || '',
      phone: settingsMap.general?.phone?.en || staticContactDetails.phone,
      email: settingsMap.general?.email?.en || staticContactDetails.email,
      address: settingsMap.general?.address || { en: staticContactDetails.address, bn: 'সুকান্তপল্লী, সুভাষ গ্রাম, ৭০০১৪৭, দক্ষিণ ২৪ পরগনা, পশ্চিমবঙ্গ, ভারত' },
      facebookUrl: settingsMap.general?.facebook_url?.en || staticContactDetails.facebookUrl,
      footerMission: {
        en: settingsMap.general?.footer_mission?.en || 'Children, women and communities in South 24 Parganas, West Bengal.',
        bn: settingsMap.general?.footer_mission?.bn || 'দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।',
      },
      registeredBadge: {
        en: settingsMap.general?.registered_badge?.en || 'Registered NGO',
        bn: settingsMap.general?.registered_badge?.bn || 'নিবন্ধিত সংস্থা',
      },
      estYear: settingsMap.general?.est_year?.en || 'Est. 2024',
      donateButtonLabel: {
        en: settingsMap.general?.donate_button_label?.en || 'Donate Now',
        bn: settingsMap.general?.donate_button_label?.bn || 'সহযোগিতার হাত বাড়িয়ে দিন',
      },
      facebookLabel: {
        en: settingsMap.general?.facebook_label?.en || 'Follow us on Facebook',
        bn: settingsMap.general?.facebook_label?.bn || 'ফেসবুকে আমাদের সঙ্গে থাকুন',
      },
      hamburgerAriaLabel: {
        en: settingsMap.general?.hamburger_aria_label?.en || 'Open navigation',
        bn: settingsMap.general?.hamburger_aria_label?.bn || 'মেনু খুলুন',
      },
      navAriaLabel: {
        en: settingsMap.general?.nav_aria_label?.en || 'Primary navigation',
        bn: settingsMap.general?.nav_aria_label?.bn || 'প্রধান মেনু',
      },
    }

    c.home.hero = {
      eyebrow: homeMap.hero?.eyebrow || c.home.hero.eyebrow,
      headline: homeMap.hero?.headline || c.home.hero.headline,
      intro: homeMap.hero?.intro || c.home.hero.intro,
      heroFootnote: homeMap.hero?.heroFootnote || c.home.hero.heroFootnote,
      heroImage: homeMap.hero?.heroImage?.en || '',
      regCertThumb: homeMap.hero?.regCertThumb?.en || '',
      figcaption: homeMap.hero?.figcaption || c.home.hero.figcaption,
      ctaPrimaryLabel: homeMap.hero?.ctaPrimaryLabel || c.home.hero.ctaPrimaryLabel,
      ctaSecondaryLabel: homeMap.hero?.ctaSecondaryLabel || c.home.hero.ctaSecondaryLabel,
      certCaption: homeMap.hero?.certCaption || c.home.hero.certCaption,
    }

    // Trust badges: read from settings section, fallback to home section, then legacy
    const settingsTrustBadges = settings
      .filter((item) => item.section === 'trustBadges')
      .sort((a, b) => a.fieldKey.localeCompare(b.fieldKey))
      .map((item) => ({ en: item.valueEn || '', bn: item.valueBn || '' }))
      .filter((badge) => badge.en || badge.bn)
    if (settingsTrustBadges.length > 0) {
      c.home.trustBadges = settingsTrustBadges
    } else {
      const homeBadges = Object.entries(homeMap.trustBadges || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, value]) => ({ en: value.en || '', bn: value.bn || '' }))
        .filter((badge) => badge.en || badge.bn)
      if (homeBadges.length > 0) {
        c.home.trustBadges = homeBadges
      } else {
        // Legacy: hero.badge1/2/3
        const legacy = []
        if (homeMap.hero?.badge1?.en) legacy.push({ en: homeMap.hero.badge1.en, bn: homeMap.hero.badge1.bn || '' })
        if (homeMap.hero?.badge2?.en) legacy.push({ en: homeMap.hero.badge2.en, bn: homeMap.hero.badge2.bn || '' })
        if (homeMap.hero?.badge3?.en) legacy.push({ en: homeMap.hero.badge3.en, bn: homeMap.hero.badge3.bn || '' })
        if (legacy.length > 0) c.home.trustBadges = legacy
      }
    }

    c.home.pageContent = {
      statsLabel: homeMap.pageContent?.statsLabel || c.home.pageContent.statsLabel,
      statsHeading: homeMap.pageContent?.statsHeading || c.home.pageContent.statsHeading,
      pillarLabel: homeMap.pageContent?.pillarLabel || c.home.pageContent.pillarLabel,
      activityLabel: homeMap.pageContent?.activityLabel || c.home.pageContent.activityLabel,
      activityHeading: homeMap.pageContent?.activityHeading || c.home.pageContent.activityHeading,
      donationLabel: homeMap.pageContent?.donationLabel || c.home.pageContent.donationLabel,
    }

    c.home.impactMetrics = transformedImpactMetrics
    c.home.featuredPrograms = transformedPrograms
    c.home.facebookPosts = transformedActivityPosts.length > 0 ? transformedActivityPosts : staticFacebookPosts
    const showcaseImages = []
    for (let i = 1; i <= 6; i++) {
      const url = homeMap.showcase?.[`img${i}_url`]?.en
      if (url) {
        showcaseImages.push({
          image: url,
          label: {
            en: homeMap.showcase?.[`img${i}_labelEn`]?.en || '',
            bn: homeMap.showcase?.[`img${i}_labelBn`]?.en || '',
          },
        })
      }
    }
    c.home.showcaseImages = showcaseImages.length > 0 ? showcaseImages : staticShowcaseImages.home
    c.home.mission.heading = homeMap.mission?.heading || c.home.mission.heading
    c.home.cta.headline = homeMap.cta?.headline || c.home.cta.headline
    c.home.cta.body = homeMap.cta?.body || c.home.cta.body
    c.home.cta.buttonLabel = homeMap.cta?.buttonLabel || c.home.cta.buttonLabel

    c.about.hero = {
      pageTitle: aboutMap.intro?.title || c.about.hero.pageTitle,
      intro: aboutMap.intro?.paragraph || c.about.hero.intro,
      heroImage: aboutMap.hero?.heroImage?.en || '',
    }
    c.about.pageContent = {
      eyebrow: aboutMap.pageContent?.eyebrow || c.about.pageContent.eyebrow,
      storyLabel: aboutMap.pageContent?.storyLabel || c.about.pageContent.storyLabel,
      missionLabel: aboutMap.pageContent?.missionLabel || c.about.pageContent.missionLabel,
      visionLabel: aboutMap.pageContent?.visionLabel || c.about.pageContent.visionLabel,
      valuesLabel: aboutMap.pageContent?.valuesLabel || c.about.pageContent.valuesLabel,
      valuesHeading: aboutMap.pageContent?.valuesHeading || c.about.pageContent.valuesHeading,
      regLabel: aboutMap.pageContent?.regLabel || c.about.pageContent.regLabel,
      regHeading: aboutMap.pageContent?.regHeading || c.about.pageContent.regHeading,
      certLabel: aboutMap.pageContent?.certLabel || c.about.pageContent.certLabel,
      partnersLabel: aboutMap.pageContent?.partnersLabel || c.about.pageContent.partnersLabel,
      teamLabel: aboutMap.pageContent?.teamLabel || c.about.pageContent.teamLabel,
      teamHeading: aboutMap.pageContent?.teamHeading || c.about.pageContent.teamHeading,
      documentsLabel: aboutMap.pageContent?.documentsLabel || c.about.pageContent.documentsLabel,
      documentsHeading: aboutMap.pageContent?.documentsHeading || c.about.pageContent.documentsHeading,
    }
    c.about.story = {
      heading: aboutMap.story?.heading || c.about.story.heading,
      body: aboutMap.story?.body || c.about.story.body,
    }
    c.about.mission = aboutMap.mission?.statement || c.about.mission
    c.about.vision = aboutMap.mission?.vision || c.about.vision
    c.about.values = transformedCoreValues.length > 0 ? transformedCoreValues : c.about.values
    c.about.teamMembers = transformedTeamMembers
    c.about.documents = transformedDocuments.map((d) => ({
      id: d.id || null,
      title: d.title || { en: '', bn: '' },
      description: d.description || { en: '', bn: '' },
      date: d.date || '',
      pdfUrl: d.pdfUrl || d.href || '#',
      thumbUrl: d.thumbUrl || d.thumb || 'https://res.cloudinary.com/dsa6xl7wt/image/upload/v1779210277/heritage-of-hope/docs/thumbs/pdf-thumb.svg',
    }))
    c.about.partners = transformedPartners
    c.about.registration = {
      body: aboutMap.registration?.body || c.about.registration.body,
      certImage: aboutMap.registration?.certImage?.en || '',
    }

    c.ourWork.hero = {
      pageTitle: ourWorkMap.intro?.title || c.ourWork.hero.pageTitle,
      intro: ourWorkMap.intro?.paragraph || c.ourWork.hero.intro,
      heroImage: ourWorkMap.hero?.heroImage?.en || '',
    }
    c.ourWork.pageContent = {
      eyebrow: ourWorkMap.pageContent?.eyebrow || c.ourWork.pageContent.eyebrow,
      approachLabel: ourWorkMap.pageContent?.approachLabel || c.ourWork.pageContent.approachLabel,
      focusLabel: ourWorkMap.pageContent?.focusLabel || c.ourWork.pageContent.focusLabel,
      joinLabel: ourWorkMap.pageContent?.joinLabel || c.ourWork.pageContent.joinLabel,
    }
    c.ourWork.focusTags = [
      ourWorkMap.focus?.tag1,
      ourWorkMap.focus?.tag2,
      ourWorkMap.focus?.tag3,
    ].filter(Boolean)
    c.ourWork.featuredPrograms = transformedPrograms
    c.ourWork.approach.heading = ourWorkMap.approach?.heading || c.ourWork.approach.heading
    c.ourWork.approach.steps = [
      ourWorkMap.approach?.step1,
      ourWorkMap.approach?.step2,
      ourWorkMap.approach?.step3,
      ourWorkMap.approach?.step4,
    ].filter(Boolean)
    c.ourWork.joinBox.body = ourWorkMap.join?.body || c.ourWork.joinBox.body
    c.ourWork.joinBox.buttonLabel = ourWorkMap.join?.button || c.ourWork.joinBox.buttonLabel

    const ourWorkShowcaseImages = []
    for (let i = 1; i <= 6; i++) {
      const url = ourWorkMap.showcase?.[`img${i}_url`]?.en
      if (url) {
        ourWorkShowcaseImages.push({
          image: url,
          label: {
            en: ourWorkMap.showcase?.[`img${i}_labelEn`]?.en || '',
            bn: ourWorkMap.showcase?.[`img${i}_labelBn`]?.en || '',
          },
        })
      }
    }
    c.ourWork.showcaseImages = ourWorkShowcaseImages.length > 0 ? ourWorkShowcaseImages : fallbackOurWorkShowcase

    c.impact.hero = {
      pageTitle: impactMap.intro?.title || c.impact.hero.pageTitle,
      subHeadline: impactMap.intro?.paragraph || c.impact.hero.subHeadline,
      promise: impactMap.hero?.promise || c.impact.hero.promise,
    }
    c.impact.pageContent = {
      eyebrow: impactMap.pageContent?.eyebrow || c.impact.pageContent.eyebrow,
      promiseLabel: impactMap.pageContent?.promiseLabel || c.impact.pageContent.promiseLabel,
      fundLabel: impactMap.pageContent?.fundLabel || c.impact.pageContent.fundLabel,
      fundHeading: impactMap.pageContent?.fundHeading || c.impact.pageContent.fundHeading,
      feedbackLabel: impactMap.pageContent?.feedbackLabel || c.impact.pageContent.feedbackLabel,
      reportLabel: impactMap.pageContent?.reportLabel || c.impact.pageContent.reportLabel,
    }
    c.impact.impactMetrics = transformedImpactMetrics
    c.impact.fundAllocation = transformedFundAllocation
    c.impact.testimonial.quote = impactMap.feedback?.quote || c.impact.testimonial.quote
    c.impact.annualReport.body = impactMap.report?.status || c.impact.annualReport.body

    c.gallery.pageContent = {
      eyebrow: galleryMap.pageContent?.eyebrow || c.gallery.pageContent.eyebrow,
      heading: galleryMap.pageContent?.heading || c.gallery.pageContent.heading,
      intro: galleryMap.pageContent?.intro || c.gallery.pageContent.intro,
      filterLabel: galleryMap.pageContent?.filterLabel || c.gallery.pageContent.filterLabel,
      filterText: galleryMap.pageContent?.filterText || c.gallery.pageContent.filterText,
      filterChipAll: galleryMap.pageContent?.filterChipAll || c.gallery.pageContent.filterChipAll,
      filterChipEducation: galleryMap.pageContent?.filterChipEducation || c.gallery.pageContent.filterChipEducation,
      filterChipHealthcare: galleryMap.pageContent?.filterChipHealthcare || c.gallery.pageContent.filterChipHealthcare,
      filterChipWelfare: galleryMap.pageContent?.filterChipWelfare || c.gallery.pageContent.filterChipWelfare,
      filterAriaLabel: galleryMap.pageContent?.filterAriaLabel || c.gallery.pageContent.filterAriaLabel,
    }

    const transformedGalleryItems = galleryItems.map((item) => ({
      id: item.id,
      url: item.url,
      altEn: item.altEn || '',
      altBn: item.altBn || item.altEn || '',
      category: item.category || '',
    }))
    c.gallery.items = transformedGalleryItems

    c.getInvolved.hero = {
      pageTitle: getInvolvedMap.intro?.title || c.getInvolved.hero.pageTitle,
      intro: getInvolvedMap.intro?.paragraph || c.getInvolved.hero.intro,
    }
    c.getInvolved.pageContent = {
      eyebrow: getInvolvedMap.pageContent?.eyebrow || c.getInvolved.pageContent.eyebrow,
      donationLabel: getInvolvedMap.pageContent?.donationLabel || c.getInvolved.pageContent.donationLabel,
      donationHeading: getInvolvedMap.pageContent?.donationHeading || c.getInvolved.pageContent.donationHeading,
      paymentLabel: getInvolvedMap.pageContent?.paymentLabel || c.getInvolved.pageContent.paymentLabel,
      paymentHeading: getInvolvedMap.pageContent?.paymentHeading || c.getInvolved.pageContent.paymentHeading,
      volunteerLabel: getInvolvedMap.pageContent?.volunteerLabel || c.getInvolved.pageContent.volunteerLabel,
      volunteerHeading: getInvolvedMap.pageContent?.volunteerHeading || c.getInvolved.pageContent.volunteerHeading,
      volunteerFormLabel: getInvolvedMap.pageContent?.volunteerFormLabel || c.getInvolved.pageContent.volunteerFormLabel,
      volunteerFormHeading: getInvolvedMap.pageContent?.volunteerFormHeading || c.getInvolved.pageContent.volunteerFormHeading,
      partnerLabel: getInvolvedMap.pageContent?.partnerLabel || c.getInvolved.pageContent.partnerLabel,
      partnerHeading: getInvolvedMap.pageContent?.partnerHeading || c.getInvolved.pageContent.partnerHeading,
      partnerSubtitle: getInvolvedMap.pageContent?.partnerSubtitle || c.getInvolved.pageContent.partnerSubtitle,
      partnerFormLabel: getInvolvedMap.pageContent?.partnerFormLabel || c.getInvolved.pageContent.partnerFormLabel,
      partnerFormHeading: getInvolvedMap.pageContent?.partnerFormHeading || c.getInvolved.pageContent.partnerFormHeading,
      bankLabel: getInvolvedMap.pageContent?.bankLabel || c.getInvolved.pageContent.bankLabel,
      chequeModalTitle: getInvolvedMap.pageContent?.chequeModalTitle || c.getInvolved.pageContent.chequeModalTitle,
      chequeButtonLabel: getInvolvedMap.pageContent?.chequeButtonLabel || c.getInvolved.pageContent.chequeButtonLabel,
    }
    c.getInvolved.bankDetails = {
      accountName: getInvolvedMap.bank?.accountName || { en: 'Heritage of Hope Foundation', bn: 'হেরিটেজ অফ হোপ ফাউন্ডেশন' },
      bankName: getInvolvedMap.bank?.bankName || { en: 'State Bank of India, Ruby Park Branch', bn: 'স্টেট ব্যাংক অফ ইন্ডিয়া, রুবি পার্ক শাখা' },
      accountNumber: getInvolvedMap.bank?.accountNumber?.en || 'A/C No: 43107075580',
      ifsc: getInvolvedMap.bank?.ifsc?.en || 'IFSC: SBIN0008438',
    }
    c.getInvolved.upiImage = getInvolvedMap.upi?.qrUrl?.en || ''
    c.getInvolved.upiDeepLink = getInvolvedMap.upi?.intentUrl?.en || 'upi://pay?pa=8420119790%40okbizaxis&pn=Heritage%20of%20Hope%20Foundation&cu=INR'
    c.getInvolved.upiLabels = {
      buttonLabel: getInvolvedMap.upiLabels?.buttonLabel || c.getInvolved.upiLabels.buttonLabel,
      mobileHint: getInvolvedMap.upiLabels?.mobileHint || c.getInvolved.upiLabels.mobileHint,
      fallbackHint: getInvolvedMap.upiLabels?.fallbackHint || c.getInvolved.upiLabels.fallbackHint,
      qrHint: getInvolvedMap.upiLabels?.qrHint || c.getInvolved.upiLabels.qrHint,
    }
    c.getInvolved.donationTiers = transformedDonationTiers
    c.getInvolved.volunteer.heading = getInvolvedMap.volunteer?.heading || c.getInvolved.volunteer.heading
    c.getInvolved.volunteer.description = getInvolvedMap.volunteer?.description || c.getInvolved.volunteer.description
    c.getInvolved.volunteer.roles = transformedVolunteerRoles
    c.getInvolved.volunteerFormLabels = {
      nameLabel: getInvolvedMap.volunteerFormLabels?.nameLabel || c.getInvolved.volunteerFormLabels.nameLabel,
      emailLabel: getInvolvedMap.volunteerFormLabels?.emailLabel || c.getInvolved.volunteerFormLabels.emailLabel,
      phoneLabel: getInvolvedMap.volunteerFormLabels?.phoneLabel || c.getInvolved.volunteerFormLabels.phoneLabel,
      phoneValidation: getInvolvedMap.volunteerFormLabels?.phoneValidation || c.getInvolved.volunteerFormLabels.phoneValidation,
      interestLabel: getInvolvedMap.volunteerFormLabels?.interestLabel || c.getInvolved.volunteerFormLabels.interestLabel,
      interestPlaceholder: getInvolvedMap.volunteerFormLabels?.interestPlaceholder || c.getInvolved.volunteerFormLabels.interestPlaceholder,
      availabilityLabel: getInvolvedMap.volunteerFormLabels?.availabilityLabel || c.getInvolved.volunteerFormLabels.availabilityLabel,
      availabilityPlaceholder: getInvolvedMap.volunteerFormLabels?.availabilityPlaceholder || c.getInvolved.volunteerFormLabels.availabilityPlaceholder,
      availabilityWeekends: getInvolvedMap.volunteerFormLabels?.availabilityWeekends || c.getInvolved.volunteerFormLabels.availabilityWeekends,
      availabilityWeekdays: getInvolvedMap.volunteerFormLabels?.availabilityWeekdays || c.getInvolved.volunteerFormLabels.availabilityWeekdays,
      availabilityOccasional: getInvolvedMap.volunteerFormLabels?.availabilityOccasional || c.getInvolved.volunteerFormLabels.availabilityOccasional,
      messageLabel: getInvolvedMap.volunteerFormLabels?.messageLabel || c.getInvolved.volunteerFormLabels.messageLabel,
      submitLabel: getInvolvedMap.volunteerFormLabels?.submitLabel || c.getInvolved.volunteerFormLabels.submitLabel,
      submittingLabel: getInvolvedMap.volunteerFormLabels?.submittingLabel || c.getInvolved.volunteerFormLabels.submittingLabel,
      errorMessage: getInvolvedMap.volunteerFormLabels?.errorMessage || c.getInvolved.volunteerFormLabels.errorMessage,
    }
    c.getInvolved.partnerSection = {
      heading: getInvolvedMap.partner?.heading || c.getInvolved.partnerSection.heading,
      body: getInvolvedMap.partner?.description || c.getInvolved.partnerSection.body,
      image: getInvolvedMap.partner?.image?.en || '',
    }
    c.getInvolved.specimenChequeImage = getInvolvedMap.bank?.chequeUrl?.en || ''
    c.getInvolved.partnerFormLabels = {
      orgNameLabel: getInvolvedMap.partnerFormLabels?.orgNameLabel || c.getInvolved.partnerFormLabels.orgNameLabel,
      contactPersonLabel: getInvolvedMap.partnerFormLabels?.contactPersonLabel || c.getInvolved.partnerFormLabels.contactPersonLabel,
      emailLabel: getInvolvedMap.partnerFormLabels?.emailLabel || c.getInvolved.partnerFormLabels.emailLabel,
      phoneLabel: getInvolvedMap.partnerFormLabels?.phoneLabel || c.getInvolved.partnerFormLabels.phoneLabel,
      phoneValidation: getInvolvedMap.partnerFormLabels?.phoneValidation || c.getInvolved.partnerFormLabels.phoneValidation,
      partnershipTypeLabel: getInvolvedMap.partnerFormLabels?.partnershipTypeLabel || c.getInvolved.partnerFormLabels.partnershipTypeLabel,
      partnershipTypePlaceholder: getInvolvedMap.partnerFormLabels?.partnershipTypePlaceholder || c.getInvolved.partnerFormLabels.partnershipTypePlaceholder,
      partnershipTypeCsr: getInvolvedMap.partnerFormLabels?.partnershipTypeCsr || c.getInvolved.partnerFormLabels.partnershipTypeCsr,
      partnershipTypeHospital: getInvolvedMap.partnerFormLabels?.partnershipTypeHospital || c.getInvolved.partnerFormLabels.partnershipTypeHospital,
      partnershipTypeInstitution: getInvolvedMap.partnerFormLabels?.partnershipTypeInstitution || c.getInvolved.partnerFormLabels.partnershipTypeInstitution,
      partnershipTypeOther: getInvolvedMap.partnerFormLabels?.partnershipTypeOther || c.getInvolved.partnerFormLabels.partnershipTypeOther,
      messageLabel: getInvolvedMap.partnerFormLabels?.messageLabel || c.getInvolved.partnerFormLabels.messageLabel,
      submitLabel: getInvolvedMap.partnerFormLabels?.submitLabel || c.getInvolved.partnerFormLabels.submitLabel,
      submittingLabel: getInvolvedMap.partnerFormLabels?.submittingLabel || c.getInvolved.partnerFormLabels.submittingLabel,
      errorMessage: getInvolvedMap.partnerFormLabels?.errorMessage || c.getInvolved.partnerFormLabels.errorMessage,
    }

    const mosaicImages = []
    for (let i = 1; i <= 4; i++) {
      const url = contactMap.mosaic?.[`img${i}_url`]?.en
      if (url) {
        mosaicImages.push({
          image: url,
          label: {
            en: contactMap.mosaic?.[`img${i}_labelEn`]?.en || '',
            bn: contactMap.mosaic?.[`img${i}_labelBn`]?.en || '',
          },
        })
      }
    }
    c.contact.pageTitle = settingsMap.contact?.contact_page_title || c.contact.pageTitle
    c.contact.intro = settingsMap.contact?.contact_page_intro || c.contact.intro
    c.contact.responseLabel = settingsMap.contact?.contact_response_label || c.contact.responseLabel
    c.contact.responseValue = settingsMap.contact?.contact_response_value || c.contact.responseValue
    c.contact.formLabel = settingsMap.contact?.contact_form_label || c.contact.formLabel
    c.contact.formHeading = settingsMap.contact?.contact_form_heading || c.contact.formHeading
    c.contact.phoneLabel = settingsMap.general?.contact_phone_label || c.contact.phoneLabel
    c.contact.emailLabel = settingsMap.general?.contact_email_label || c.contact.emailLabel
    c.contact.addressLabel = settingsMap.general?.contact_address_label || c.contact.addressLabel
    c.contact.visitFacebookLabel = contactMap.pageContent?.visitFacebookLabel || c.contact.visitFacebookLabel
    c.contact.mapTitle = contactMap.pageContent?.mapTitle || c.contact.mapTitle
    c.contact.pageContent = {
      eyebrow: contactMap.pageContent?.eyebrow || c.contact.pageContent.eyebrow,
      facebookLabel: contactMap.pageContent?.facebookLabel || c.contact.pageContent.facebookLabel,
      facebookHeading: contactMap.pageContent?.facebookHeading || c.contact.pageContent.facebookHeading,
    }
    c.contact.formLabels = {
      nameLabel: contactMap.formLabels?.nameLabel || c.contact.formLabels.nameLabel,
      namePlaceholder: contactMap.formLabels?.namePlaceholder || c.contact.formLabels.namePlaceholder,
      emailLabel: contactMap.formLabels?.emailLabel || c.contact.formLabels.emailLabel,
      emailPlaceholder: contactMap.formLabels?.emailPlaceholder || c.contact.formLabels.emailPlaceholder,
      subjectLabel: contactMap.formLabels?.subjectLabel || c.contact.formLabels.subjectLabel,
      messageLabel: contactMap.formLabels?.messageLabel || c.contact.formLabels.messageLabel,
      messagePlaceholder: contactMap.formLabels?.messagePlaceholder || c.contact.formLabels.messagePlaceholder,
      submitLabel: contactMap.formLabels?.submitLabel || c.contact.formLabels.submitLabel,
      submittingLabel: contactMap.formLabels?.submittingLabel || c.contact.formLabels.submittingLabel,
      errorMessage: contactMap.formLabels?.errorMessage || c.contact.formLabels.errorMessage,
    }
    c.contact.mapEmbedUrl = contactMap.map?.embedUrl?.en || ''
    c.contact.mosaicImages = mosaicImages.length > 0 ? mosaicImages : staticShowcaseImages.contact
    c.contact.facebookPosts = c.home.facebookPosts
    if (settingsMap.navItems) {
      c.navItems = navItems.map(item => ({
        ...item,
        label: {
          en: settingsMap.navItems[item.fieldKey]?.valueEn || item.label.en,
          bn: settingsMap.navItems[item.fieldKey]?.valueBn || item.label.bn,
        }
      }))
    } else {
      c.navItems = navItems
    }

    const thankYouMap = buildPageMap(thankYouContent || [])
    c.thankYou.pageContent = {
      eyebrow: thankYouMap.pageContent?.eyebrow || c.thankYou.pageContent.eyebrow,
      heading: thankYouMap.pageContent?.heading || c.thankYou.pageContent.heading,
      body: thankYouMap.pageContent?.body || c.thankYou.pageContent.body,
      buttonLabel: thankYouMap.pageContent?.buttonLabel || c.thankYou.pageContent.buttonLabel,
    }

    const notFoundMap = buildPageMap(notFoundContent || [])
    c.notFound.pageContent = {
      eyebrow: notFoundMap.pageContent?.eyebrow || c.notFound.pageContent.eyebrow,
      heading: notFoundMap.pageContent?.heading || c.notFound.pageContent.heading,
      body: notFoundMap.pageContent?.body || c.notFound.pageContent.body,
      buttonLabel: notFoundMap.pageContent?.buttonLabel || c.notFound.pageContent.buttonLabel,
    }

    return c
  } catch (error) {
    console.error('Error fetching site content:', error)
    return buildFallbackSiteContent()
  }
}
