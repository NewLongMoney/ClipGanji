import { NextResponse } from 'next/server'

/**
 * Legacy endpoint — disabled for security.
 * All clipper registration goes through /api/clipper/register (session-based).
 * This route was unauthenticated and could be abused for spam/PII injection.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is no longer available. Please use the clipper portal to register.' },
    { status: 410 }
  )
}
