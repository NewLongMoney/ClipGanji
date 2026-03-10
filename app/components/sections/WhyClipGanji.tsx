"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/app/lib/utils"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { PillarCard } from "@/app/components/ui/PillarCard"

export function WhyClipGanji() {
    const pillars = [
        {
            numeral: "I",
            accent: "green" as const,
            title: "Cannot Be Blocked, Skipped, or Ignored",
            body: "Your logo is embedded inside the video file — not an ad server overlay. No blocker removes it. No skip button bypasses it."
        },
        {
            numeral: "II",
            accent: "gold" as const,
            title: "Every View Is Verified",
            body: "UTM-tracked. Geo-filtered to Kenya. Tied to app downloads. You get proof, not estimates."
        },
        {
            numeral: "III",
            accent: "green" as const,
            title: "Earned Attention — Not Forced Exposure",
            body: "People chose to watch this clip. Your brand is part of content they wanted. Recall is 4–7x higher than forced-view formats."
        }
    ]

    return (
        <section className="bg-ink py-32 border-t border-border" id="why-it-works">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="mb-20">
                    <SectionLabel text="WHY IT WORKS" />
                    <h2 className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase max-w-3xl">
                        THREE THINGS NO OTHER <span className="text-gray">FORMAT OFFERS</span>
                    </h2>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-20"
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                >
                    {pillars.map((pillar, index) => (
                        <motion.div key={index} variants={fadeUp}>
                            <PillarCard
                                numeral={pillar.numeral}
                                title={pillar.title}
                                body={pillar.body}
                                accent={pillar.accent}
                            />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}
