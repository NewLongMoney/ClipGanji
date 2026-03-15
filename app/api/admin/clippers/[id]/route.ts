import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-hardened'
import { prisma } from '@/lib/prisma'
import { isValidCuid } from '@/lib/security-hardened'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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

  // Verify profile exists before update
  const profile = await prisma.clipperProfile.findUnique({ 
    where: { id },
    include: {
      user: {
        select: { email: true }
      }
    }
  })

  if (!profile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const updatedProfile = await prisma.clipperProfile.update({
      where: { id },
      data: {
        status,
        approvedAt: status === 'approved' ? new Date() : null,
      },
    })

    // Log admin action for security audit
    console.log('ADMIN_STATUS_UPDATE:', {
      adminEmail: session.user.email,
      profileId: id,
      profileEmail: profile.user.email,
      oldStatus: profile.status,
      newStatus: status,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ 
      success: true, 
      profile: {
        id: updatedProfile.id,
        status: updatedProfile.status,
        approvedAt: updatedProfile.approvedAt
      }
    })
  } catch (error) {
    console.error('Admin status update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  if (!id || !isValidCuid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  // Get profile for logging before deletion
  const profile = await prisma.clipperProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { email: true }
      }
    }
  })

  if (!profile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    // Perform deletion in transaction for data integrity
    await prisma.$transaction(async (tx) => {
      await tx.clipperProfile.delete({ where: { id } })
      await tx.account.deleteMany({ where: { userId: profile.userId } })
      await tx.session.deleteMany({ where: { userId: profile.userId } })
      await tx.user.delete({ where: { id: profile.userId } })
    })

    // Log destructive admin action
    console.log('ADMIN_PROFILE_DELETE:', {
      adminEmail: session.user.email,
      deletedProfileId: id,
      deletedProfileEmail: profile.user.email,
      deletedUserId: profile.userId,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin profile deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
}
