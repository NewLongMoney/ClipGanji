"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/app/lib/utils"

export function StatBar() {
    const stats = [
        { number: "10+", label: "Kenyan\nClippers" },
        { number: "100K+", label: "Views\nper clip" },
        { number: "1M+", label: "Views per\ncampaign" },
        { number: "48H", label: "Campaign\nReport" },
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
                            <div className="font-anton text-5xl md:text-7xl mb-4 leading-none">{stat.number}</div>
                            <div className="font-sans text-sm md:text-base font-bold whitespace-pre-line leading-tight">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
