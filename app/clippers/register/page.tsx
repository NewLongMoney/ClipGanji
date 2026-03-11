'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { Button } from "@/app/components/ui/Button"
import Link from "next/link"
import { cn } from "@/app/lib/utils"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ClipperRegister() {
    const { data: session, status: authStatus } = useSession()
    const router = useRouter()
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [payoutMethod, setPayoutMethod] = useState<'mpesa' | 'bank'>('mpesa')
    const [contentTypes, setContentTypes] = useState<string[]>([])

    // We no longer auto-redirect unauthenticated users here, 
    // instead we show a login CTA in the render block below.

    const toggleType = (type: string) => {
        setContentTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!session?.user?.id) {
            router.push('/clippers/login')
            return
        }

        setStatus('submitting')
        setErrorMessage('')

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        const payload = {
            ...data,
            contentTypes,
            payoutMethod,
            // Map form names to prisma names if they differ
            postFrequency: data.postingFrequency,
            bankAccount: data.bankAccount || data.accountNumber,
        }

        try {
            const res = await fetch('/api/clipper/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (res.ok && result.success) {
                setStatus('success')
                // Redirect removed to allow user to see success state and click buttons
            } else {
                throw new Error(result.details || result.error || 'Failed to submit application')
            }
        } catch (err) {
            console.error(err)
            setStatus('error')
            setErrorMessage(err instanceof Error ? err.message : 'There was a problem submitting your application. Please try again.')
            // Revert back so they can try again after a delay
            setTimeout(() => setStatus('idle'), 5000)
        }
    }

    return (
        <PageWrapper>
            <Navbar />
            <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative flex flex-col items-center">
                {/* Background glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-[680px] relative z-10">
                    <div className="text-center mb-16">
                        <span className="font-mono text-sm tracking-widest text-green uppercase">{"// CLIPPER REGISTRATION"}</span>
                        <h1 className="font-anton text-5xl md:text-6xl text-white uppercase mt-4 mb-6">
                            JOIN THE NETWORK
                        </h1>
                        <p className="font-sans text-gray-light text-lg">
                            Tell us about yourself. We&apos;ll review your application and get back to you within 48 hours.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {authStatus === 'unauthenticated' ? (
                            <motion.div
                                key="login-cta"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-border p-12 rounded-2xl text-center shadow-2xl"
                            >
                                <h2 className="font-anton text-3xl text-white uppercase mb-4">SIGN IN TO APPLY</h2>
                                <p className="font-sans text-gray-light text-lg mb-8 leading-relaxed">
                                    You need to be signed in to join the ClipGanji network. <br/>
                                    Sync your profile in seconds.
                                </p>
                                <Button 
                                    variant="filled-green" 
                                    size="lg" 
                                    className="w-full font-anton text-2xl uppercase tracking-wider py-6"
                                    onClick={() => signIn('google', { callbackUrl: '/clippers/register' })}
                                >
                                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continue with Google
                                </Button>
                            </motion.div>
                        ) : status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-card border border-green/30 p-12 rounded-2xl text-center shadow-[0_0_50px_rgba(0,200,83,0.1)]"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-green" />
                                </motion.div>
                                <h2 className="font-anton text-4xl text-white uppercase mb-4">APPLICATION RECEIVED</h2>
                                <p className="font-sans text-gray-light text-lg mb-8 leading-relaxed">
                                    We&apos;ll review your profile and get back to you within 48 hours.<br className="hidden md:block"/>
                                    Check your email and WhatsApp for updates.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button variant="filled-green" size="lg" asChild>
                                        <Link href="/clippers/campaigns">See Open Campaigns &rarr;</Link>
                                    </Button>
                                    <Button variant="outline-white" size="lg" asChild>
                                        <Link href="/clippers/dashboard">Go to Dashboard</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-card border border-border p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col gap-12"
                            >
                                {/* SECTION 1 */}
                                <section className="flex flex-col gap-6">
                                    <h3 className="font-mono text-xs text-green tracking-widest uppercase pb-2 border-b border-border">
                                        {"// PERSONAL INFO"}
                                    </h3>
                                    
                                    <div>
                                        <label className="block font-sans text-sm text-gray-light mb-2">Full Name*</label>
                                        <input required name="fullName" type="text" defaultValue={session?.user?.name || ''} className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Phone Number*</label>
                                            <input required name="phone" type="tel" placeholder="07XX XXX XXX" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Email Address*</label>
                                            <input required name="email" type="email" defaultValue={session?.user?.email || ''} className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-sans text-sm text-gray-light mb-2">County / City*</label>
                                        <select required name="county" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors appearance-none pr-10">
                                            <option value="" disabled selected>Select location...</option>
                                            <option value="Nairobi">Nairobi</option>
                                            <option value="Mombasa">Mombasa</option>
                                            <option value="Kisumu">Kisumu</option>
                                            <option value="Nakuru">Nakuru</option>
                                            <option value="Eldoret">Eldoret</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </section>

                                {/* SECTION 2 */}
                                <section className="flex flex-col gap-6">
                                    <h3 className="font-mono text-xs text-green tracking-widest uppercase pb-2 border-b border-border">
                                        {"// YOUR PLATFORMS"}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block font-sans text-sm text-gray-light mb-2">TikTok Handle</label>
                                            <input name="tiktokHandle" type="text" placeholder="@yourhandle" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Followers</label>
                                            <input name="tiktokFollowers" type="number" placeholder="0" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block font-sans text-sm text-gray-light mb-2">Instagram Handle</label>
                                            <input name="instagramHandle" type="text" placeholder="@yourhandle" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Followers</label>
                                            <input name="instagramFollowers" type="number" placeholder="0" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block font-sans text-sm text-gray-light mb-2">YouTube Channel</label>
                                            <input name="youtubeChannel" type="text" placeholder="Channel Name" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Subscribers</label>
                                            <input name="youtubeSubscribers" type="number" placeholder="0" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <label className="block font-sans text-sm text-gray-light mb-2">How often do you post?</label>
                                        <select required name="postingFrequency" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors appearance-none">
                                            <option value="" disabled selected>Select frequency...</option>
                                            <option value="Daily">Daily</option>
                                            <option value="3-5x per week">3–5x per week</option>
                                            <option value="1-2x per week">1–2x per week</option>
                                            <option value="Less">Less</option>
                                        </select>
                                    </div>
                                </section>

                                {/* SECTION 3 */}
                                <section className="flex flex-col gap-6">
                                    <h3 className="font-mono text-xs text-green tracking-widest uppercase pb-2 border-b border-border">
                                        {"// CONTENT"}
                                    </h3>
                                    
                                    <div>
                                        <label className="block font-sans text-sm text-gray-light mb-4">What type of content do you post?</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {['Sports / Betting', 'Music / Ent', 'Comedy / Skits', 'Lifestyle', 'News', 'Gaming', 'Finance', 'Other'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => toggleType(type)}
                                                    className={cn(
                                                        "px-3 py-2 border rounded-md font-sans text-sm transition-colors text-left",
                                                        contentTypes.includes(type) 
                                                          ? "border-green bg-green/10 text-white" 
                                                          : "border-border bg-[#141414] text-gray-light hover:border-gray"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-4 h-4 rounded-sm border flex items-center justify-center", contentTypes.includes(type) ? "border-green bg-green text-black" : "border-gray-light")}>
                                                            {contentTypes.includes(type) && <CheckCircle2 className="w-3 h-3" />}
                                                        </div>
                                                        {type}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-sans text-sm text-gray-light mb-2">Screenshot of Analytics Page (Stats & Demographics)*</label>
                                        <input required name="audienceScreenshot" type="file" accept="image/*" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block font-sans text-sm text-gray-light mb-2">Link to your best performing recent clip*</label>
                                        <input required name="bestClipUrl" type="url" placeholder="https://tiktok.com/@you/video/..." className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                    </div>
                                </section>

                                {/* SECTION 4 */}
                                <section className="flex flex-col gap-6">
                                    <h3 className="font-mono text-xs text-green tracking-widest uppercase pb-2 border-b border-border">
                                        {"// PAYMENT"}
                                    </h3>
                                    
                                    <div>
                                        <label className="block font-sans text-sm text-gray-light mb-2">Preferred Payout Method*</label>
                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setPayoutMethod('mpesa')} className={cn("flex-1 py-3 border rounded-md font-sans text-sm transition-colors", payoutMethod === 'mpesa' ? "border-green bg-green/10 text-white" : "border-border bg-[#141414] text-gray-light hover:border-gray")}>M-Pesa</button>
                                            <button type="button" onClick={() => setPayoutMethod('bank')} className={cn("flex-1 py-3 border rounded-md font-sans text-sm transition-colors", payoutMethod === 'bank' ? "border-green bg-green/10 text-white" : "border-border bg-[#141414] text-gray-light hover:border-gray")}>Bank Transfer</button>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {payoutMethod === 'mpesa' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                <label className="block font-sans text-sm text-gray-light mb-2">M-Pesa Number</label>
                                                <input required name="mpesaNumber" type="tel" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                            </motion.div>
                                        )}
                                        {payoutMethod === 'bank' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden flex flex-col gap-6">
                                                <div>
                                                    <label className="block font-sans text-sm text-gray-light mb-2">Bank Name</label>
                                                    <input required name="bankName" type="text" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-sm text-gray-light mb-2">Account Number</label>
                                                    <input required name="bankAccount" type="text" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>

                                {/* SECTION 5 */}
                                <section className="flex flex-col gap-4">
                                    <h3 className="font-mono text-xs text-green tracking-widest uppercase pb-2 border-b border-border mb-2">
                                        {"// AGREEMENT"}
                                    </h3>
                                    
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="mt-1 flex-shrink-0">
                                            <input required type="checkbox" className="w-4 h-4 accent-green bg-[#141414] border-border" />
                                        </div>
                                        <span className="font-sans text-sm text-gray-light group-hover:text-white transition-colors">
                                            I confirm that I am based in Kenya and primarily post to a Kenyan audience.*
                                        </span>
                                    </label>
                                    
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="mt-1 flex-shrink-0">
                                            <input required type="checkbox" className="w-4 h-4 accent-green bg-[#141414] border-border" />
                                        </div>
                                        <span className="font-sans text-sm text-gray-light group-hover:text-white transition-colors">
                                            I agree to follow brand briefs accurately and place logos as instructed.*
                                        </span>
                                    </label>
                                    
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="mt-1 flex-shrink-0">
                                            <input required type="checkbox" className="w-4 h-4 accent-green bg-[#141414] border-border" />
                                        </div>
                                        <span className="font-sans text-sm text-gray-light group-hover:text-white transition-colors">
                                            I understand that payouts are based on verified views only and are issued weekly.*
                                        </span>
                                    </label>
                                </section>

                                {status === 'error' && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 font-sans text-sm p-4 rounded-md text-center flex items-center justify-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errorMessage}
                                    </div>
                                )}

                                <Button 
                                    variant="filled-green" 
                                    size="lg" 
                                    className="w-full font-anton text-2xl uppercase tracking-wider py-6"
                                    type="submit"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Submitting...' : 'SUBMIT APPLICATION'}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </PageWrapper>
    )
}
