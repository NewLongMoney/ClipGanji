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

    // Force registration if authenticated but no profile
    // Only redirect if NOT already on a public page (which we checked above)
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

        // Admin routes
        if (normalizedPath.startsWith('/api/admin')) {
          return !!token
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
    '/api/clipper/:path*',
    '/api/admin/:path*',
  ],
}
