'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, CheckCircle2, AlertCircle, 
  Instagram, Music, Youtube, Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/Button'
import { PageWrapper } from '@/app/components/layout/PageWrapper'
import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { campaigns } from '@/app/../data/campaigns'
import { cn } from '@/app/lib/utils'

export default function CampaignSubmit() {
    const { status: authStatus } = useSession()
    const router = useRouter()
    const params = useParams()
    const campaignId = params.id as string
    const campaign = campaigns.find(c => c.id === campaignId)

    const [platform, setPlatform] = useState<string>('')
    const [postUrl, setPostUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (authStatus === 'unauthenticated') router.push('/clippers/login')
    }, [authStatus, router])

    if (!campaign) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!platform || !postUrl) return

        setIsSubmitting(true)
        setStatus('idle')

        try {
            const res = await fetch('/api/clipper/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId,
                    platform,
                    postUrl
                })
            })

            const result = await res.json()

            if (res.ok) {
                setStatus('success')
                setPostUrl('')
                setPlatform('')
            } else {
                setStatus('error')
                setErrorMessage(result.error || 'Failed to submit clip')
            }
        } catch {
            setStatus('error')
            setErrorMessage('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageWrapper>
            <Navbar />
            <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative">
                <div 
                    className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20" 
                    style={{ backgroundColor: campaign.logoColor || '#00C853' }}
                />

                <div className="container mx-auto max-w-2xl relative z-10">
                    <Link href={`/clippers/campaigns/${campaignId}`} className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-gray-light hover:text-white uppercase mb-12 transition-colors">
                        <ArrowLeft size={14} /> Back to Brief
                    </Link>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#0E1214] border border-[#00C853]/30 p-12 rounded-2xl text-center shadow-[0_0_50px_rgba(0,200,83,0.1)]"
                            >
                                <div className="w-20 h-20 bg-[#00C853]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-[#00C853]" />
                                </div>
                                <h2 className="font-anton text-4xl text-white uppercase mb-4">CLIP SUBMITTED</h2>
                                <p className="font-sans text-gray-light text-lg mb-8 leading-relaxed">
                                    Our team will verify your views and quality within 24 hours. <br/>
                                    Earnings will reflect in your dashboard once approved.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button variant="filled-green" size="lg" asChild>
                                        <Link href="/clippers/dashboard">Back to Dashboard</Link>
                                    </Button>
                                    <Button variant="outline-white" size="lg" onClick={() => setStatus('idle')}>
                                        Submit Another
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0E1214] border border-[#1E2428] rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden relative"
                            >
                                {/* Top Accent */}
                                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: campaign.logoColor || '#00C853' }} />

                                <div className="mb-10">
                                    <h1 className="font-anton text-4xl text-white uppercase mb-2">SUBMIT YOUR CLIP</h1>
                                    <p className="font-sans text-gray-light">
                                        Campaign: <span className="text-white font-semibold">{campaign.brand}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Platform Selection */}
                                    <div>
                                        <label className="font-mono text-[10px] text-gray uppercase tracking-widest block mb-4">
                                            {"// SELECT PLATFORM"}
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'tiktok', icon: Music, label: 'TikTok' },
                                                { id: 'instagram', icon: Instagram, label: 'Reels' },
                                                { id: 'youtube', icon: Youtube, label: 'Shorts' }
                                            ].map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setPlatform(p.id)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                                        platform === p.id 
                                                            ? "bg-[#00C853]/10 border-[#00C853] text-[#00C853]" 
                                                            : "bg-black/50 border-[#1E2428] text-gray-light hover:border-[#333]"
                                                    )}
                                                >
                                                    <p.icon size={20} />
                                                    <span className="text-[10px] font-mono tracking-wider uppercase">{p.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* URL Input */}
                                    <div>
                                        <label className="font-mono text-[10px] text-gray uppercase tracking-widest block mb-4">
                                            {"// CLIP / POST LINK"}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-[#00C853] transition-colors">
                                                <LinkIcon size={18} />
                                            </div>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://www.tiktok.com/@user/video/..."
                                                value={postUrl}
                                                onChange={(e) => setPostUrl(e.target.value)}
                                                className="w-full bg-black/50 border border-[#1E2428] rounded-xl py-4 pl-12 pr-4 text-white font-sans 
                                                         outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/20 transition-all"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-light mt-2 font-sans italic">
                                            Make sure your profile is public so we can verify the views.
                                        </p>
                                    </div>

                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3 text-red-400 text-sm"
                                        >
                                            <AlertCircle size={18} className="shrink-0" />
                                            <p>{errorMessage}</p>
                                        </motion.div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        variant="filled-green" 
                                        className="w-full justify-center h-14 font-anton text-xl tracking-wider uppercase"
                                        disabled={isSubmitting || !platform || !postUrl}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>Submit Clip <ChevronRight className="ml-2" size={18} /></>
                                        )}
                                    </Button>

                                    <p className="text-[10px] text-[#4A5259] text-center uppercase tracking-widest font-mono">
                                        {"// Verification takes ~24 hours"}
                                    </p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </PageWrapper>
    )
}

function ChevronRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}
