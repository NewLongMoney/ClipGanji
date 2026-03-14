'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from "@/app/lib/utils"
import {
  TrendingUp, Eye, Megaphone, Upload, 
  Clock, ChevronRight
} from 'lucide-react'
import { DashboardData, ActiveCampaign, RecentSubmission } from '@/app/types/dashboard'
import { DashboardLayout } from '@/app/components/layout/DashboardLayout'
import Link from 'next/link'

// ── STATUS BADGE ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: 'bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30',
    pending:  'bg-[#F5B800]/15 text-[#F5B800] border border-[#F5B800]/30',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  }
  const icons = {
    approved: <CheckCircleIcon />,
    pending:  <ClockIcon />,
    rejected: <AlertIcon />,
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full", styles[status as keyof typeof styles] || styles.pending)}>
      {icons[status as keyof typeof icons] || icons.pending}
      {status}
    </span>
  )
}

function CheckCircleIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
function ClockIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function AlertIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }

// ── PLATFORM BADGE ─────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2428] text-[#8A949C] uppercase tracking-wider">
      {platform}
    </span>
  )
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────
export default function ClipperDashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter()
  const [dashData, setDashData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authStatus === 'unauthenticated') router.push('/clippers/login')
  }, [authStatus, router])

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetch('/api/clipper/dashboard')
        .then(r => {
          if (r.status === 404) {
            router.push('/clippers/register')
            return null
          }
          return r.json()
        })
        .then(data => {
          if (data) setDashData(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [authStatus, router])

  if (loading || authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#060809] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = dashData?.stats
  const activeCampaigns = dashData?.activeCampaigns || []
  const recentSubmissions = dashData?.recentSubmissions || []
  const profileStatus = dashData?.profile?.status || 'pending'
  const clipperName = dashData?.profile?.fullName || session?.user?.name || 'Clipper'

  return (
    <DashboardLayout 
      title="DASHBOARD" 
      subtitle={`WELCOME BACK, ${clipperName.toUpperCase()}`}
    >
      <div className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* ── STATUS BANNER ──────────────────────────────────────── */}
        {profileStatus === 'pending' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F5B800]/10 border border-[#F5B800]/20 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-[#F5B800]/20 flex items-center justify-center text-[#F5B800]">
                <Clock size={20} />
            </div>
            <div>
                <h4 className="text-white text-sm font-bold uppercase tracking-tight">Application Under Review</h4>
                <p className="text-[#8A949C] text-xs font-sans">Our admins are currently reviewing your profile. You can still browse campaigns but won't be able to submit until approved.</p>
            </div>
          </motion.div>
        )}

        {/* ── EARNINGS BANNER ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#00C853]/15 via-[#00C853]/5 to-transparent border border-[#00C853]/20 
                     rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#00C85311_0%,transparent_50%)]" />
          
          <div className="relative z-10">
            <p className="text-[#8A949C] text-[10px] font-mono tracking-widest mb-3 uppercase">{"// TOTAL EARNED THIS WEEK"}</p>
            <h2 className="font-anton text-6xl text-white tracking-tight mb-2">
              KSh {stats?.weeklyEarnings?.toLocaleString() || 0}
            </h2>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
              (stats?.earningsChange ?? 0) >= 0 ? "bg-[#00C853]/10 text-[#00C853]" : "bg-red-500/10 text-red-400"
            )}>
              <TrendingUp size={14} className={(stats?.earningsChange ?? 0) < 0 ? "rotate-180" : ""} />
              {(stats?.earningsChange ?? 0) >= 0 ? '+' : ''}{stats?.earningsChange || 0}% vs last week
            </div>
          </div>

          <div className="flex flex-wrap gap-4 relative z-10">
            <Link href="/clippers/earnings"
              className="bg-[#00C853] text-black font-anton tracking-widest uppercase text-sm px-8 h-14 rounded-2xl
                         flex items-center justify-center hover:bg-[#00A844] hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(0,200,83,0.3)]">
              Withdraw Funds →
            </Link>
            <Link href="/clippers/campaigns"
              className="bg-white/5 border border-white/10 text-white font-anton tracking-widest uppercase text-sm px-8 h-14 rounded-2xl
                         flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md">
              Browse Campaigns
            </Link>
          </div>
        </motion.div>

        {/* ── QUICK STATS GRID ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Weekly Views', value: stats?.weeklyViews?.toLocaleString() || 0, icon: Eye, color: '#00C853' },
            { label: 'Live Campaigns', value: activeCampaigns.length, icon: Megaphone, color: '#F5B800' },
            { label: 'Clips Uploaded', value: stats?.totalSubmissions || 0, icon: Upload, color: '#00C853' },
            { label: 'Under Review', value: stats?.pendingCount || 0, icon: Clock, color: '#F5B800' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0E1214] border border-[#1E2428] rounded-2xl p-5 md:p-6 group hover:border-[#00C853]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#8A949C] text-[10px] font-mono tracking-widest uppercase">{stat.label}</p>
                <div className="p-2 rounded-lg bg-black/40 group-hover:scale-110 transition-transform">
                  <stat.icon size={16} color={stat.color} />
                </div>
              </div>
              <p className="font-anton text-3xl text-white tracking-wider">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ── MY ACTIVE CAMPAIGNS ────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-anton text-2xl text-white tracking-wider uppercase">Active Campaigns</h2>
              <Link href="/clippers/campaigns" className="text-[#00C853] text-[10px] font-mono uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all">
                BROWSE ALL <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {activeCampaigns.length === 0 ? (
                <div className="col-span-2 bg-[#0E1214] border border-dashed border-[#1E2428] rounded-3xl p-12 text-center">
                    <Megaphone className="w-12 h-12 text-[#4A5259] mx-auto mb-4" />
                    <h3 className="text-white font-anton text-xl uppercase mb-2">No Active Campaigns</h3>
                    <p className="text-[#8A949C] text-sm mb-8 max-w-xs mx-auto">Join a campaign to start earning from your short-form content.</p>
                    <Link href="/clippers/campaigns" className="inline-block bg-[#00C853] text-black font-anton px-8 py-3 rounded-xl uppercase tracking-widest">Join Now</Link>
                </div>
              ) : (
                activeCampaigns.map((campaign: ActiveCampaign, i: number) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden hover:border-[#00C853]/30 transition-all group"
                  >
                    <div className="h-1.5 w-full bg-[#1E2428]">
                        <div className="h-full bg-[#00C853]" style={{ width: `${Math.min((campaign.myViews / 10000) * 100, 100)}%`, backgroundColor: campaign.accentColor || '#00C853' }} />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-[#8A949C] text-[10px] font-mono uppercase tracking-widest mb-1">{campaign.category}</p>
                          <h3 className="font-anton text-2xl text-white uppercase">{campaign.brand}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#F5B800] bg-[#F5B800]/10 px-2 py-1 rounded">LIVE</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                          <p className="font-anton text-lg text-white">{(campaign.myViews / 1000).toFixed(1)}K</p>
                          <p className="text-[#4A5259] text-[9px] uppercase font-mono mt-1">Views</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                          <p className="font-anton text-lg text-[#00C853]">{campaign.clipsApproved}</p>
                          <p className="text-[#4A5259] text-[9px] uppercase font-mono mt-1">Clips</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                          <p className="font-anton text-lg" style={{ color: campaign.accentColor || '#00C853' }}>KSh {campaign.myEarnings.toLocaleString()}</p>
                          <p className="text-[#4A5259] text-[9px] uppercase font-mono mt-1">Earned</p>
                        </div>
                      </div>

                      <Link href={`/clippers/campaigns/${campaign.id}/submit`}
                        className="w-full flex items-center justify-center gap-2 bg-[#141414] border border-[#1E2428] 
                                   text-white font-anton tracking-widest uppercase text-[11px] py-4 rounded-xl
                                   hover:border-[#00C853]/50 hover:text-[#00C853] transition-all">
                        <Upload size={14} /> Submit New Clip
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ── RECENT SUBMISSIONS ────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-anton text-2xl text-white tracking-wider uppercase">Recent Activity</h2>
              <Link href="/clippers/submissions" className="text-gray text-[10px] font-mono uppercase tracking-widest hover:text-white transition-all">
                VIEW ALL
              </Link>
            </div>

            <div className="bg-[#0E1214] border border-[#1E2428] rounded-3xl overflow-hidden divide-y divide-[#1E2428]/50">
              {recentSubmissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray text-xs font-mono">No submissions yet — join a campaign to get started</p>
                  </div>
              ) : (
                recentSubmissions.map((sub: RecentSubmission, i: number) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-white text-sm font-bold truncate uppercase tracking-tight">{sub.campaign}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <PlatformBadge platform={sub.platform} />
                          <span className="text-[10px] text-[#4A5259] font-mono">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <p className="text-[10px] text-[#4A5259] font-mono uppercase tracking-widest">EARNED</p>
                      <p className={cn("font-anton text-lg tracking-wider", sub.earnings ? "text-[#00C853]" : "text-[#4A5259]")}>
                        {sub.earnings ? `KSh ${sub.earnings.toLocaleString()}` : "PENDING"}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Support Widget */}
            <div className="bg-[#00C853]/5 border border-[#00C853]/20 rounded-3xl p-6">
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Need Support?</h4>
                <p className="text-[#8A949C] text-[10px] leading-relaxed mb-4 font-sans">Our admins are online to help you verify views or troubleshoot links.</p>
                <div className="flex flex-col gap-2">
                   <a href="https://wa.me/254702005560" target="_blank" rel="noreferrer" 
                      className="text-[#00C853] text-[10px] font-anton uppercase tracking-widest flex items-center gap-2">
                      Contact Admin 1 →
                   </a>
                   <a href="https://wa.me/254704096417" target="_blank" rel="noreferrer" 
                      className="text-[#00C853] text-[10px] font-anton uppercase tracking-widest flex items-center gap-2">
                      Contact Admin 2 →
                   </a>
                </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}
