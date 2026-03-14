'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Megaphone, Upload, Wallet,
  Settings, LogOut, CheckCircle, Clock, AlertCircle,
  ExternalLink, ChevronLeft
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Submission } from '@/app/types/dashboard'
import { safeHref } from '@/lib/security'
import Image from 'next/image'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/clippers/dashboard' },
  { label: 'Campaigns', icon: Megaphone, href: '/clippers/campaigns' },
  { label: 'My Submissions', icon: Upload, href: '/clippers/submissions', active: true },
  { label: 'Earnings', icon: Wallet, href: '/clippers/earnings' },
  { label: 'Settings', icon: Settings, href: '/clippers/settings' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    approved: { cls: 'bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30', icon: <CheckCircle size={11} /> },
    pending:  { cls: 'bg-[#F5B800]/15 text-[#F5B800] border border-[#F5B800]/30', icon: <Clock size={11} /> },
    rejected: { cls: 'bg-red-500/15 text-red-400 border border-red-500/30', icon: <AlertCircle size={11} /> },
  }
  const s = map[status] ?? map.pending
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.icon}{status}
    </span>
  )
}

export default function SubmissionsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  useEffect(() => {
    if (authStatus === 'unauthenticated') router.push('/clippers/login')
  }, [authStatus, router])

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetch('/api/clipper/submissions')
        .then(r => r.json())
        .then(data => {
          setSubmissions(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [authStatus])

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter)

  const totalEarnings = submissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + (s.earnings || 0), 0)
  const totalViews = submissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + (s.views || 0), 0)

  if (loading || authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#060809] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060809] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0E1214] border-r border-[#1E2428] fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-[#1E2428]">
          <a href="/"><span className="font-anton text-2xl text-white">CLIP</span><span className="font-anton text-2xl text-[#00C853]">GANJI</span></a>
          <p className="text-[#4A5259] text-[10px] font-mono mt-1">{"// CLIPPER PORTAL"}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <a key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${'active' in item && item.active
                  ? 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20'
                  : 'text-[#4A5259] hover:text-white hover:bg-[#141414]'}`}>
              <item.icon size={16} />{item.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1E2428]">
          <div className="flex items-center gap-3 mb-3">
            {session?.user?.image && (
              <Image src={session.user.image} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full border border-[#1E2428]" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-[#4A5259] text-xs truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/clippers/login' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-[#4A5259] hover:text-red-400 hover:bg-red-500/5 rounded-lg text-xs transition-all">
            <LogOut size={13} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-60">
        <header className="sticky top-0 z-30 bg-[#060809]/90 backdrop-blur-md border-b border-[#1E2428] px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/clippers/dashboard" className="text-[#4A5259] hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </a>
            <div>
              <h1 className="font-anton text-xl text-white">MY SUBMISSIONS</h1>
              <p className="text-[#4A5259] text-xs">{submissions.length} total clips submitted</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Views', value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews, color: 'text-white' },
              { label: 'Total Earned', value: `KSh ${totalEarnings.toLocaleString()}`, color: 'text-[#00C853]' },
              { label: 'Pending Review', value: submissions.filter(s => s.status === 'pending').length, color: 'text-[#F5B800]' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#0E1214] border border-[#1E2428] rounded-xl p-4">
                <p className="text-[#4A5259] text-xs mb-1">{s.label}</p>
                <p className={`font-anton text-2xl ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'approved', 'pending', 'rejected'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase transition-all
                  ${filter === f
                    ? 'bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/40'
                    : 'text-[#4A5259] hover:text-white border border-transparent'}`}>
                {f}
              </button>
            ))}
          </div>

          {/* Submissions Table */}
          <div className="bg-[#0E1214] border border-[#1E2428] rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1E2428] text-[10px] font-mono uppercase text-[#4A5259]">
              <span className="col-span-3">Campaign</span>
              <span className="col-span-2">Platform</span>
              <span className="col-span-2 text-right">Views</span>
              <span className="col-span-2 text-right">Earned</span>
              <span className="col-span-2 text-right">Status</span>
              <span className="col-span-1 text-right">Link</span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[#4A5259] text-sm">
                {filter === 'all' ? 'No submissions yet. Join a campaign and submit your first clip!' : `No ${filter} submissions.`}
              </div>
            ) : (
              filtered.map((sub: Submission, i: number) => (
                <motion.div key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-[#1E2428] last:border-0 hover:bg-[#141414] transition-colors">
                  <div className="col-span-3">
                    <p className="text-white text-sm font-medium truncate">{sub.campaign?.brandPublic || 'Campaign'}</p>
                    <p className="text-[#4A5259] text-[10px]">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1E2428] text-[#8A949C]">{sub.platform}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-white text-sm font-mono">
                      {sub.views >= 1000 ? `${(sub.views / 1000).toFixed(1)}K` : (sub.views || '—')}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    {sub.earnings ? (
                      <span className="text-[#00C853] text-sm font-mono font-bold">KSh {sub.earnings.toLocaleString()}</span>
                    ) : (
                      <span className="text-[#4A5259] text-sm font-mono">—</span>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    {sub.postUrl && (
                      <a href={safeHref(sub.postUrl)} target="_blank" rel="noopener noreferrer"
                        className="text-[#4A5259] hover:text-[#00C853] transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0E1214] border-t border-[#1E2428] flex items-center justify-around px-2 py-3 z-50">
        {navItems.slice(0, 4).map(item => (
          <a key={item.label} href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors
              ${'active' in item && item.active ? 'text-[#00C853]' : 'text-[#4A5259] hover:text-white'}`}>
            <item.icon size={18} />
            <span className="text-[9px]">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
