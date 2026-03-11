"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
            {/* Background Glows */}
            <div className="hero-glow-green" />
            <div className="hero-glow-gold" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col items-center text-center">

                <motion.div
                    className="mb-8 font-anton text-4xl md:text-5xl tracking-widest"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <span className="text-white">CLIP</span>
                    <span className="text-green">GANJI</span>
                </motion.div>

                <motion.h1
                    className="font-anton text-6xl md:text-[100px] lg:text-[120px] leading-[0.9] text-white uppercase tracking-tightest mb-8 max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={itemVariants}>Your brand inside</motion.div>
                    <motion.div variants={itemVariants}><span className="text-gray/50">every</span> clip.</motion.div>
                    <motion.div variants={itemVariants}>Every view <span className="text-green">verified.</span></motion.div>
                </motion.h1>

                <motion.p
                    className="font-sans text-lg md:text-xl text-gray-light max-w-2xl mb-12 leading-relaxed"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    Kenya&apos;s first short-form video advertising network.<br className="hidden md:block" />
                    10+ creators. TikTok, Reels, and Shorts.<br className="hidden md:block" />
                    Campaigns live in 72 hours.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                        <Link href="/rates">See Rates</Link>
                    </Button>
                    <Button variant="outline-white" size="lg" className="w-full sm:w-auto" asChild>
                        <Link href="/contact">Book a Call</Link>
                    </Button>
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
