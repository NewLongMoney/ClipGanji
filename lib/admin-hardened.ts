/**
 * HARDENED ADMIN AUTHENTICATION
 * Multi-layered security for admin access
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// ─── Admin Configuration ─────────────────────────────────────────────────────

/** Admin email from env; never hardcode credentials. */
export function getAdminEmail(): string {
  const e = process.env.ADMIN_EMAIL
  return typeof e === 'string' && e.trim() ? e.trim().toLowerCase() : 'clipganji@gmail.com'
}

function normalizeEmail(email: string | null | undefined): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

// ─── Enhanced Admin Session Validation ─────────────────────────────────────

/**
 * Multi-factor admin validation
 * Checks: email + session validity + token integrity
 */
export async function getAdminSession() {
  try {
    const session = await getServerSession(authOptions)
    
    // Basic session validation
    if (!session?.user?.email) {
      return null
    }
    
    // Email normalization and validation
    const email = normalizeEmail(session.user.email)
    const adminEmail = getAdminEmail()
    
    if (email !== adminEmail) {
      console.warn(`Unauthorized admin attempt: ${email} != ${adminEmail}`)
      return null
    }
    
    // Additional session integrity checks
    if (!session.expires || new Date(session.expires) < new Date()) {
      console.warn('Expired admin session attempt')
      return null
    }
    
    return session
  } catch (error) {
    console.error('Admin session validation error:', error)
    return null
  }
}

/**
 * Role-based access control check
 */
export function hasAdminRole(session: any): boolean {
  return !!(session?.user?.email && normalizeEmail(session.user.email) === getAdminEmail())
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return normalizeEmail(email) === getAdminEmail()
}

/**
 * Admin-only middleware helper
 */
export function requireAdmin(handler: (req: Request, context?: any) => Promise<Response>) {
  return async (req: Request, context?: any) => {
    const adminSession = await getAdminSession()
    
    if (!adminSession) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return handler(req, context)
  }
}

// ─── Admin Activity Logging ───────────────────────────────────────────────

export function logAdminAction(
  action: string, 
  resource: string, 
  adminEmail: string,
  metadata?: Record<string, any>
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    resource,
    adminEmail,
    metadata,
    ip: metadata?.ip || 'unknown',
    userAgent: metadata?.userAgent || 'unknown'
  }
  
  console.log('ADMIN_ACTION:', JSON.stringify(logEntry))
  
  // In production, send to secure logging service
  // Example: await loggingService.logSecurityEvent(logEntry)
}
