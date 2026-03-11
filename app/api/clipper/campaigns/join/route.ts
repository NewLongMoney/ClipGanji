import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { campaignId } = await req.json()

  const profile = await prisma.clipperProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  try {
    const enrollment = await prisma.campaignEnrollment.create({
      data: {
        clipperId: profile.id,
        campaignId,
        status: 'active',
      },
    })
    return NextResponse.json({ success: true, enrollmentId: enrollment.id })
  } catch {
    return NextResponse.json({ error: 'Already enrolled or invalid campaign' }, { status: 400 })
  }
}
