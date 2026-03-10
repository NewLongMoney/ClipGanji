"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/app/lib/utils"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { AdFormatCard } from "@/app/components/ui/AdFormatCard"

export function AdFormats() {
    return (
        <section className="bg-ink py-32 border-t border-border" id="formats">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="mb-20">
                    <SectionLabel text="AD FORMATS" />
                </div>

                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="h-full">
                        <AdFormatCard
                            title="LOGO BUG / BANNER"
                            body="Your brand logo sits in the corner of every clip for the full duration. Permanent. Persistent. Visible on every frame — whether the viewer watches for 3 seconds or 3 minutes."
                            price="From KSh 25,000 / 50,000 views"
                            tag="Best for: Brand awareness · Recognition · Recall"
                            accent="gold"
                            className="h-full"
                        />
                    </motion.div>

                    <motion.div variants={fadeUp} className="h-full">
                        <AdFormatCard
                            title="VIDEO AD PLACEMENT"
                            body="Your brand is woven organically into the clip itself — mentioned, shown, or featured by the creator as part of the content. Not an interruption. Part of the story."
                            price="From KSh 40,000 / 50,000 views"
                            tag="Best for: Product launches · App downloads · Direct response"
                            accent="gold"
                            className="h-full"
                        />
                    </motion.div>
                </motion.div>

                {/* Platform Logos Row */}
                <motion.div
                    className="flex flex-col items-center justify-center pt-16 border-t border-border"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="font-mono text-sm tracking-widest text-gray uppercase mb-8">Natively Distributed Across</span>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                        {/* SVG placehodlers - in real world would use actual logos */}
                        <div className="font-anton text-2xl md:text-3xl text-gray hover:text-white transition-colors cursor-default">TIKTOK</div>
                        <div className="font-anton text-2xl md:text-3xl text-gray hover:text-white transition-colors cursor-default">INSTAGRAM REELS</div>
                        <div className="font-anton text-2xl md:text-3xl text-gray hover:text-white transition-colors cursor-default">YOUTUBE SHORTS</div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
