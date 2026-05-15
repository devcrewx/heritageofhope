import dotenv from 'dotenv'
import { prisma } from '../src/lib/prisma.js'
import {
  impactMetrics,
  galleryItems,
  showcaseImages,
  teamMembers,
  partners,
  donationSteps,
  fundAllocation,
  volunteerRoles,
  activityPosts,
  contactDetails,
} from '../../../packages/web/src/content.js'

dotenv.config()

const { resolve, text } = {
  resolve: (language, value) => {
    if (value && typeof value === 'object' && 'en' in value && 'bn' in value) {
      return value[language] ?? value.en
    }
    return value
  },
  text: (en, bn) => ({ en, bn }),
}

async function seed() {
  console.log('Seeding database...')

  try {
    // Seed impact_stats
    console.log('Seeding impact stats...')
    for (const stat of impactMetrics) {
      await prisma.impactStat.upsert({
        where: { value: stat.value },
        update: {},
        create: {
          value: stat.value,
          labelEn: resolve('en', stat.label),
          labelBn: resolve('bn', stat.label),
        },
      })
    }

    // Seed gallery_items (only those with images, from showcaseImages + galleryItems)
    console.log('Seeding gallery items...')
    const allGalleryItems = [...galleryItems]
    for (let i = 0; i < allGalleryItems.length; i++) {
      const item = allGalleryItems[i]
      await prisma.galleryItem.upsert({
        where: { url: item.image },
        update: {},
        create: {
          url: item.image,
          publicId: `gallery-${i}`, // placeholder public_id
          altEn: resolve('en', item.title),
          altBn: resolve('bn', item.title),
          category: resolve('en', item.category).toLowerCase(),
          sortOrder: i,
        },
      })
    }

    // Seed team_members
    console.log('Seeding team members...')
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i]
      await prisma.teamMember.upsert({
        where: { photoUrl: member.image },
        update: {},
        create: {
          name: resolve('en', member.name),
          roleEn: resolve('en', member.role),
          roleBn: resolve('bn', member.role),
          photoUrl: member.image,
          photoPublicId: `team-${i}`,
          sortOrder: i,
        },
      })
    }

    // Seed core_values
    console.log('Seeding core values...')
    const coreValuesData = [
      text('Compassion', 'সহানুভূতি'),
      text('Transparency', 'স্বচ্ছতা'),
      text('Community', 'সম্প্রদায়'),
      text('Empowerment', 'স্বনির্ভরতা'),
    ]
    for (let i = 0; i < coreValuesData.length; i++) {
      const value = coreValuesData[i]
      await prisma.coreValue.upsert({
        where: { titleEn: resolve('en', value) },
        update: {},
        create: {
          titleEn: resolve('en', value),
          titleBn: resolve('bn', value),
          descriptionEn:
            'Each program is built on local trust and measurable impact.',
          descriptionBn:
            'আমাদের প্রতিটি কাজ এলাকার মানুষের ভরসা আর খোলামেলা কাজের ওপর দাঁড়িয়ে আছে।',
          sortOrder: i,
        },
      })
    }

    // Seed partners
    console.log('Seeding partners...')
    for (let i = 0; i < partners.length; i++) {
      const partner = partners[i]
      await prisma.partner.upsert({
        where: { name: resolve('en', partner) },
        update: {},
        create: {
          name: resolve('en', partner),
          isActive: true,
          sortOrder: i,
        },
      })
    }

    // Seed donation_tiers
    console.log('Seeding donation tiers...')
    for (let i = 0; i < donationSteps.length; i++) {
      const step = donationSteps[i]
      const amount = parseInt(step.amount.replace('₹', ''))
      await prisma.donationTier.upsert({
        where: { amount },
        update: {},
        create: {
          amount,
          labelEn: resolve('en', step.title),
          labelBn: resolve('bn', step.title),
          sortOrder: i,
        },
      })
    }

    // Seed fund_allocation
    console.log('Seeding fund allocation...')
    for (let i = 0; i < fundAllocation.length; i++) {
      const allocation = fundAllocation[i]
      await prisma.fundAllocation.upsert({
        where: { categoryEn: resolve('en', allocation.label) },
        update: {},
        create: {
          categoryEn: resolve('en', allocation.label),
          categoryBn: resolve('bn', allocation.label),
          percentage: allocation.value,
          sortOrder: i,
        },
      })
    }

    // Seed volunteer_roles
    console.log('Seeding volunteer roles...')
    for (let i = 0; i < volunteerRoles.length; i++) {
      const role = volunteerRoles[i]
      await prisma.volunteerRole.upsert({
        where: { titleEn: resolve('en', role) },
        update: {},
        create: {
          titleEn: resolve('en', role),
          titleBn: resolve('bn', role),
          descriptionEn:
            'Support field execution, coordination, and regular follow-up.',
          descriptionBn:
            'মাঠের কাজ, সমন্বয় ও নিয়মিত ফলো-আপে সহায়তা করুন।',
          sortOrder: i,
        },
      })
    }

    // Seed activity_posts
    console.log('Seeding activity posts...')
    for (let i = 0; i < activityPosts.length; i++) {
      const post = activityPosts[i]
      const dateObj = new Date(post.date)
      await prisma.activityPost.upsert({
        where: { titleEn: resolve('en', post.title) },
        update: {},
        create: {
          date: dateObj,
          titleEn: resolve('en', post.title),
          titleBn: resolve('bn', post.title),
          bodyEn: resolve('en', post.description),
          bodyBn: resolve('bn', post.description),
          isPublished: true,
          sortOrder: i,
        },
      })
    }

    console.log('✅ Database seeding complete!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

seed()
