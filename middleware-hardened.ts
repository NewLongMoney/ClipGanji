import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getSecurityHeaders } from '@/lib/security-hardened'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Add security headers to all responses
    const response = NextResponse.next()
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Normalize path to handle trailing slashes
    const normalizedPath = path.replace(/\/$/, '') || '/'

    // Public clipper landing pages - always allow
    const publicClipperPaths = [
      '/clippers',
      '/clippers/login',
      '/clippers/register',
      '/clippers/campaigns'
    ]
    
    if (publicClipperPaths.includes(normalizedPath)) {
      return response
    }

    // Enhanced admin route protection
    if (normalizedPath.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/clippers/login', req.url))
      }
      
      const isAdmin = !!(token as { isAdmin?: boolean }).isAdmin
      if (!isAdmin) {
        console.warn('Unauthorized admin access attempt:', {
          path: normalizedPath,
          email: token.email,
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        })
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Force registration if authenticated but no profile
    if (token && !token.hasProfile && normalizedPath.startsWith('/clippers/')) {
      // Allow registration page itself
      if (normalizedPath === '/clippers/register') {
        return response
      }
      return NextResponse.redirect(new URL('/clippers/register', req.url))
    }

    // API route protection
    if (normalizedPath.startsWith('/api/')) {
      // Admin API routes
      if (normalizedPath.startsWith('/api/admin')) {
        if (!token || !!(token as { isAdmin?: boolean }).isAdmin) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }

      // Clipper API routes
      if (normalizedPath.startsWith('/api/clipper')) {
        if (!token) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        // Additional check for sensitive operations
        const sensitiveRoutes = ['/api/clipper/register', '/api/clipper/submit']
        if (sensitiveRoutes.some(route => normalizedPath.startsWith(route))) {
          if (!token.hasProfile) {
            return NextResponse.json({ error: 'Profile required' }, { status: 403 })
          }
        }
      }
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const normalizedPath = path.replace(/\/$/, '') || '/'
        
        // Root and core public pages
        if (normalizedPath === '/' || normalizedPath === '/contact' || normalizedPath === '/api/contact') {
          return true
        }

        // Public clipper pages (landing/login/register/browse campaigns)
        const publicPaths = [
          '/clippers',
          '/clippers/login',
          '/clippers/register',
          '/clippers/campaigns'
        ]
        if (publicPaths.includes(normalizedPath)) {
          return true
        }

        // Admin UI and API: strict admin check
        if (normalizedPath.startsWith('/admin') || normalizedPath.startsWith('/api/admin')) {
          return !!(token && (token as { isAdmin?: boolean }).isAdmin)
        }

        // Protected internal clipper routes (dashboard/settings/etc)
        if (normalizedPath.startsWith('/clippers/') || normalizedPath.startsWith('/api/clipper/')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/clippers/:path*',
    '/admin/:path*',
    '/api/clipper/:path*',
    '/api/admin/:path*',
  ],
}
