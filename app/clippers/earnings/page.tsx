'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Wallet, TrendingUp, History,
  AlertCircle
} from 'lucide-react'
import { DashboardLayout } from '@/app/components/layout/DashboardLayout'
import { cn } from '@/app/lib/utils'

interface Payout {
  id: string
  amount: number
  status: 'pending' | 'sent' | 'failed'
  date: string
  reference: string | null
  method: string
}

interface RecentEarned {
  campaign: string
  earnings: number
  views: number
  date: string
}

interface EarningsData {
  stats: {
    totalEarnings: number
    totalViews: number
    pendingReview: number
    payoutMethod: string
    payoutAccount: string
  }
  payouts: Payout[]
  recentApproved: RecentEarned[]
}

export default function EarningsPage() {
    const { status: authStatus } = useSession()
    const router = useRouter()
    const [data, setData] = useState<EarningsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authStatus === 'unauthenticated') router.push('/clippers/login')
    }, [authStatus, router])

    useEffect(() => {
        if (authStatus === 'authenticated') {
            fetch('/api/clipper/earnings')
                .then(r => r.json())
                .then(setData)
                .finally(() => setLoading(false))
        }
    }, [authStatus])

    if (loading || authStatus === 'loading') {
        return (
            <div className="min-h-screen bg-[#060809] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const { stats, payouts, recentApproved } = data || { 
        stats: { totalEarnings: 0, totalViews: 0, pendingReview: 0, payoutMethod: 'mpesa', payoutAccount: '' }, 
        payouts: [], 
        recentApproved: [] 
    }

    return (
        <DashboardLayout title="EARNINGS" subtitle="Track your performance & payouts">
            <div className="space-y-6 pb-12">
                
                {/* ── SUMMARY GRID ───────────────────────────────────── */}
                <div className="grid md:grid-cols-3 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0E1214] border border-[#1E2428] rounded-2xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wallet size={80} className="text-[#00C853]" />
                        </div>
                        <p className="text-gray text-[10px] font-mono uppercase tracking-widest mb-1">{"// TOTAL EARNINGS"}</p>
                        <h3 className="font-anton text-4xl text-white">KSh {stats.totalEarnings.toLocaleString()}</h3>
                        <p className="text-[#00C853] text-[10px] mt-2 font-sans">Lifetime accumulated reward</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0E1214] border border-[#1E2428] rounded-2xl p-6"
                    >
                        <p className="text-gray text-[10px] font-mono uppercase tracking-widest mb-1">{"// PENDING REVIEW"}</p>
                        <h3 className="font-anton text-4xl text-[#F5B800]">{stats.pendingReview}</h3>
                        <p className="text-gray-light text-[10px] mt-2 font-sans italic">Clips waiting for verification</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0E1214] border border-[#1E2428] rounded-2xl p-6"
                    >
                        <p className="text-gray text-[10px] font-mono uppercase tracking-widest mb-1">{"// NEXT PAYOUT"}</p>
                        <h3 className="font-anton text-4xl text-white">FRIDAY</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20 uppercase">
                               {stats.payoutMethod}
                           </span>
                           <span className="text-[10px] text-gray transition-colors font-mono">
                               {stats.payoutAccount}
                           </span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    
                    {/* ── RECENT EARNED ──────────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                             <TrendingUp size={16} className="text-[#00C853]" />
                             <h2 className="font-anton text-lg text-white uppercase tracking-wider">Recent Earnings</h2>
                        </div>
                        <div className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-black/50 border-b border-[#1E2428]">
                                    <tr className="text-[10px] font-mono text-gray uppercase tracking-widest">
                                        <th className="px-6 py-4">Campaign</th>
                                        <th className="px-6 py-4 text-right">Views</th>
                                        <th className="px-6 py-4 text-right">Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E2428]/50">
                                    {recentApproved.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray text-xs">
                                                No earnings records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentApproved.map((item, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-white text-sm font-medium">{item.campaign}</p>
                                                    <p className="text-gray text-[10px] mt-1">{new Date(item.date).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-xs text-white">
                                                    {item.views.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-sm text-[#00C853] font-bold">
                                                    +KSh {item.earnings.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── PAYOUT HISTORY ─────────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                             <History size={16} className="text-[#F5B800]" />
                             <h2 className="font-anton text-lg text-white uppercase tracking-wider">Payout History</h2>
                        </div>
                        <div className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-black/50 border-b border-[#1E2428]">
                                    <tr className="text-[10px] font-mono text-gray uppercase tracking-widest">
                                        <th className="px-6 py-4">Date / Ref</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E2428]/50">
                                    {payouts.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray text-xs">
                                                No payouts yet. Automatic transfers start this Friday.
                                            </td>
                                        </tr>
                                    ) : (
                                        payouts.map((item, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-white text-sm font-medium">{new Date(item.date).toLocaleDateString()}</p>
                                                    <p className="text-gray text-[10px] mt-1 font-mono uppercase truncate max-w-[120px]">
                                                        {item.reference || '// PENDING'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={cn(
                                                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                                                        item.status === 'sent' ? "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/30" :
                                                        item.status === 'pending' ? "bg-[#F5B800]/10 text-[#F5B800] border-[#F5B800]/30" :
                                                        "bg-red-500/10 text-red-500 border-red-500/30"
                                                    )}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-sm text-white font-bold">
                                                    KSh {item.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* ── INFO BANNER ────────────────────────────────────── */}
                <div className="bg-[#1E2428]/30 border border-[#1E2428] rounded-2xl p-6 border-dashed">
                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center text-[#F5B800]">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-semibold mb-1 uppercase tracking-tight">Payout Schedule</h4>
                            <p className="text-gray text-xs leading-relaxed max-w-2xl">
                                Withdrawals are processed automatically every Friday by 5:00 PM EAT for all balances above KSh 100. 
                                Ensure your M-Pesa number is correct in your <a href="/clippers/settings" className="text-[#00C853] hover:underline">settings</a>.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
