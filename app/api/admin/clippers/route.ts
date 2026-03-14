import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const profiles = await prisma.clipperProfile.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, email: true, name: true, image: true } },
      _count: { select: { submissions: true, enrollments: true } },
    },
  })

  return NextResponse.json(
    profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      fullName: p.fullName,
      phone: p.phone,
      county: p.county,
      email: p.user.email,
      status: p.status,
      approvedAt: p.approvedAt?.toISOString() ?? null,
      totalEarnings: p.totalEarnings,
      totalViews: p.totalViews,
      tiktokHandle: p.tiktokHandle,
      instagramHandle: p.instagramHandle,
      createdAt: p.createdAt.toISOString(),
      submissionsCount: p._count.submissions,
      enrollmentsCount: p._count.enrollments,
    }))
  )
}
