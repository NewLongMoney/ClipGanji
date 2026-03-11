"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function ClipperHero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-black">
            {/* Background Glows */}
            <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,200,83,0.10) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div className="absolute top-[-50px] right-[-50px] w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.07) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* Scrolling Phone Strip Layer */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                <motion.div
                    className="flex gap-6 absolute top-10"
                    animate={{ x: ['0px', '-1200px'] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                    {Array(10).fill(null).map((_, i) => (
                        <div key={i} className="w-[160px] h-[320px] rounded-[24px] bg-[#141414] border border-[#1e2428] flex-shrink-0" />
                    ))}
                </motion.div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col items-center text-center">

                <motion.div
                    className="mb-8 font-mono text-sm md:text-base tracking-widest text-green uppercase"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <span className="bg-green/10 px-3 py-1 rounded-full border border-green/20">
                        {"// FOR CLIPPERS"}
                    </span>
                </motion.div>

                <motion.h1
                    className="font-anton text-5xl md:text-[96px] leading-[0.9] text-white uppercase tracking-tightest mb-8 max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={itemVariants}>Get paid to post.</motion.div>
                    <motion.div variants={itemVariants}><span className="text-gold">Every view earns.</span></motion.div>
                </motion.h1>

                <motion.p
                    className="font-sans text-lg md:text-xl text-gray-light max-w-2xl mb-12 leading-relaxed"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    Join Kenya&apos;s largest short-form video ad network.<br className="hidden md:block" />
                    Post clips. Embed brand logos. Get paid per view.<br className="hidden md:block" />
                    No minimum followers. Just good content.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <Button variant="filled-green" size="lg" className="w-full sm:w-auto" asChild>
                        <Link href="/clippers/register">Register as a Clipper</Link>
                    </Button>
                    <Button variant="outline-white" size="lg" className="w-full sm:w-auto" asChild>
                        <Link href="/clippers/campaigns">See Open Campaigns</Link>
                    </Button>
                </motion.div>

                <motion.div
                    className="mt-8 text-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <p className="text-gray-light text-sm mb-2">Already registered?</p>
                    <Link href="/clippers/login" className="font-mono text-green text-sm uppercase tracking-widest hover:text-white transition-colors border-b border-green/30 pb-1 hover:border-white">
                        LOG IN TO DASHBOARD
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="font-mono text-xs uppercase tracking-widest text-gray">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown size={16} />
                </motion.div>
            </motion.div>
        </section>
    )
}
