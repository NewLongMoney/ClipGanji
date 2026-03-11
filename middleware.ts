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
        if (
          path === '/clippers' ||
          path === '/clippers/login' ||
          path === '/clippers/campaigns' ||
          path.startsWith('/clippers/campaigns/')
        ) {
          return true
        }
        // Everything else needs auth
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/clippers/:path*'],
}
