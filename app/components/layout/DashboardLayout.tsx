'use client'
import { ReactNode, useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Megaphone, Upload, Wallet,
  Settings, LogOut, Bell, Menu, X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/app/lib/utils"

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/clippers/dashboard' },
  { label: 'Campaigns', icon: Megaphone, href: '/clippers/campaigns' },
  { label: 'My Submissions', icon: Upload, href: '/clippers/submissions' },
  { label: 'Earnings', icon: Wallet, href: '/clippers/earnings' },
  { label: 'Settings', icon: Settings, href: '/clippers/settings' },
]

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (authStatus === 'unauthenticated') router.push('/clippers/login')
  }, [authStatus, router])

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#060809] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (authStatus === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-[#060809] flex font-sans selection:bg-[#00C853]/30 selection:text-white">
      
      {/* ── SIDEBAR (Desktop) ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0E1214] border-r border-[#1E2428] fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-[#1E2428]">
          <Link href="/" className="group">
            <span className="font-anton text-2xl text-white group-hover:text-[#00C853] transition-colors uppercase">CLIP</span>
            <span className="font-anton text-2xl text-[#00C853] group-hover:text-white transition-colors uppercase">GANJI</span>
          </Link>
          <p className="text-[#4A5259] text-[10px] font-mono mt-1 tracking-widest">{"// CLIPPER PORTAL"}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent",
                  isActive
                    ? "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20 shadow-[0_0_20px_rgba(0,200,83,0.05)]"
                    : "text-[#8A949C] hover:text-white hover:bg-[#141414] hover:border-[#1E2428]"
                )}
              >
                <item.icon size={18} className={cn("transition-colors", isActive ? "text-[#00C853]" : "text-[#4A5259]")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#1E2428]">
          <div className="flex items-center gap-3 mb-4 bg-black/30 p-3 rounded-2xl border border-[#1E2428]">
            <div className="relative">
              <Image
                src={session?.user?.image || "/images/avatar-placeholder.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full border border-[#00C853]/20"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00C853] border-2 border-[#0E1214] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate tracking-tight">{session?.user?.name}</p>
              <p className="text-[#4A5259] text-[10px] truncate font-mono uppercase">{session?.user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/clippers/login' })}
            className="w-full h-10 flex items-center justify-center gap-2 text-[#4A5259] hover:text-red-400
                       hover:bg-red-500/5 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-red-500/20"
            aria-label="Sign out"
          >
            <LogOut size={14} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* ── MOBILE NAV OVERLAY ────────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-[#0E1214] z-[70] p-6 border-r border-[#1E2428]"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="font-anton text-2xl text-white uppercase">CLIP<span className="text-[#00C853]">GANJI</span></Link>
                <button onClick={() => setSidebarOpen(false)} className="text-gray hover:text-white" aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all border border-transparent",
                      pathname === item.href 
                        ? "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20" 
                        : "text-[#8A949C] hover:text-white"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                 <button
                  onClick={() => signOut({ callbackUrl: '/clippers/login' })}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-red-500/5 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold"
                >
                  <LogOut size={16} />
                  SIGN OUT
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-[#060809]/80 backdrop-blur-xl border-b border-[#1E2428] px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray hover:text-white transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-anton text-xl text-white tracking-wider uppercase leading-none">{title}</h1>
              {subtitle && <p className="text-[#4A5259] text-[10px] font-mono mt-1 uppercase tracking-widest">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-[#4A5259] hover:text-white hover:bg-white/5 rounded-full transition-all" aria-label="View notifications">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00C853] rounded-full ring-2 ring-[#060809]" />
            </button>
            <div className="hidden sm:block h-10 w-[1px] bg-[#1E2428]" />
            <div className="hidden sm:flex items-center gap-3">
               <div className="text-right">
                  <p className="text-white text-[11px] font-bold leading-tight">{session?.user?.name}</p>
                  <p className="text-[#00C853] text-[9px] font-mono tracking-tighter">VERIFIED CLIPPER</p>
               </div>
               <Image
                 src={session?.user?.image || "/images/avatar-placeholder.png"}
                 alt="User"
                 width={32}
                 height={32}
                 className="rounded-full ring-1 ring-[#1E2428]"
               />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 relative overflow-x-hidden">
          {children}
        </div>

        {/* ── MOBILE TAB BAR (Only if preferred, but Sidebar + Header is cleaner) ── */}
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-[#0E1214]/90 backdrop-blur-lg border border-[#1E2428] rounded-2xl flex items-center justify-around px-2 z-50 shadow-2xl">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                  isActive ? "text-[#00C853] bg-[#00C853]/5" : "text-[#4A5259]"
                )}
                aria-label={item.label}
              >
                <item.icon size={20} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </nav>
      </main>
    </div>
  )
}
