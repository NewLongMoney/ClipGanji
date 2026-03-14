import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidCuid, isValidPlatform, isValidUrl } from '@/lib/security'

export async function POST(req: Request) {
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
  if (typeof postUrl !== 'string' || !isValidUrl(postUrl)) {
    return NextResponse.json({ error: 'Invalid clip URL' }, { status: 400 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const enrollment = await prisma.campaignEnrollment.findUnique({
    where: { clipperId_campaignId: { clipperId: profile.id, campaignId: String(campaignId) } },
  })

  if (!enrollment) {
    return NextResponse.json({ error: 'Not enrolled in this campaign' }, { status: 403 })
  }

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

  return NextResponse.json({ success: true, submissionId: submission.id })
}
