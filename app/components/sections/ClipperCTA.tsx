"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/app/components/ui/Button"

export function ClipperCTA() {
    return (
        <section className="bg-black py-24 border-t border-border">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden border border-border shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Left Side (Dark) */}
                    <div className="bg-card p-12 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden">
                        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-green/10 rounded-full blur-[80px] pointer-events-none" />
                        
                        <h2 className="font-anton text-4xl md:text-5xl leading-[1.1] text-white uppercase mb-6 relative z-10">
                            Ready to start<br />
                            <span className="text-green">earning?</span>
                        </h2>
                        <p className="font-sans text-lg text-gray-light leading-relaxed max-w-sm relative z-10">
                            Registration takes 5 minutes. First campaigns are assigned within 48 hours of approval.
                        </p>
                    </div>

                    {/* Right Side (Green) */}
                    <div className="bg-green p-12 md:p-16 flex flex-col justify-center items-center text-center">
                        <h3 className="font-anton text-3xl md:text-4xl text-black uppercase mb-8">
                            Join the Network
                        </h3>

                        <Button variant="outline-green" size="lg" className="w-full max-w-xs mb-6 border-black text-black hover:bg-black hover:text-white" asChild>
                            <Link href="/clippers/register">Register as a Clipper &rarr;</Link>
                        </Button>

                        <div className="flex flex-col items-center gap-2">
                            <span className="font-sans text-sm text-black/80 font-medium">
                                Already registered?
                            </span>
                            <Link href="/clippers/dashboard" className="font-mono text-xs text-black uppercase tracking-widest border-b border-black/30 hover:border-black transition-colors pb-0.5">
                                Log in to dashboard
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
