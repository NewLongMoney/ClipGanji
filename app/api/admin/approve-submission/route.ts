// Only you (admin) calls this — add a simple secret key check
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Simple admin auth — add ADMIN_SECRET to env vars
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { submissionId, views } = await req.json()

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { campaign: true },
  })

  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const earnings = (views / 1000) * submission.campaign.payPer1000Views

  // Update submission
  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: 'approved', views, earnings, reviewedAt: new Date() },
  })

  // Update enrollment aggregates
  await prisma.campaignEnrollment.updateMany({
    where: {
      clipperId: submission.clipperId,
      campaignId: submission.campaignId,
    },
    data: {
      totalViews: { increment: views },
      totalEarnings: { increment: earnings },
      clipsApproved: { increment: 1 },
    },
  })

  // Update clipper total
  await prisma.clipperProfile.update({
    where: { id: submission.clipperId },
    data: {
      totalViews: { increment: views },
      totalEarnings: { increment: earnings },
    },
  })

  return NextResponse.json({ success: true, earnings })
}
