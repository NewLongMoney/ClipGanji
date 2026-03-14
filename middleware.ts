import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

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
      return NextResponse.next()
    }

    // Admin routes: redirect non-admins to home
    if (normalizedPath.startsWith('/admin') && token && !(token as { isAdmin?: boolean }).isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Force registration if authenticated but no profile
    if (token && !token.hasProfile && normalizedPath.startsWith('/clippers/')) {
      return NextResponse.redirect(new URL('/clippers/register', req.url))
    }

    return NextResponse.next()
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

        // Admin UI and API: only clipganji@gmail.com
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
