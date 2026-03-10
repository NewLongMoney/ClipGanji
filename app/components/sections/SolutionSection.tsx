"use client"

import { motion } from "framer-motion"
import { fadeUp } from "@/app/lib/utils"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { PhoneMockup } from "@/app/components/ui/PhoneMockup"

export function SolutionSection() {
    return (
        <section className="bg-black py-32 relative overflow-hidden" id="solution">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                    >
                        <SectionLabel text="THE CLIPGANJI DIFFERENCE" />

                        <h2 className="font-anton text-5xl md:text-6xl lg:text-[72px] leading-[1] text-white uppercase mb-8">
                            Your logo.<br />
                            Inside the video.<br />
                            <span className="text-gold">Impossible to skip.</span>
                        </h2>

                        <p className="font-sans text-lg md:text-xl text-gray-light max-w-2xl mx-auto leading-relaxed">
                            We don&apos;t run ads alongside content.<br className="hidden md:block" />
                            We embed your brand directly into the clip itself —<br className="hidden md:block" />
                            as a persistent logo bug in the corner of every frame.<br />
                            <span className="text-white font-medium mt-4 block">No ad server. No overlay. No skip button.</span>
                            The viewer cannot remove it.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <PhoneMockup />
                </motion.div>

            </div>
        </section>
    )
}
