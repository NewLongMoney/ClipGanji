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
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        const profile = await prisma.clipperProfile.findUnique({
          where: { userId: user.id },
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
      // 1. If it's a relative path, use it
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        
        // 2. If it's the same domain (allowing for www vs naked mismatch), allow it
        if (urlObj.hostname.replace('www.', '') === baseObj.hostname.replace('www.', '')) {
          return url;
        }
      } catch {
        // Fallback for invalid URLs
      }

      // 3. Default to baseUrl
      return baseUrl;
    },
  },
  pages: {
    signIn: '/clippers/login',
    error: '/clippers/login',
  },
}
