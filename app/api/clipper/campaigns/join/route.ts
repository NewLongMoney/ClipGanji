import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidCuid } from '@/lib/security'

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
  const campaignId = typeof body === 'object' && body !== null && 'campaignId' in body
    ? (body as { campaignId: unknown }).campaignId
    : undefined

  if (!campaignId || !isValidCuid(campaignId)) {
    return NextResponse.json({ error: 'Invalid campaign' }, { status: 400 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: String(campaignId) },
    select: { id: true, status: true },
  })
  if (!campaign || campaign.status !== 'open') {
    return NextResponse.json({ error: 'Campaign not available' }, { status: 400 })
  }

  try {
    const enrollment = await prisma.campaignEnrollment.create({
      data: {
        clipperId: profile.id,
        campaignId: String(campaignId),
        status: 'active',
      },
    })
    return NextResponse.json({ success: true, enrollmentId: enrollment.id })
  } catch {
    return NextResponse.json({ error: 'Already enrolled or invalid campaign' }, { status: 400 })
  }
}
