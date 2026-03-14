/**
 * Security utilities: input validation, sanitization, rate limiting.
 * Use everywhere user/attacker-controlled input is accepted or displayed.
 */

// ─── Constants ─────────────────────────────────────────────────────────────

const MAX_STRING = 2000
const MAX_EMAIL = 254
const MAX_PHONE = 20
const MAX_URL = 2048
const MAX_MESSAGE = 10000
const MAX_NAME = 200
const MAX_COMPANY = 300
const MAX_BUDGET_OPTION = 50
const MAX_REJECTION_REASON = 500
const MAX_VIEWS = 500_000_000 // 500M cap to avoid overflow

const PLATFORMS = ['tiktok', 'instagram', 'youtube'] as const
const PAYOUT_METHODS = ['mpesa', 'bank'] as const
const CUID_REGEX = /^c[a-z0-9]{24}$/i

// ─── Sanitization (output / storage) ───────────────────────────────────────

/** Escape HTML to prevent XSS when rendering user content. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Coerce to string and trim; max length. */
export function sanitizeString(
  val: unknown,
  maxLen: number = MAX_STRING
): string {
  const s = typeof val === 'string' ? val : val != null ? String(val) : ''
  const t = s.trim()
  return t.length > maxLen ? t.slice(0, maxLen) : t
}

// ─── Validation ────────────────────────────────────────────────────────────

export function isValidCuid(id: unknown): id is string {
  return typeof id === 'string' && CUID_REGEX.test(id) && id.length <= 30
}

export function isValidEmail(val: unknown): boolean {
  if (typeof val !== 'string') return false
  const t = val.trim()
  if (t.length > MAX_EMAIL || t.length < 3) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

export function isValidUrl(val: unknown): boolean {
  if (typeof val !== 'string') return false
  const t = val.trim()
  if (t.length > MAX_URL || t.length < 10) return false
  try {
    const u = new URL(t)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

/** Safe href for links: only http/https to prevent javascript: or other schemes. */
export function safeHref(url: string | null | undefined): string {
  if (typeof url !== 'string' || !url.trim()) return '#'
  if (!isValidUrl(url.trim())) return '#'
  return url.trim()
}

export function isValidPlatform(val: unknown): val is (typeof PLATFORMS)[number] {
  return typeof val === 'string' && PLATFORMS.includes(val as (typeof PLATFORMS)[number])
}

export function isValidPayoutMethod(val: unknown): val is (typeof PAYOUT_METHODS)[number] {
  return typeof val === 'string' && PAYOUT_METHODS.includes(val as (typeof PAYOUT_METHODS)[number])
}

/** Non‑negative integer, optionally capped. */
export function safeNonNegativeInt(
  val: unknown,
  max: number = Number.MAX_SAFE_INTEGER
): number {
  const n = typeof val === 'number' ? val : parseInt(String(val), 10)
  if (Number.isNaN(n) || n < 0) return 0
  return n > max ? max : n
}

// ─── Contact form limits ───────────────────────────────────────────────────

export const contactLimits = {
  companyName: MAX_COMPANY,
  name: MAX_NAME,
  email: MAX_EMAIL,
  budget: MAX_BUDGET_OPTION,
  message: MAX_MESSAGE,
}

// ─── Profile / register limits ─────────────────────────────────────────────

export const profileLimits = {
  fullName: MAX_NAME,
  phone: MAX_PHONE,
  county: 100,
  tiktokHandle: 100,
  instagramHandle: 100,
  youtubeChannel: 150,
  bankName: 100,
  bankAccount: 50,
  mpesaNumber: MAX_PHONE,
}

export const submissionLimits = {
  views: MAX_VIEWS,
  rejectionReason: MAX_REJECTION_REASON,
}

// ─── Rate limiting (in‑memory; use Redis/KV in production) ──────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_CONTACT = 5 // 5 contact submissions per minute per key
const RATE_LIMIT_CLIPPER_REGISTER = 3
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000

function getClientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') ?? 'unknown'
  return ip
}

function cleanupStore(): void {
  const now = Date.now()
  for (const [key, v] of rateLimitStore.entries()) {
    if (v.resetAt < now) rateLimitStore.delete(key)
  }
}

let cleanupTimer: ReturnType<typeof setInterval> | null = null
function scheduleCleanup(): void {
  if (cleanupTimer) return
  cleanupTimer = setInterval(cleanupStore, CLEANUP_INTERVAL_MS)
  if (cleanupTimer.unref) cleanupTimer.unref()
}

/**
 * Returns true if request is within limit, false if rate limited.
 * Call this at the start of a handler; if false, return 429.
 */
export function checkRateLimit(
  req: Request,
  keyPrefix: string,
  maxPerWindow: number
): boolean {
  scheduleCleanup()
  const key = `${keyPrefix}:${getClientKey(req)}`
  const now = Date.now()
  const entry = rateLimitStore.get(key)
  if (!entry) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  entry.count += 1
  return entry.count <= maxPerWindow
}

export function rateLimitContact(req: Request): boolean {
  return checkRateLimit(req, 'contact', RATE_LIMIT_CONTACT)
}

export function rateLimitClipperRegister(req: Request): boolean {
  return checkRateLimit(req, 'clipper-register', RATE_LIMIT_CLIPPER_REGISTER)
}
