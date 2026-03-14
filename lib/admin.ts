import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/** Admin email from env; never hardcode credentials. */
export function getAdminEmail(): string {
  const e = process.env.ADMIN_EMAIL
  return typeof e === 'string' && e.trim() ? e.trim().toLowerCase() : 'clipganji@gmail.com'
}

function normalizeEmail(email: string | null | undefined): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  const email = normalizeEmail(session?.user?.email)
  if (!email || email !== getAdminEmail()) {
    return null
  }
  return session
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return normalizeEmail(email) === getAdminEmail()
}
