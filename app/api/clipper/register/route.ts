import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()

  // Validate required fields
  if (!body.fullName || !body.phone || !body.county || !body.payoutMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Check if profile already exists
    const existing = await prisma.clipperProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (existing) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
    }

    const profile = await prisma.clipperProfile.create({
      data: {
        userId: session.user.id,
        fullName: body.fullName,
        phone: body.phone,
        county: body.county,
        tiktokHandle: body.tiktokHandle || null,
        tiktokFollowers: body.tiktokFollowers ? parseInt(body.tiktokFollowers) : 0,
        instagramHandle: body.instagramHandle || null,
        instagramFollowers: body.instagramFollowers ? parseInt(body.instagramFollowers) : 0,
        youtubeChannel: body.youtubeChannel || null,
        youtubeSubscribers: body.youtubeSubscribers ? parseInt(body.youtubeSubscribers) : 0,
        postFrequency: body.postFrequency || null,
        contentTypes: body.contentTypes || [],
        audienceDescription: body.audienceDescription || null,
        bestClipUrl: body.bestClipUrl || null,
        payoutMethod: body.payoutMethod,
        mpesaNumber: body.mpesaNumber || null,
        bankName: body.bankName || null,
        bankAccount: body.bankAccount || null,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, profileId: profile.id })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
