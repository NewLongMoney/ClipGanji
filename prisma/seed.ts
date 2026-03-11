import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const campaigns = [
  {
    id: 'camp-001',
    brandInternal: 'SportsBet Kenya',
    brandPublic: 'Brand Partner A',
    category: 'Betting',
    accentColor: '#00C853',
    headline: 'Weekly logo bug — all platforms',
    brief: 'Post 2+ clips per day with our logo bug embedded in the top-right corner. Sports or entertainment themed. Kenya audience required.',
    format: 'logo-bug',
    platforms: ['tiktok', 'reels', 'shorts'],
    payPer1000Views: 300,
    spotsRemaining: 8,
    status: 'active',
    endDate: new Date('2026-04-30'),
  },
  {
    id: 'camp-002',
    brandInternal: 'FinApp Kenya',
    brandPublic: 'Brand Partner B',
    category: 'Fintech',
    accentColor: '#F5B800',
    headline: 'Video placement — app download push',
    brief: 'Feature our app naturally in your content. Show the download or sign-up flow. Must mention the brand name at least once. TikTok only.',
    format: 'video-placement',
    platforms: ['tiktok'],
    payPer1000Views: 500,
    spotsRemaining: 3,
    status: 'active',
    endDate: new Date('2026-04-01'),
  },
  {
    id: 'camp-003',
    brandInternal: 'EntertainCo',
    brandPublic: 'Brand Partner C',
    category: 'Entertainment',
    accentColor: '#00C853',
    headline: 'Logo bug — weekend campaign',
    brief: 'Post Friday to Sunday. Logo bug bottom-left. Music or nightlife content preferred. Minimum 1,000 Kenyan views per clip to qualify.',
    format: 'logo-bug',
    platforms: ['tiktok', 'reels'],
    payPer1000Views: 280,
    spotsRemaining: 12,
    status: 'active',
    endDate: new Date('2026-03-30'),
  },
  {
    id: 'camp-004',
    brandInternal: 'Telco Corp',
    brandPublic: 'Brand Partner D',
    category: 'Telco',
    accentColor: '#F5B800',
    headline: 'Full video placement — all week',
    brief: 'Organically feature the brand in a daily vlog or lifestyle clip. No scripted lines — just natural product use. Weekly brief provided on signup.',
    format: 'both',
    platforms: ['tiktok', 'reels', 'shorts'],
    payPer1000Views: 450,
    spotsRemaining: 5,
    status: 'active',
    endDate: new Date('2026-04-07'),
  },
]

async function main() {
  console.log('🌱  Seeding campaigns...')

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: campaign,
      create: campaign,
    })
    console.log(`  ✓ ${campaign.brandPublic} — ${campaign.headline}`)
  }

  console.log('✅  Seed complete.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
