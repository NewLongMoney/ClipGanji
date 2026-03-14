import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userId = user.id
      }
      // Re-check profile: on sign-in, when we don't have it yet, or when client calls session.update() (e.g. after registration)
      if (token.userId && (trigger === 'update' || token.hasProfile === undefined || token.hasProfile === false)) {
        const profile = await prisma.clipperProfile.findUnique({
          where: { userId: token.userId as string },
        })
        token.hasProfile = !!profile
        token.profileStatus = profile?.status ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.hasProfile = token.hasProfile as boolean
        session.user.profileStatus = token.profileStatus as string | null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // 1. Relative paths are always safe
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      
      // 2. Same-origin absolute URLs (most reliable check)
      if (url.startsWith(baseUrl)) return url;

      try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        
        // 3. Same hostname (www vs naked, or different Vercel preview URLs for same project)
        const urlHost = urlObj.hostname.replace(/^www\./, '');
        const baseHost = baseObj.hostname.replace(/^www\./, '');
        if (urlHost === baseHost) return url;
      } catch {
        // Fallback for invalid URLs
      }

      // 4. Default: send authenticated users to dashboard, not homepage
      return `${baseUrl}/clippers/dashboard`;
    },
  },
  pages: {
    signIn: '/clippers/login',
    error: '/clippers/login',
  },
}
