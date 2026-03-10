"use client"

import { motion } from "framer-motion"
import { Download, FileText, Presentation } from "lucide-react"
import { fadeUp, stagger } from "@/app/lib/utils"

export function DownloadsSection() {
    const assets = [
        {
            title: "Pitch Deck",
            description: "Full overview of our network and capabilities.",
            file: "Clip Ganji PitchDeck for Betting Companies (2).pdf",
            icon: Presentation
        },
        {
            title: "Standard Rate Card",
            description: "Detailed pricing for standard campaigns.",
            file: "ClipGanji_Rate_Card (1).docx",
            icon: FileText
        },
        {
            title: "Weekly Rate Card",
            description: "Tiered pricing for weekly high-frequency campaigns.",
            file: "ClipGanji_Weekly_Rate_Card.docx",
            icon: FileText
        }
    ]

    return (
        <section className="bg-black py-24 border-t border-border">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    className="text-center mb-16"
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="font-anton text-4xl md:text-5xl text-white uppercase mb-4">Resources</h2>
                    <p className="font-sans text-gray-light max-w-2xl mx-auto">
                        Download our official documents to learn more about our advertising solutions and rates.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    variants={stagger}
                >
                    {assets.map((asset, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            className="bg-ink p-8 border border-border rounded-sm hover:border-gold transition-colors group"
                        >
                            <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center mb-6 rounded-sm">
                                <asset.icon size={24} />
                            </div>
                            <h3 className="font-anton text-2xl text-white uppercase mb-2">{asset.title}</h3>
                            <p className="font-sans text-gray-light text-sm mb-8 leading-relaxed">
                                {asset.description}
                            </p>
                            <a
                                href={`/downloads/${asset.file}`}
                                download
                                className="inline-flex items-center gap-2 font-mono text-xs text-white uppercase tracking-widest hover:text-gold transition-colors"
                            >
                                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                Download File
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
