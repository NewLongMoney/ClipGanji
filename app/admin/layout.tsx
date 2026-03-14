'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  Upload,
  Mail,
  LogOut,
  Shield,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Clippers', href: '/admin/clippers', icon: Users },
  { label: 'Submissions', href: '/admin/submissions', icon: Upload },
  { label: 'Contact Briefs', href: '/admin/contacts', icon: Mail },
]

export default function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/clippers/login?callbackUrl=${encodeURIComponent('/admin')}`)
      return
    }
    if (status === 'loaded' && session && !isAdmin) {
      router.push('/')
    }
  }, [status, session, isAdmin, router])

  if (status === 'loading' || (status === 'authenticated' && !isAdmin)) {
    return (
      <div className="min-h-screen bg-[#060809] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F5B800] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#060809] flex font-sans text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0E1214] border-r border-[#1E2428] fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-[#1E2428]">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#F5B800]" />
            <span className="font-anton text-xl text-white uppercase">CLIP</span>
            <span className="font-anton text-xl text-[#F5B800] uppercase">ADMIN</span>
          </Link>
          <p className="text-[#4A5259] text-[10px] font-mono mt-1">clipganji@gmail.com</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                pathname === item.href
                  ? 'bg-[#F5B800]/10 text-[#F5B800] border border-[#F5B800]/20'
                  : 'text-[#8A949C] hover:text-white hover:bg-[#141414]'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1E2428] space-y-2">
          <Link
            href="/"
            className="block w-full text-center text-[#8A949C] hover:text-white text-xs"
          >
            ← Back to site
          </Link>
          <button
            onClick={() => router.push('/api/auth/signout?callbackUrl=/')}
            className="w-full flex items-center justify-center gap-2 text-[#4A5259] hover:text-red-400 hover:bg-red-500/5 rounded-xl py-2 text-xs font-bold"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-[#060809]/90 backdrop-blur border-b border-[#1E2428] px-6 h-16 flex items-center gap-4">
          <span className="font-anton text-lg text-white uppercase tracking-wider">
            {navItems.find((i) => i.href === pathname)?.label ?? 'Admin'}
          </span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
