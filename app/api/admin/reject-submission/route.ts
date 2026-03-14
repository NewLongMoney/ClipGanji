import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { isValidCuid, sanitizeString, submissionLimits } from '@/lib/security'

export async function POST(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const b = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const submissionId = b.submissionId
  if (!submissionId || !isValidCuid(submissionId)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  const reason = sanitizeString(b.reason, submissionLimits.rejectionReason) || null

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  })

  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (submission.status !== 'pending') {
    return NextResponse.json({ error: 'Submission already reviewed' }, { status: 400 })
  }

  await prisma.submission.update({
    where: { id: String(submissionId) },
    data: {
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}
