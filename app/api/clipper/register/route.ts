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

  const safeInt = (val: unknown) => {
    const parsed = parseInt(val as string)
    return isNaN(parsed) ? 0 : parsed
  }

  try {
    // Ensure User record exists (NextAuth might not have created it yet in the new DB)
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
        tiktokFollowers: safeInt(body.tiktokFollowers),
        instagramHandle: body.instagramHandle || null,
        instagramFollowers: safeInt(body.instagramFollowers),
        youtubeChannel: body.youtubeChannel || null,
        youtubeSubscribers: safeInt(body.youtubeSubscribers),
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
    console.error('Registration error detail:', error)
    return NextResponse.json({ 
      error: 'Failed to save profile',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
