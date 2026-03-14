"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12
            }
        }
    }

    const itemVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-16 overflow-hidden">
            {/* Background Glows - stronger for depth */}
            <div className="absolute bottom-[-120px] left-[-80px] w-[700px] h-[700px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,200,83,0.12) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div className="absolute top-[-80px] right-[-80px] w-[550px] h-[550px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.08) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* Scrolling Phone Strip Layer */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.07] pointer-events-none">
                <motion.div
                    className="flex gap-6 absolute top-10"
                    animate={{ x: ['0px', '-1200px'] }}
                    transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                >
                    {Array(10).fill(null).map((_, i) => (
                        <div key={i} className="w-[160px] h-[320px] rounded-[24px] bg-[#141414] border border-[#1e2428] flex-shrink-0" />
                    ))}
                </motion.div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 flex flex-col items-center text-center">

                {/* Prominent logo - hero brand mark */}
                <motion.div
                    className="mb-8 sm:mb-10"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <Image
                        src="/images/LogoNoBackground.png"
                        alt="ClipGanji"
                        width={420}
                        height={160}
                        className="h-24 sm:h-32 md:h-40 lg:h-44 w-auto object-contain drop-shadow-[0_0_40px_rgba(0,200,83,0.15)]"
                        priority
                    />
                </motion.div>

                <motion.h1
                    className="font-anton text-5xl sm:text-6xl md:text-[90px] lg:text-[110px] xl:text-[120px] leading-[0.92] text-white uppercase tracking-tightest mb-6 sm:mb-8 max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={itemVariants} className="block">Your brand inside</motion.div>
                    <motion.div variants={itemVariants}><span className="text-white/60">every</span> clip.</motion.div>
                    <motion.div variants={itemVariants}>Every view <span className="text-green">verified.</span></motion.div>
                </motion.h1>

                <motion.p
                    className="font-sans text-base sm:text-lg md:text-xl text-gray-light max-w-2xl mb-10 sm:mb-12 leading-relaxed px-2"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    Kenya&apos;s first short-form video advertising network.<br className="hidden md:block" />
                    10+ creators. TikTok, Reels, and Shorts.<br className="hidden md:block" />
                    Campaigns live in 72 hours.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-sm sm:max-w-none"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <Button variant="filled-green" size="lg" className="w-full sm:w-auto min-h-[52px] text-lg px-10 rounded-lg shadow-[0_0_30px_rgba(0,200,83,0.25)] hover:shadow-[0_0_40px_rgba(0,200,83,0.35)] transition-shadow" asChild>
                        <Link href="/contact">Book a Call</Link>
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-light"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
            >
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown size={18} className="text-green/70" />
                </motion.div>
            </motion.div>
        </section>
    )
}
