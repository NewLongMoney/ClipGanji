export { default } from 'next-auth/middleware'

// Protect all /clippers/dashboard, /clippers/submissions, /clippers/earnings, /clippers/settings
export const config = {
  matcher: [
    '/clippers/dashboard/:path*',
    '/clippers/submissions/:path*',
    '/clippers/earnings/:path*',
    '/clippers/settings/:path*',
  ]
}
