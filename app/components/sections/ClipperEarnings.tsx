"use client"

import { motion } from "framer-motion"
import { fadeUp } from "@/app/lib/utils"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { cn } from "@/app/lib/utils"

export function ClipperEarnings() {
    const rateRows = [
        { views: "1,000", earnings: "KSh 300", bonus: "—" },
        { views: "5,000", earnings: "KSh 1,500", bonus: "—" },
        { views: "10,000", earnings: "KSh 3,000", bonus: "—" },
        { views: "25,000", earnings: "KSh 6,500", bonus: "+KSh 500 bonus", highlight: true },
        { views: "50,000", earnings: "KSh 12,000", bonus: "+KSh 1,500 bonus" },
        { views: "100,000", earnings: "KSh 22,000", bonus: "+KSh 3,000 bonus" },
    ]

    return (
        <section className="bg-black py-32 border-t border-border" id="earnings">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="max-w-xl"
                    >
                        <SectionLabel text="WHAT YOU EARN" />
                        <h2 className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase mb-6">
                            EARN UP TO<br />
                            <span className="text-green">KSh 8,000</span><br />
                            PER CAMPAIGN.
                        </h2>
                        <p className="font-sans text-gray-light text-lg leading-relaxed">
                            Pay is based on verified views delivered.<br className="hidden md:block" />
                            The more you post, the more you earn.<br className="hidden md:block" />
                            Top clippers run 3–5 campaigns per month.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="bg-card rounded-md border border-border overflow-hidden mb-8"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border bg-ink">
                                    <th className="font-sans font-medium text-gray-light text-sm p-6 w-1/3">Views Delivered</th>
                                    <th className="font-sans font-medium text-gray-light text-sm p-6 w-1/3">Your Earnings</th>
                                    <th className="font-sans font-medium text-gray-light text-sm p-6 w-1/3 border-l border-border/50">Bonus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rateRows.map((row, index) => (
                                    <tr 
                                        key={index} 
                                        className={cn(
                                            "border-b border-border transition-colors hover:bg-white/5",
                                            row.highlight && "bg-gradient-to-r from-gold/5 via-transparent to-transparent border-t border-t-gold/20"
                                        )}
                                    >
                                        <td className="p-6 font-mono font-medium text-white">{row.views}</td>
                                        <td className={cn(
                                            "p-6 font-anton text-xl",
                                            row.highlight ? "text-gold tracking-wide" : "text-white"
                                        )}>
                                            {row.earnings}
                                        </td>
                                        <td className="p-6 font-sans text-sm text-gray-light border-l border-border/50">
                                            {row.bonus}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.p 
                    className="font-mono text-xs text-gray-light text-center max-w-xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Rates shown are base rates and may vary per campaign. Earnings calculated on verified views only — UTM-tracked, Kenya geo-filtered. Payouts every Friday via M-Pesa.
                </motion.p>
            </div>
        </section>
    )
}
