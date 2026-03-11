"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { Button } from "@/app/components/ui/Button"
import Link from "next/link"
import { cn } from "@/app/lib/utils"

export default function ClipperRegister() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [payoutMethod, setPayoutMethod] = useState<'M-Pesa' | 'Bank Transfer'>('M-Pesa')
    const [contentTypes, setContentTypes] = useState<string[]>([])

    const toggleType = (type: string) => {
        setContentTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('submitting')

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        
        // Add array data manually since FormData handles multiple checkboxes strangely
        const payload = {
            ...data,
            contentTypes,
            payoutMethod
        }

        try {
            const res = await fetch('/api/clipper-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (res.ok && result.success) {
                setStatus('success')
            } else {
                throw new Error(result.error || 'Failed to submit application')
            }
        } catch (err) {
            console.error(err)
            setStatus('error')
            // Revert back so they can try again
            setTimeout(() => setStatus('idle'), 3000)
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
                        {status === 'success' ? (
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
                                <Button variant="outline-green" size="lg" asChild>
                                    <Link href="/clippers/campaigns">See Open Campaigns &rarr;</Link>
                                </Button>
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
                                        <input required name="fullName" type="text" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Phone Number*</label>
                                            <input required name="phone" type="tel" placeholder="07XX XXX XXX" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm text-gray-light mb-2">Email Address*</label>
                                            <input required name="email" type="email" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
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
                                        <label className="block font-sans text-sm text-gray-light mb-2">Describe your audience in one sentence*</label>
                                        <textarea required name="audienceDescription" maxLength={200} placeholder='e.g. "Young Nairobi men aged 18–30 who follow football and betting"' className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors resize-none h-24" />
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
                                            <button type="button" onClick={() => setPayoutMethod('M-Pesa')} className={cn("flex-1 py-3 border rounded-md font-sans text-sm transition-colors", payoutMethod === 'M-Pesa' ? "border-green bg-green/10 text-white" : "border-border bg-[#141414] text-gray-light hover:border-gray")}>M-Pesa</button>
                                            <button type="button" onClick={() => setPayoutMethod('Bank Transfer')} className={cn("flex-1 py-3 border rounded-md font-sans text-sm transition-colors", payoutMethod === 'Bank Transfer' ? "border-green bg-green/10 text-white" : "border-border bg-[#141414] text-gray-light hover:border-gray")}>Bank Transfer</button>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {payoutMethod === 'M-Pesa' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                <label className="block font-sans text-sm text-gray-light mb-2">M-Pesa Number</label>
                                                <input required name="mpesaNumber" type="tel" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                            </motion.div>
                                        )}
                                        {payoutMethod === 'Bank Transfer' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden flex flex-col gap-6">
                                                <div>
                                                    <label className="block font-sans text-sm text-gray-light mb-2">Bank Name</label>
                                                    <input required name="bankName" type="text" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-sm text-gray-light mb-2">Account Number</label>
                                                    <input required name="accountNumber" type="text" className="w-full bg-[#141414] border border-border focus:border-green text-white px-4 py-3 rounded-md outline-none transition-colors" />
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
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 font-sans text-sm p-4 rounded-md text-center">
                                        There was a problem submitting your application. Please try again.
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
