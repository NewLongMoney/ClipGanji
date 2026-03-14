import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  sanitizeString,
  isValidPayoutMethod,
  isValidUrl,
  profileLimits,
  safeNonNegativeInt,
} from '@/lib/security'

const CONTENT_TYPES_MAX = 20
const CONTENT_TYPE_ITEM_MAX = 50

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
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const fullName = sanitizeString(b.fullName, profileLimits.fullName)
  const phone = sanitizeString(b.phone, profileLimits.phone)
  const county = sanitizeString(b.county, profileLimits.county)
  const payoutMethod = b.payoutMethod

  if (!fullName || !phone || !county || !payoutMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!isValidPayoutMethod(payoutMethod)) {
    return NextResponse.json({ error: 'Invalid payout method' }, { status: 400 })
  }

  const bestClipUrlRaw = sanitizeString(b.bestClipUrl, 2048)
  const bestClipUrl = bestClipUrlRaw && isValidUrl(bestClipUrlRaw) ? bestClipUrlRaw : null

  let contentTypes: string[] = []
  if (Array.isArray(b.contentTypes)) {
    contentTypes = b.contentTypes
      .slice(0, CONTENT_TYPES_MAX)
      .filter((x): x is string => typeof x === 'string')
      .map((x) => sanitizeString(x, CONTENT_TYPE_ITEM_MAX))
      .filter(Boolean)
  }

  const mpesaNumber = b.payoutMethod === 'mpesa'
    ? sanitizeString(b.mpesaNumber, profileLimits.mpesaNumber) || null
    : null
  const bankName = b.payoutMethod === 'bank'
    ? sanitizeString(b.bankName, profileLimits.bankName) || null
    : null
  const bankAccount = b.payoutMethod === 'bank'
    ? sanitizeString(b.bankAccount ?? b.accountNumber, profileLimits.bankAccount) || null
    : null

  try {
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    })

    const existing = await prisma.clipperProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (existing) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
    }

    const profile = await prisma.clipperProfile.create({
      data: {
        userId: session.user.id,
        fullName,
        phone,
        county,
        tiktokHandle: sanitizeString(b.tiktokHandle, profileLimits.tiktokHandle) || null,
        tiktokFollowers: safeNonNegativeInt(b.tiktokFollowers, 999_999_999),
        instagramHandle: sanitizeString(b.instagramHandle, profileLimits.instagramHandle) || null,
        instagramFollowers: safeNonNegativeInt(b.instagramFollowers, 999_999_999),
        youtubeChannel: sanitizeString(b.youtubeChannel, profileLimits.youtubeChannel) || null,
        youtubeSubscribers: safeNonNegativeInt(b.youtubeSubscribers, 999_999_999),
        postFrequency: sanitizeString(b.postFrequency ?? b.postingFrequency, 50) || null,
        contentTypes,
        audienceDescription: null,
        bestClipUrl,
        payoutMethod,
        mpesaNumber,
        bankName,
        bankAccount,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, profileId: profile.id })
  } catch {
    console.error('Registration error')
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
