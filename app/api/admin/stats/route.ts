import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [
    clippersTotal,
    clippersPending,
    submissionsPending,
    contactsUnread,
    campaignsActive,
  ] = await Promise.all([
    prisma.clipperProfile.count(),
    prisma.clipperProfile.count({ where: { status: 'pending' } }),
    prisma.submission.count({ where: { status: 'pending' } }),
    prisma.contactSubmission.count(),
    prisma.campaign.count({ where: { status: 'open' } }),
  ])

  return NextResponse.json({
    clippersTotal,
    clippersPending,
    submissionsPending,
    contactsUnread,
    campaignsActive,
  })
}
