import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // If signed in but no profile → force to register
    // (except if they're already on the register page)
    if (
      token &&
      !token.hasProfile &&
      path.startsWith('/clippers/') &&
      !path.startsWith('/clippers/register') &&
      !path.startsWith('/clippers/login')
    ) {
      return NextResponse.redirect(new URL('/clippers/register', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Public clipper pages
        // Public paths
        if (
          path === '/' ||
          path === '/contact' ||
          path === '/clippers' ||
          path === '/clippers/login' ||
          path === '/api/contact' ||
          path.startsWith('/clippers/campaigns/')
        ) {
          return true
        }

        // Admin routes
        if (path.startsWith('/api/admin')) {
          // Additional check for admin secret is done in the route
          return !!token
        }

        // Clipper routes
        if (path.startsWith('/clippers') || path.startsWith('/api/clipper')) {
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
