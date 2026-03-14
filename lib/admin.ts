import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const ADMIN_EMAIL_NORMALIZED = 'clipganji@gmail.com'

function normalizeEmail(email: string | null | undefined): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  const email = normalizeEmail(session?.user?.email)
  if (!email || email !== ADMIN_EMAIL_NORMALIZED) {
    return null
  }
  return session
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return normalizeEmail(email) === ADMIN_EMAIL_NORMALIZED
}
