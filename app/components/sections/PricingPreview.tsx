"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { fadeUp } from "@/app/lib/utils"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { PricingTable } from "@/app/components/ui/PricingTable"
import { Button } from "@/app/components/ui/Button"

export function PricingPreview() {
    const rateRows = [
        { views: "50,000", logoBug: "KSh 25,000", videoAd: "KSh 40,000" },
        { views: "100,000", logoBug: "KSh 50,000", videoAd: "KSh 80,000" },
        { views: "250,000", logoBug: "KSh 112,500", videoAd: "KSh 180,000" },
        { views: "500,000", logoBug: "KSh 225,000", videoAd: "KSh 350,000" },
        { views: "750,000", logoBug: "KSh 300,000", videoAd: "KSh 480,000" },
        { views: "1,000,000", logoBug: "KSh 400,000", videoAd: "KSh 600,000", highlight: true },
    ]

    return (
        <section className="bg-black py-32 border-t border-border" id="rates">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="max-w-xl"
                    >
                        <SectionLabel text="PRICING" />
                        <h2 className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase mb-6">
                            WHAT YOUR <span className="text-gold">BUDGET BUYS</span>
                        </h2>
                        <p className="font-sans text-gray-light text-lg leading-relaxed">
                            All views UTM-tracked. Geo-filtered to Kenya.<br className="hidden md:block" />
                            Reported in 48 hours.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="bg-card rounded-md border border-border p-8 mb-12 shadow-2xl"
                >
                    <PricingTable rows={rateRows} />
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-6 items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Button variant="outline-green" size="lg" className="w-full sm:w-auto" asChild>
                        <Link href="/rates">See Full Rate Card &rarr;</Link>
                    </Button>
                    <Button variant="outline-gold" size="lg" className="w-full sm:w-auto" asChild>
                        <Link href="/weekly">See Weekly Campaigns &rarr;</Link>
                    </Button>
                </motion.div>

            </div>
        </section>
    )
}
