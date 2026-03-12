import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public clipper landing pages - always allow
    const publicClipperPaths = [
      '/clippers',
      '/clippers/login',
      '/clippers/register',
      '/clippers/campaigns'
    ]
    
    if (publicClipperPaths.includes(path)) {
      return NextResponse.next()
    }

    // Force registration if authenticated but no profile
    if (token && !token.hasProfile && path.startsWith('/clippers/')) {
      return NextResponse.redirect(new URL('/clippers/register', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Root and core public pages
        if (path === '/' || path === '/contact' || path === '/api/contact') {
          return true
        }

        // Public clipper pages (landing/login/register/browse campaigns)
        const publicPaths = [
          '/clippers',
          '/clippers/login',
          '/clippers/register',
          '/clippers/campaigns'
        ]
        if (publicPaths.includes(path)) {
          return true
        }

        // Admin routes
        if (path.startsWith('/api/admin')) {
          return !!token
        }

        // Protected internal clipper routes (dashboard/settings/etc)
        if (path.startsWith('/clippers/') || path.startsWith('/api/clipper/')) {
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
