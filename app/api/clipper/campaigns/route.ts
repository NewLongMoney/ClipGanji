import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Campaign {
  id: string
  [key: string]: unknown // allow other properties for spread
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
  })

  // Get all active campaigns
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'active' },
  })

  // Get user's enrollments to mark which ones they've joined
  const enrollments = profile ? await prisma.campaignEnrollment.findMany({
    where: { clipperId: profile.id },
  }) : []

  const enrolledIds = new Set(enrollments.map((e: { campaignId: string }) => e.campaignId))

  return NextResponse.json(campaigns.map((c: Campaign) => ({
    ...c,
    isEnrolled: enrolledIds.has(c.id),
  })))
}
