'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Megaphone, Upload, Wallet,
  Settings, LogOut, TrendingUp, Eye, CheckCircle,
  Clock, AlertCircle, ChevronRight, Bell
} from 'lucide-react'

// ── MOCK DATA ──────────────────────────────────────────────────────────
const mockStats = {
  totalEarnings: 14750,
  weeklyViews: 48200,
  activeSubmissions: 3,
  pendingApproval: 1,
  weeklyEarningsChange: +12,
}

const mockActiveCampaigns = [
  {
    id: '001',
    brand: 'Brand Partner A',
    category: 'Betting',
    accentColor: '#00C853',
    status: 'active',
    deadline: 'Mar 30, 2026',
    payPer1k: 300,
    myViews: 22400,
    myEarnings: 6720,
    clipsSubmitted: 8,
    clipsApproved: 6,
  },
  {
    id: '002',
    brand: 'Brand Partner B',
    category: 'Fintech',
    accentColor: '#F5B800',
    status: 'active',
    deadline: 'Apr 1, 2026',
    payPer1k: 500,
    myViews: 16100,
    myEarnings: 8050,
    clipsSubmitted: 4,
    clipsApproved: 4,
  },
]

const mockRecentSubmissions = [
  { id: 's1', campaign: 'Brand Partner A', platform: 'TikTok', views: 8400, status: 'approved', earnings: 2520, submittedAt: '2h ago' },
  { id: 's2', campaign: 'Brand Partner B', platform: 'Instagram Reels', views: 5100, status: 'approved', earnings: 2550, submittedAt: '5h ago' },
  { id: 's3', campaign: 'Brand Partner A', platform: 'TikTok', views: 3200, status: 'pending', earnings: null, submittedAt: '1d ago' },
  { id: 's4', campaign: 'Brand Partner A', platform: 'YouTube Shorts', views: 2800, status: 'approved', earnings: 840, submittedAt: '1d ago' },
  { id: 's5', campaign: 'Brand Partner B', platform: 'TikTok', views: 11000, status: 'approved', earnings: 5500, submittedAt: '2d ago' },
]

// ── SIDEBAR NAV ITEMS ──────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/clippers/dashboard', active: true },
  { label: 'Campaigns', icon: Megaphone, href: '/clippers/campaigns' },
  { label: 'My Submissions', icon: Upload, href: '/clippers/submissions' },
  { label: 'Earnings', icon: Wallet, href: '/clippers/earnings' },
  { label: 'Settings', icon: Settings, href: '/clippers/settings' },
]

// ── STATUS BADGE ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: 'bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30',
    pending:  'bg-[#F5B800]/15 text-[#F5B800] border border-[#F5B800]/30',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  }
  const icons = {
    approved: <CheckCircle size={11} />,
    pending:  <Clock size={11} />,
    rejected: <AlertCircle size={11} />,
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${styles[status as keyof typeof styles]}`}>
      {icons[status as keyof typeof icons]}
      {status}
    </span>
  )
}

// ── PLATFORM BADGE ─────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1E2428] text-[#8A949C]">
      {platform}
    </span>
  )
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────
export default function ClipperDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/clippers/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#060809] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060809] flex">

      {/* ── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0E1214] border-r border-[#1E2428] fixed top-0 left-0 h-full z-40">
        
        {/* Logo */}
        <div className="p-6 border-b border-[#1E2428]">
          <a href="/">
            <span className="font-anton text-2xl text-white">CLIP</span>
            <span className="font-anton text-2xl text-[#00C853]">GANJI</span>
          </a>
          <p className="text-[#4A5259] text-[10px] font-mono mt-1">{"// CLIPPER PORTAL"}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${item.active
                  ? 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20'
                  : 'text-[#4A5259] hover:text-white hover:bg-[#141414]'}`}>
              <item.icon size={16} />
              {item.label}
            </a>
          ))}
        </nav>

        {/* User profile bottom */}
        <div className="p-4 border-t border-[#1E2428]">
          <div className="flex items-center gap-3 mb-3">
            {session?.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-[#1E2428]" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-[#4A5259] text-xs truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/clippers/login' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-[#4A5259] hover:text-red-400
                       hover:bg-red-500/5 rounded-lg text-xs transition-all"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-60">
        
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-[#060809]/90 backdrop-blur-md border-b border-[#1E2428] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-anton text-xl text-white">DASHBOARD</h1>
              <p className="text-[#4A5259] text-xs">
                Week of March 11–17, 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative p-2 text-[#4A5259] hover:text-white transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00C853] rounded-full" />
              </button>
              {/* Avatar */}
              {session?.user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-[#1E2428] lg:hidden" />
              )}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">

          {/* ── EARNINGS BANNER ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-[#00C853]/10 to-[#F5B800]/5 border border-[#00C853]/20 
                       rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="text-[#8A949C] text-xs font-mono mb-1">{"// TOTAL EARNINGS THIS WEEK"}</p>
              <p className="font-anton text-4xl text-white">
                KSh {mockStats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-[#00C853] text-sm mt-1 flex items-center gap-1">
                <TrendingUp size={13} />
                +{mockStats.weeklyEarningsChange}% from last week
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/clippers/earnings"
                className="bg-[#00C853] text-black font-bold text-sm px-5 py-2.5 rounded-xl
                           hover:bg-[#00A844] transition-colors font-sans">
                Withdraw →
              </a>
              <a href="/clippers/campaigns"
                className="bg-[#141414] border border-[#1E2428] text-white text-sm px-5 py-2.5 rounded-xl
                           hover:border-[#00C853]/50 transition-colors font-sans">
                Find Campaigns
              </a>
            </div>
          </motion.div>

          {/* ── STATS GRID ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Weekly Views', value: mockStats.weeklyViews.toLocaleString(), icon: Eye, color: '#00C853' },
              { label: 'Active Campaigns', value: mockActiveCampaigns.length, icon: Megaphone, color: '#F5B800' },
              { label: 'Clips Submitted', value: mockRecentSubmissions.length, icon: Upload, color: '#00C853' },
              { label: 'Pending Review', value: mockStats.pendingApproval, icon: Clock, color: '#F5B800' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#0E1214] border border-[#1E2428] rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#4A5259] text-xs">{stat.label}</p>
                  <stat.icon size={14} color={stat.color} />
                </div>
                <p className="font-anton text-2xl text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* ── ACTIVE CAMPAIGNS ──────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-anton text-lg text-white">MY CAMPAIGNS</h2>
              <a href="/clippers/campaigns" className="text-[#00C853] text-xs hover:underline flex items-center gap-1">
                Browse all <ChevronRight size={12} />
              </a>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mockActiveCampaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-[#0E1214] border border-[#1E2428] rounded-xl overflow-hidden
                             hover:border-[#00C853]/30 transition-all group"
                >
                  {/* Accent bar */}
                  <div className="h-1" style={{ background: campaign.accentColor }} />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-[#4A5259] uppercase">{campaign.category}</span>
                        <h3 className="font-anton text-white text-xl mt-0.5">{campaign.brand}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-[#4A5259]">Ends {campaign.deadline}</span>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#141414] rounded-lg p-2.5 text-center">
                        <p className="font-anton text-lg text-white">{(campaign.myViews / 1000).toFixed(1)}K</p>
                        <p className="text-[#4A5259] text-[10px]">My Views</p>
                      </div>
                      <div className="bg-[#141414] rounded-lg p-2.5 text-center">
                        <p className="font-anton text-lg" style={{ color: campaign.accentColor }}>
                          {campaign.clipsApproved}/{campaign.clipsSubmitted}
                        </p>
                        <p className="text-[#4A5259] text-[10px]">Clips OK</p>
                      </div>
                      <div className="bg-[#141414] rounded-lg p-2.5 text-center">
                        <p className="font-anton text-lg text-[#00C853]">
                          {campaign.payPer1k * campaign.myViews / 1000 >= 1000
                            ? `${(campaign.payPer1k * campaign.myViews / 1000000).toFixed(1)}K`
                            : campaign.payPer1k * campaign.myViews / 1000}
                        </p>
                        <p className="text-[#4A5259] text-[10px]">Earned KSh</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] text-[#4A5259] mb-1.5">
                        <span>{campaign.myViews.toLocaleString()} views</span>
                        <span>KSh {campaign.payPer1k}/1K views</span>
                      </div>
                      <div className="h-1.5 bg-[#141414] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: campaign.accentColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((campaign.myViews / 50000) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>

                    <a href={`/clippers/campaigns/${campaign.id}/submit`}
                      className="w-full flex items-center justify-center gap-2 bg-[#141414] 
                                 border border-[#1E2428] text-white text-sm py-2.5 rounded-lg
                                 hover:border-[#00C853]/50 hover:text-[#00C853] transition-all font-medium">
                      <Upload size={14} />
                      Submit New Clip
                    </a>
                  </div>
                </motion.div>
              ))}

              {/* Add more campaigns CTA */}
              <motion.a
                href="/clippers/campaigns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-[#0E1214] border border-dashed border-[#1E2428] rounded-xl p-5
                           flex flex-col items-center justify-center gap-3 text-center
                           hover:border-[#00C853]/40 hover:bg-[#00C853]/5 transition-all group min-h-[200px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center
                                group-hover:bg-[#00C853]/10 transition-colors">
                  <Megaphone size={18} className="text-[#4A5259] group-hover:text-[#00C853] transition-colors" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Join a Campaign</p>
                  <p className="text-[#4A5259] text-xs mt-1">Browse open briefs and start earning</p>
                </div>
                <span className="text-[#00C853] text-xs flex items-center gap-1">
                  View campaigns <ChevronRight size={11} />
                </span>
              </motion.a>
            </div>
          </div>

          {/* ── RECENT SUBMISSIONS TABLE ───────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-anton text-lg text-white">RECENT SUBMISSIONS</h2>
              <a href="/clippers/submissions" className="text-[#00C853] text-xs hover:underline flex items-center gap-1">
                View all <ChevronRight size={12} />
              </a>
            </div>

            <div className="bg-[#0E1214] border border-[#1E2428] rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-[#1E2428]
                              text-[10px] font-mono uppercase text-[#4A5259]">
                <span className="col-span-2">Campaign / Platform</span>
                <span className="text-right">Views</span>
                <span className="text-right">Earned</span>
                <span className="text-right">Status</span>
              </div>

              {/* Rows */}
              {mockRecentSubmissions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-5 gap-4 px-5 py-3.5 border-b border-[#1E2428] last:border-0
                             hover:bg-[#141414] transition-colors"
                >
                  <div className="col-span-2">
                    <p className="text-white text-sm font-medium">{sub.campaign}</p>
                    <div className="mt-1">
                      <PlatformBadge platform={sub.platform} />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-white text-sm font-mono">
                      {sub.views >= 1000 ? `${(sub.views / 1000).toFixed(1)}K` : sub.views}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    {sub.earnings ? (
                      <span className="text-[#00C853] text-sm font-mono font-bold">
                        KSh {sub.earnings.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[#4A5259] text-sm font-mono">—</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end">
                    <StatusBadge status={sub.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── EARNINGS BREAKDOWN ────────────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-4">
            
            {/* This week */}
            <div className="bg-[#0E1214] border border-[#1E2428] rounded-xl p-5">
              <p className="text-[#4A5259] text-[10px] font-mono mb-1">THIS WEEK</p>
              <p className="font-anton text-3xl text-white">KSh {mockStats.totalEarnings.toLocaleString()}</p>
              <p className="text-[#00C853] text-xs mt-1 flex items-center gap-1">
                <TrendingUp size={11} />
                +{mockStats.weeklyEarningsChange}% vs last week
              </p>
              <div className="mt-4 h-1 bg-[#141414] rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-[#00C853] rounded-full" />
              </div>
              <p className="text-[#4A5259] text-[10px] mt-1.5">60% of monthly average</p>
            </div>

            {/* Payout info */}
            <div className="bg-[#0E1214] border border-[#1E2428] rounded-xl p-5">
              <p className="text-[#4A5259] text-[10px] font-mono mb-1">NEXT PAYOUT</p>
              <p className="font-anton text-3xl text-[#F5B800]">Friday</p>
              <p className="text-[#8A949C] text-xs mt-1">March 14, 2026</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#4A5259]">
                <CheckCircle size={12} className="text-[#00C853]" />
                M-Pesa · 0702 005 560
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4A5259] mt-1.5">
                <Clock size={12} />
                Processes automatically
              </div>
            </div>

            {/* All time */}
            <div className="bg-[#0E1214] border border-[#1E2428] rounded-xl p-5">
              <p className="text-[#4A5259] text-[10px] font-mono mb-1">ALL TIME EARNED</p>
              <p className="font-anton text-3xl text-white">KSh 67,300</p>
              <p className="text-[#4A5259] text-xs mt-1">Since Jan 2026</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-[#4A5259]">Total views</span>
                <span className="text-white font-mono">224,000</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-[#4A5259]">Avg CPM earned</span>
                <span className="text-[#00C853] font-mono">KSh 300</span>
              </div>
            </div>
          </div>

        </div>{/* end p-6 */}
      </main>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0E1214] border-t border-[#1E2428] 
                      flex items-center justify-around px-2 py-3 z-50">
        {navItems.slice(0, 4).map((item) => (
          <a key={item.label} href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors
              ${item.active ? 'text-[#00C853]' : 'text-[#4A5259] hover:text-white'}`}>
            <item.icon size={18} />
            <span className="text-[9px]">{item.label}</span>
          </a>
        ))}
      </nav>

    </div>
  )
}
