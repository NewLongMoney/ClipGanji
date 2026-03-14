import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const statusParam = searchParams.get('status')
  const status = statusParam === 'pending' || statusParam === 'approved' || statusParam === 'rejected'
    ? statusParam
    : null
  const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10) || 50), 100)

  const where = status ? { status } : {}

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    take: limit,
    include: {
      clipper: { select: { id: true, fullName: true, phone: true } },
      campaign: { select: { id: true, brandPublic: true, category: true, payPer1000Views: true } },
    },
  })

  return NextResponse.json(
    submissions.map((s) => ({
      id: s.id,
      platform: s.platform,
      postUrl: s.postUrl,
      views: s.views,
      earnings: s.earnings,
      status: s.status,
      rejectionReason: s.rejectionReason,
      submittedAt: s.submittedAt.toISOString(),
      reviewedAt: s.reviewedAt?.toISOString() ?? null,
      clipper: s.clipper,
      campaign: s.campaign,
    }))
  )
}
