'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, Share2, 
  CreditCard, Save, AlertCircle, CheckCircle2
} from 'lucide-react'
import { DashboardLayout } from '@/app/components/layout/DashboardLayout'
import { Button } from '@/app/components/ui/Button'
import { cn } from '@/app/lib/utils'

interface ProfileData {
    fullName?: string
    phone?: string
    tiktokHandle?: string
    instagramHandle?: string
    youtubeChannel?: string
    payoutMethod?: 'mpesa' | 'bank'
    mpesaNumber?: string
    bankName?: string
    bankAccount?: string
}

export default function SettingsPage() {
    const { status: authStatus } = useSession()
    const router = useRouter()
    
    const [profile, setProfile] = useState<ProfileData>({
        fullName: '',
        phone: '',
        tiktokHandle: '',
        instagramHandle: '',
        youtubeChannel: '',
        payoutMethod: 'mpesa',
        mpesaNumber: '',
        bankName: '',
        bankAccount: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (authStatus === 'unauthenticated') router.push('/clippers/login')
    }, [authStatus, router])

    useEffect(() => {
        if (authStatus === 'authenticated') {
            fetch('/api/clipper/profile')
                .then(r => r.json())
                .then(data => {
                    setProfile(data)
                    setLoading(false)
                })
        }
    }, [authStatus])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setStatus('idle')

        try {
            const res = await fetch('/api/clipper/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            })

            if (res.ok) {
                setStatus('success')
                setMessage('Profile updated successfully!')
            } else {
                setStatus('error')
                setMessage('Failed to update profile.')
            }
        } catch {
            setStatus('error')
            setMessage('Something went wrong.')
        } finally {
            setSaving(false)
        }
    }

    if (loading || authStatus === 'loading') {
        return (
            <div className="min-h-screen bg-[#060809] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <DashboardLayout title="SETTINGS" subtitle="Manage your profile & payment info">
            <div className="max-w-4xl space-y-8 pb-12">
                
                <form onSubmit={handleSave} className="space-y-8">
                    
                    {/* ── PERSONAL INFO ──────────────────────────────────── */}
                    <section className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1E2428] flex items-center gap-2">
                            <User size={16} className="text-[#00C853]" />
                            <h2 className="font-anton text-lg text-white uppercase tracking-wider">Personal Information</h2>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-gray text-[10px] uppercase font-mono tracking-widest block">Full Name</label>
                                <input 
                                    id="fullName"
                                    type="text" 
                                    value={profile.fullName || ''} 
                                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                                    className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-gray text-[10px] uppercase font-mono tracking-widest block">Phone Number</label>
                                <input 
                                    id="phone"
                                    type="tel" 
                                    value={profile.phone || ''} 
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                    className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── SOCIAL HANDLES ──────────────────────────────────── */}
                    <section className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1E2428] flex items-center gap-2">
                            <Share2 size={16} className="text-[#00C853]" />
                            <h2 className="font-anton text-lg text-white uppercase tracking-wider">Social Media</h2>
                        </div>
                        <div className="p-6 grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="tiktokHandle" className="text-gray text-[10px] uppercase font-mono tracking-widest block">TikTok Handle</label>
                                <input 
                                    id="tiktokHandle"
                                    type="text" 
                                    placeholder="@username"
                                    value={profile.tiktokHandle || ''} 
                                    onChange={(e) => setProfile({...profile, tiktokHandle: e.target.value})}
                                    className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="instagramHandle" className="text-gray text-[10px] uppercase font-mono tracking-widest block">Instagram Handle</label>
                                <input 
                                    id="instagramHandle"
                                    type="text" 
                                    placeholder="@username"
                                    value={profile.instagramHandle || ''} 
                                    onChange={(e) => setProfile({...profile, instagramHandle: e.target.value})}
                                    className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="youtubeChannel" className="text-gray text-[10px] uppercase font-mono tracking-widest block">YouTube Channel</label>
                                <input 
                                    id="youtubeChannel"
                                    type="text" 
                                    placeholder="Channel Name"
                                    value={profile.youtubeChannel || ''} 
                                    onChange={(e) => setProfile({...profile, youtubeChannel: e.target.value})}
                                    className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── PAYOUT SETTINGS ──────────────────────────────────── */}
                    <section className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1E2428] flex items-center gap-2">
                            <CreditCard size={16} className="text-[#00C853]" />
                            <h2 className="font-anton text-lg text-white uppercase tracking-wider">Payout Details</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex gap-4">
                                {(['mpesa', 'bank'] as const).map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setProfile({...profile, payoutMethod: method})}
                                        className={cn(
                                            "flex-1 py-3 border rounded-xl font-mono text-xs uppercase tracking-widest transition-all",
                                            profile.payoutMethod === method 
                                                ? "bg-[#00C853]/10 border-[#00C853] text-[#00C853]" 
                                                : "bg-black/50 border-[#1E2428] text-gray hover:border-gray/30"
                                        )}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>

                            {profile.payoutMethod === 'mpesa' ? (
                                <div className="space-y-2">
                                    <label htmlFor="mpesaNumber" className="text-gray text-[10px] uppercase font-mono tracking-widest block">M-Pesa Number</label>
                                    <input 
                                        id="mpesaNumber"
                                        type="tel" 
                                        placeholder="07XX XXX XXX"
                                        value={profile.mpesaNumber || ''} 
                                        onChange={(e) => setProfile({...profile, mpesaNumber: e.target.value})}
                                        className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                    />
                                    <p className="text-[10px] text-gray italic">Payments are sent to this number every Friday.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="bankName" className="text-gray text-[10px] uppercase font-mono tracking-widest block">Bank Name</label>
                                        <input 
                                            id="bankName"
                                            type="text" 
                                            value={profile.bankName || ''} 
                                            onChange={(e) => setProfile({...profile, bankName: e.target.value})}
                                            className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="bankAccount" className="text-gray text-[10px] uppercase font-mono tracking-widest block">Account Number</label>
                                        <input 
                                            id="bankAccount"
                                            type="text" 
                                            value={profile.bankAccount || ''} 
                                            onChange={(e) => setProfile({...profile, bankAccount: e.target.value})}
                                            className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-3 px-4 text-white focus:border-[#00C853] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            {status === 'success' && (
                                <motion.p 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="text-[#00C853] text-sm flex items-center gap-2"
                                >
                                    <CheckCircle2 size={16} /> {message}
                                </motion.p>
                            )}
                            {status === 'error' && (
                                <motion.p 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="text-red-400 text-sm flex items-center gap-2"
                                >
                                    <AlertCircle size={16} /> {message}
                                </motion.p>
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            variant="filled-green" 
                            disabled={saving}
                            className="h-12 px-8 font-anton tracking-wider uppercase"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Save Changes <Save size={16} className="ml-2" /></>
                            )}
                        </Button>
                    </div>

                </form>

            </div>
        </DashboardLayout>
    )
}
