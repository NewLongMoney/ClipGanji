"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/app/lib/utils"

import { StatCounter } from "@/app/components/ui/StatCounter"

export function StatBar() {
    const stats = [
        { value: 10, suffix: "+", label: "Kenyan\nClippers" },
        { value: 100, suffix: "K+", label: "Views\nper clip" },
        { value: 1, suffix: "M+", label: "Views per\ncampaign" },
        { value: 48, suffix: "H", label: "Campaign\nReport" },
    ]

    return (
        <section className="bg-green py-20 w-full">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-black"
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                >
                    {stats.map((stat, index) => (
                        <motion.div key={index} variants={fadeUp} className="flex flex-col items-center">
                            <div className="font-anton text-5xl md:text-7xl mb-4 leading-none">
                                <StatCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="font-sans text-sm md:text-base font-bold whitespace-pre-line leading-tight">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
