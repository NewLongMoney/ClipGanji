"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/app/lib/utils"
import { StatCard } from "@/app/components/ui/StatCard"

export function ProblemSection() {
    const stats = [
        { stat: "90%+", label: "of mobile users skip or block ads" },
        { stat: "0", label: "verified proof from a billboard" },
        { stat: "2–5%", label: "actual reach from an influencer post" },
        { stat: "KSh 80K+", label: "cost of one 30-second TV spot" },
    ]

    return (
        <section className="bg-ink py-24 md:py-32 border-t border-border" id="problem">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Column */}
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={stagger}
                        className="max-w-xl"
                    >
                        <motion.h2
                            variants={fadeUp}
                            className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase mb-8"
                        >
                            Every other format<br />
                            has a <span className="text-gray">problem.</span>
                        </motion.h2>

                        <motion.div variants={fadeUp} className="flex flex-col gap-4 font-sans text-lg text-gray-light leading-relaxed">
                            <p>TV can't prove who watched.</p>
                            <p>Influencer deals are legally complicated.</p>
                            <p>Paid social gets blocked or scrolled past.</p>
                            <p>Billboards have no ROI data.</p>
                        </motion.div>
                    </motion.div>

                    {/* Right Column (Grid) */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={stagger}
                    >
                        {stats.map((item, index) => (
                            <motion.div key={index} variants={fadeUp}>
                                <StatCard stat={item.stat} label={item.label} className="h-full" />
                            </motion.div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
