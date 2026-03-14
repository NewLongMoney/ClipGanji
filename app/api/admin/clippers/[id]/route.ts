import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { isValidCuid } from '@/lib/security'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  if (!id || !isValidCuid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { status } = (typeof body === 'object' && body !== null ? body : {}) as { status?: 'approved' | 'rejected' }

  if (!status || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const profile = await prisma.clipperProfile.findUnique({ where: { id } })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.clipperProfile.update({
    where: { id },
    data: {
      status,
      approvedAt: status === 'approved' ? new Date() : null,
    },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  if (!id || !isValidCuid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const profile = await prisma.clipperProfile.findUnique({
    where: { id },
    select: { userId: true },
  })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.clipperProfile.delete({ where: { id } })
  await prisma.account.deleteMany({ where: { userId: profile.userId } })
  await prisma.session.deleteMany({ where: { userId: profile.userId } })
  await prisma.user.delete({ where: { id: profile.userId } })

  return NextResponse.json({ success: true })
}
