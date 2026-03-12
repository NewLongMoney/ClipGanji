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
      // If the user is signing in, check where we should send them
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/clippers/login',
    error: '/clippers/login',
  },
}
