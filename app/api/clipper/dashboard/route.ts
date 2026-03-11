import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ActiveCampaign, RecentSubmission } from '@/app/types/dashboard'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Weekly views (this week's approved submissions)
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // start of week
  weekStart.setHours(0, 0, 0, 0)

  const weeklySubmissions = await prisma.submission.findMany({
    where: {
      clipperId: profile.id,
      status: 'approved',
      submittedAt: { gte: weekStart },
    },
  })

  const weeklyViews = weeklySubmissions.reduce((sum: number, s: { views: number }) => sum + s.views, 0)
  const weeklyEarnings = weeklySubmissions.reduce((sum: number, s: { earnings: number }) => sum + s.earnings, 0)

  // Last week earnings for % change
  const lastWeekStart = new Date(weekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(weekStart)

  const lastWeekSubmissions = await prisma.submission.findMany({
    where: {
      clipperId: profile.id,
      status: 'approved',
      submittedAt: { gte: lastWeekStart, lt: lastWeekEnd },
    },
  })
  const lastWeekEarnings = lastWeekSubmissions.reduce((sum: number, s: { earnings: number }) => sum + s.earnings, 0)
  const earningsChange = lastWeekEarnings > 0
    ? Math.round(((weeklyEarnings - lastWeekEarnings) / lastWeekEarnings) * 100)
    : 0

  // Active campaign enrollments
  const activeCampaigns = await prisma.campaignEnrollment.findMany({
    where: { clipperId: profile.id, status: 'active' },
    include: {
      campaign: true,
    },
  })

  // Recent submissions
  const recentSubmissions = await prisma.submission.findMany({
    where: { clipperId: profile.id },
    orderBy: { submittedAt: 'desc' },
    take: 10,
    include: { campaign: true },
  })

  // Pending count
  const pendingCount = await prisma.submission.count({
    where: { clipperId: profile.id, status: 'pending' },
  })

  return NextResponse.json({
    profile: {
      fullName: profile.fullName,
      status: profile.status,
      totalEarnings: profile.totalEarnings,
      totalViews: profile.totalViews,
    },
    stats: {
      weeklyViews,
      weeklyEarnings,
      earningsChange,
      activeCampaignsCount: activeCampaigns.length,
      totalSubmissions: await prisma.submission.count({ where: { clipperId: profile.id } }),
      pendingCount,
    },
    activeCampaigns: activeCampaigns.map((e: {
      campaign: { id: string; brandPublic: string; category: string; accentColor: string | null; endDate: Date; payPer1000Views: number };
      totalViews: number;
      totalEarnings: number;
      clipsSubmitted: number;
      clipsApproved: number;
    }): ActiveCampaign => ({
      id: e.campaign.id,
      brand: e.campaign.brandPublic,
      category: e.campaign.category,
      accentColor: e.campaign.accentColor || '#00C853',
      deadline: e.campaign.endDate.toISOString(),
      payPer1k: e.campaign.payPer1000Views,
      myViews: e.totalViews,
      myEarnings: e.totalEarnings,
      clipsSubmitted: e.clipsSubmitted,
      clipsApproved: e.clipsApproved,
    })),
    recentSubmissions: recentSubmissions.map((s: {
      id: string;
      campaign: { brandPublic: string };
      platform: string;
      views: number;
      earnings: number;
      status: string;
      submittedAt: Date;
    }): RecentSubmission => ({
      id: s.id,
      campaign: s.campaign.brandPublic,
      platform: s.platform,
      views: s.views,
      earnings: s.earnings,
      status: s.status as 'pending' | 'approved' | 'rejected',
      submittedAt: s.submittedAt.toISOString(),
    })),
  })
}
