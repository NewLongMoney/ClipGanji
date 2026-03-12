import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

  // Fetch approved submissions for total calculated earnings
  const approvedSubmissions = await prisma.submission.findMany({
    where: {
      clipperId: profile.id,
      status: 'approved',
    },
    select: {
      earnings: true,
      views: true,
      submittedAt: true,
      campaign: {
        select: {
          brandPublic: true
        }
      }
    }
  })

  // Fetch payouts
  const payouts = await prisma.payout.findMany({
    where: { clipperId: profile.id },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate pending review earnings
  const pendingSubmissions = await prisma.submission.findMany({
    where: {
        clipperId: profile.id,
        status: 'pending'
    },
    include: {
        campaign: true
    }
  })
  
  // Estimate pending (views * payPer1000Views / 1000)
  // Note: views are usually 0 until admin updates them, so we just return the count
  const pendingCount = pendingSubmissions.length

  return NextResponse.json({
    stats: {
      totalEarnings: profile.totalEarnings,
      totalViews: profile.totalViews,
      pendingReview: pendingCount,
      payoutMethod: profile.payoutMethod,
      payoutAccount: profile.payoutMethod === 'mpesa' ? profile.mpesaNumber : profile.bankAccount
    },
    payouts: payouts.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        date: p.paidAt || p.createdAt,
        reference: p.reference,
        method: p.method
    })),
    recentApproved: approvedSubmissions.slice(0, 10).map(s => ({
        campaign: s.campaign.brandPublic,
        earnings: s.earnings,
        views: s.views,
        date: s.submittedAt
    }))
  })
}
