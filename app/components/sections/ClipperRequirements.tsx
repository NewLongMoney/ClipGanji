"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/app/lib/utils"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { Check } from "lucide-react"

export function ClipperRequirements() {
    const rules = [
        {
            title: "Based in Kenya",
            body: "You must be posting primarily to a Kenyan audience. We verify this via UTM geo data."
        },
        {
            title: "Active on TikTok/Reels",
            body: "At least one platform. Minimum 500 followers and 3+ posts per week."
        },
        {
            title: "Willing to follow the brief",
            body: "Brand guidelines must be followed. Logo must be placed correctly. Content must meet quality standards."
        }
    ]

    return (
        <section className="bg-ink py-32 border-t border-border" id="requirements">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-20">
                    <SectionLabel text="WHO CAN APPLY" />
                    <h2 className="font-anton text-4xl md:text-5xl lg:text-[52px] leading-[1.1] text-white uppercase max-w-3xl mb-6">
                        YOU DON&apos;T NEED<br />
                        A MILLION <span className="text-gray">FOLLOWERS.</span>
                    </h2>
                    <p className="font-sans text-gray-light text-lg max-w-xl leading-relaxed">
                        We care about engagement, consistency, and content quality — not follower count.
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                >
                    {rules.map((rule, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            className="bg-card p-8 border border-border flex flex-col gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center mb-4">
                                <Check className="w-5 h-5 text-green" />
                            </div>
                            <h3 className="font-anton text-2xl text-white uppercase leading-[1.1]">
                                {rule.title}
                            </h3>
                            <p className="font-sans text-gray-light leading-relaxed">
                                {rule.body}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
