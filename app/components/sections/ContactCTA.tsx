"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { fadeUp } from "@/app/lib/utils"

export function ContactCTA() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus("submitting")

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                setStatus("success")
            } else {
                setStatus("error")
            }
        } catch {
            setStatus("error")
        }
    }

    return (
        <section className="bg-ink border-t border-border" id="contact">
            <div className="flex flex-col lg:flex-row min-h-[600px]">

                {/* Left Side (Dark) */}
                <div className="w-full lg:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-ink">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="max-w-xl mx-auto lg:mx-0"
                    >
                        <h2 className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase mb-6">
                            Ready to put your brand<br />
                            in front of<br />
                            <span className="text-gold">1 million Kenyans?</span>
                        </h2>

                        <p className="font-sans text-gray-light text-lg md:text-xl leading-relaxed">
                            Send us your brief. First campaign<br className="hidden md:block" />
                            live within 72 hours.<br className="hidden md:block" />
                            No retainer. No long-term contract.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side (Green) */}
                <div className="w-full lg:w-1/2 bg-green p-12 md:p-20 flex flex-col justify-center text-black">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="w-full max-w-md mx-auto lg:mx-0"
                    >
                        {status === "success" ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-black text-green rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-anton text-4xl uppercase mb-4">Brief Received</h3>
                                <p className="font-sans font-medium text-lg">We&apos;ll be in touch within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Company Name"
                                        required
                                        className="w-full min-h-[48px] bg-black/10 border-2 border-black/20 text-black placeholder:text-black/60 px-4 py-3.5 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        required
                                        className="w-full min-h-[48px] bg-black/10 border-2 border-black/20 text-black placeholder:text-black/60 px-4 py-3.5 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-colors"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full min-h-[48px] bg-black/10 border-2 border-black/20 text-black placeholder:text-black/60 px-4 py-3.5 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-colors"
                                    />
                                    <select
                                        name="budget"
                                        required
                                        className="w-full min-h-[48px] bg-black/10 border-2 border-black/20 text-black px-4 py-3.5 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-colors appearance-none"
                                    >
                                        <option value="" disabled selected>Budget Range</option>
                                        <option value="25K-80K">KSh 25K–80K</option>
                                        <option value="80K-175K">KSh 80K–175K</option>
                                        <option value="175K-500K">KSh 175K–500K</option>
                                        <option value="500K+">KSh 500K+</option>
                                    </select>
                                    <textarea
                                        name="message"
                                        placeholder="Message / Brief Description"
                                        required
                                        rows={4}
                                        className="w-full min-h-[120px] bg-black/10 border-2 border-black/20 text-black placeholder:text-black/60 px-4 py-3.5 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-colors resize-none"
                                    ></textarea>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            name="requestRateCard"
                                            id="requestRateCard"
                                            className="mt-1 w-5 h-5 rounded border-2 border-black/30 text-black focus:ring-2 focus:ring-black/30 bg-black/10 transition-colors cursor-pointer"
                                        />
                                        <label htmlFor="requestRateCard" className="text-black/80 text-sm leading-tight cursor-pointer select-none">
                                            Please send me the confidential ClipGanji Rate Card
                                        </label>
                                    </div>

                                    {status === "error" && (
                                        <div className="text-red-700 font-medium text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                                            There was an error sending your message. Please try again.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full min-h-[52px] bg-black text-green hover:bg-black/90 font-anton uppercase text-xl py-4 rounded-lg transition-all mt-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-green active:scale-[0.99]"
                                    >
                                        {status === "submitting" ? "SENDING..." : "START A CAMPAIGN"}
                                    </button>
                                </form>

                                <div className="mt-12 pt-8 border-t border-black/20 font-sans font-medium">
                                    <div className="text-black/60 mb-2">Or reach us directly on WhatsApp/Email:</div>
                                    <div className="text-xl flex flex-col gap-2">
                                        <a href="https://wa.me/254115336356?text=Hi%20ClipGanji!%20I'd%20like%20to%20start%20a%20campaign." target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                            +254 115 336 356
                                        </a>
                                        <a href="https://wa.me/254704096417?text=Hi%20ClipGanji!%20I'd%20like%20to%20start%20a%20campaign." target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                            +254 704 096 417
                                        </a>
                                    </div>
                                    <div className="text-xl mt-2">
                                        <a href="mailto:clipganji@gmail.com" className="hover:text-white transition-colors">
                                            clipganji@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
