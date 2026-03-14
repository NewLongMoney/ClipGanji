import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeString, isValidPayoutMethod, profileLimits } from '@/lib/security'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      enrollments: {
        include: { campaign: true },
        where: { status: 'active' },
      },
      submissions: {
        orderBy: { submittedAt: 'desc' },
        take: 10,
        include: { campaign: true },
      },
    },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json(profile)
}

export async function PATCH(req: Request) {
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
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const payoutMethod = b.payoutMethod
  if (payoutMethod !== undefined && !isValidPayoutMethod(payoutMethod)) {
    return NextResponse.json({ error: 'Invalid payout method' }, { status: 400 })
  }

  const data: Record<string, string | null> = {}
  if (b.fullName !== undefined) {
    const v = sanitizeString(b.fullName, profileLimits.fullName)
    if (!v) return NextResponse.json({ error: 'Full name required' }, { status: 400 })
    data.fullName = v
  }
  if (b.phone !== undefined) {
    const v = sanitizeString(b.phone, profileLimits.phone)
    if (!v) return NextResponse.json({ error: 'Phone required' }, { status: 400 })
    data.phone = v
  }
  if (b.tiktokHandle !== undefined) data.tiktokHandle = sanitizeString(b.tiktokHandle, profileLimits.tiktokHandle) || null
  if (b.instagramHandle !== undefined) data.instagramHandle = sanitizeString(b.instagramHandle, profileLimits.instagramHandle) || null
  if (b.youtubeChannel !== undefined) data.youtubeChannel = sanitizeString(b.youtubeChannel, profileLimits.youtubeChannel) || null
  if (isValidPayoutMethod(payoutMethod)) data.payoutMethod = payoutMethod
  if (b.mpesaNumber !== undefined) data.mpesaNumber = sanitizeString(b.mpesaNumber, profileLimits.mpesaNumber) || null
  if (b.bankName !== undefined) data.bankName = sanitizeString(b.bankName, profileLimits.bankName) || null
  if (b.bankAccount !== undefined) data.bankAccount = sanitizeString(b.bankAccount, profileLimits.bankAccount) || null

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  try {
    const updatedProfile = await prisma.clipperProfile.update({
      where: { userId: session.user.id },
      data,
    })
    return NextResponse.json(updatedProfile)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
