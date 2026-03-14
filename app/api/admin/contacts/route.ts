import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10) || 50, 100)

  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json(
    contacts.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      name: c.name,
      email: c.email,
      budget: c.budget,
      message: c.message,
      requestRateCard: c.requestRateCard,
      createdAt: c.createdAt.toISOString(),
    }))
  )
}
