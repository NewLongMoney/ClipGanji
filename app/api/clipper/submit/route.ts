import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidCuid, isValidPlatform, isValidSocialUrl, rateLimitSubmission } from '@/lib/security-hardened'
import { logAdminAction } from '@/lib/admin-hardened'

export async function POST(req: Request) {
  // Rate limiting first
  if (!rateLimitSubmission(req)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const b = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const campaignId = b.campaignId
  const platform = b.platform
  const postUrl = b.postUrl

  if (!campaignId || !platform || !postUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (!isValidCuid(campaignId)) {
    return NextResponse.json({ error: 'Invalid campaign' }, { status: 400 })
  }
  if (!isValidPlatform(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }
  if (typeof postUrl !== 'string' || !isValidSocialUrl(postUrl)) {
    return NextResponse.json({ error: 'Invalid social media URL. Only TikTok, Instagram, and YouTube URLs are allowed.' }, { status: 400 })
  }

  // Verify user's profile exists and is approved
  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      enrollments: {
        where: { campaignId: String(campaignId) }
      }
    }
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profile.status !== 'approved') {
    return NextResponse.json({ error: 'Profile not approved' }, { status: 403 })
  }

  // Verify enrollment exists and is active
  const enrollment = profile.enrollments[0]
  if (!enrollment || enrollment.status !== 'active') {
    return NextResponse.json({ error: 'Not enrolled in this campaign' }, { status: 403 })
  }

  // Check campaign is still active
  const campaign = await prisma.campaign.findUnique({
    where: { id: String(campaignId) },
    select: { status: true, endDate: true }
  })

  if (!campaign || campaign.status !== 'open' || new Date(campaign.endDate) < new Date()) {
    return NextResponse.json({ error: 'Campaign is not active' }, { status: 403 })
  }

  // Check for duplicate submissions
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      clipperId: profile.id,
      campaignId: String(campaignId),
      postUrl: postUrl.trim().slice(0, 2048)
    }
  })

  if (existingSubmission) {
    return NextResponse.json({ error: 'This URL has already been submitted' }, { status: 409 })
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        clipperId: profile.id,
        campaignId: String(campaignId),
        platform: String(platform),
        postUrl: postUrl.trim().slice(0, 2048),
        status: 'pending',
      },
    })

    // Update enrollment clip count
    await prisma.campaignEnrollment.update({
      where: { id: enrollment.id },
      data: { clipsSubmitted: { increment: 1 } },
    })

    // Log submission for security monitoring
    console.log('SUBMISSION_CREATED:', {
      submissionId: submission.id,
      clipperId: profile.id,
      campaignId: String(campaignId),
      userId: session.user.id,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true, submissionId: submission.id })
  } catch (error) {
    console.error('Submission creation error:', error)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}
