import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { campaignId, platform, postUrl } = await req.json()

  if (!campaignId || !platform || !postUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Confirm they're enrolled in this campaign
  const enrollment = await prisma.campaignEnrollment.findUnique({
    where: { clipperId_campaignId: { clipperId: profile.id, campaignId } },
  })

  if (!enrollment) {
    return NextResponse.json({ error: 'Not enrolled in this campaign' }, { status: 403 })
  }

  const submission = await prisma.submission.create({
    data: {
      clipperId: profile.id,
      campaignId,
      platform,
      postUrl,
      status: 'pending',
    },
  })

  // Update enrollment clip count
  await prisma.campaignEnrollment.update({
    where: { id: enrollment.id },
    data: { clipsSubmitted: { increment: 1 } },
  })

  return NextResponse.json({ success: true, submissionId: submission.id })
}
