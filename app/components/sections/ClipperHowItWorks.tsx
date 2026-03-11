"use client"

import { motion } from "framer-motion"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { cn } from "@/app/lib/utils"

export function ClipperHowItWorks() {
    const steps = [
        {
            numeral: "01",
            accent: "green" as const,
            title: "Apply Once",
            body: "Fill out your profile. Tell us your platforms, follower counts, and content niche. Approval takes 24–48 hours."
        },
        {
            numeral: "02",
            accent: "gold" as const,
            title: "Browse Campaigns",
            body: "See open brand campaigns. Each one shows the brand, the brief, the deadline, and the pay rate per 1,000 views."
        },
        {
            numeral: "03",
            accent: "green" as const,
            title: "Post the Clips",
            body: "Download the brief, add the logo bug, post on your platforms. Submit your post link through your dashboard."
        },
        {
            numeral: "04",
            accent: "gold" as const,
            title: "Get Paid",
            body: "Views are tracked via UTM. Earnings are calculated weekly and paid out every Friday via M-Pesa or bank transfer."
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const slideInVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, x: -30 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    return (
        <section className="bg-ink py-32 border-t border-border" id="how-it-works">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="mb-20">
                    <SectionLabel text="HOW TO EARN" />
                    <h2 className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase max-w-2xl">
                        FOUR SIMPLE STEPS<br />
                        TO CONSISTENT <span className="text-gray">INCOME.</span>
                    </h2>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={slideInVariants}
                            className="bg-card p-8 border border-border/50 relative overflow-hidden group hover:border-border transition-colors duration-300 flex flex-col min-h-[300px]"
                        >
                            {/* Top Accent Bar */}
                            <div className={cn(
                                "absolute top-0 left-0 right-0 h-1",
                                step.accent === 'green' ? "bg-green" : "bg-gold"
                            )} />

                            <div className={cn(
                                "font-mono text-xl md:text-2xl mb-8",
                                step.accent === 'green' ? "text-green" : "text-gold"
                            )}>
                                {step.numeral} —
                            </div>

                            <h3 className="font-anton text-2xl md:text-3xl text-white uppercase mb-4 leading-[1.1]">
                                {step.title}
                            </h3>

                            <p className="font-sans text-gray-light leading-relaxed mt-auto">
                                {step.body}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}
