"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { campaigns as staticCampaigns } from "@/app/../data/campaigns"
import { CampaignCard, Campaign } from "@/app/components/ui/CampaignCard"
import { cn } from "@/app/lib/utils"

function mapDbCampaign(c: {
    id: string;
    brandPublic: string;
    category: string;
    accentColor: string;
    headline: string;
    brief: string;
    format: 'logo-bug' | 'video-placement' | 'both';
    platforms: ('tiktok' | 'reels' | 'shorts')[];
    payPer1000Views: number;
    bonusThreshold?: number;
    bonusAmount?: number;
    endDate: string;
    spotsRemaining?: number;
    status: string;
    isEnrolled?: boolean;
}): Campaign {
    return {
        id: c.id,
        brand: c.brandPublic,
        category: c.category,
        logoColor: c.accentColor,
        headline: c.headline,
        brief: c.brief,
        format: c.format,
        platforms: c.platforms,
        payPerThousandViews: c.payPer1000Views,
        bonusThreshold: c.bonusThreshold || 50000,
        bonusAmount: c.bonusAmount || 1000,
        deadline: c.endDate ? new Date(c.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling',
        spotsRemaining: c.spotsRemaining || 10,
        status: (c.status === 'active' ? 'open' : c.status) as 'open' | 'filling' | 'full',
        isEnrolled: c.isEnrolled,
    }
}

export default function CampaignsBoard() {
    const [filter, setFilter] = useState("All")
    const [campaigns, setCampaigns] = useState<Campaign[]>(staticCampaigns)
    const [loading, setLoading] = useState(true)
    const categories = ["All", "Betting", "Fintech", "Telco", "Entertainment"]

    useEffect(() => {
        fetch('/api/clipper/campaigns')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setCampaigns(data.map(mapDbCampaign))
                }
                // If DB has no campaigns yet, keep static fallback
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const filteredCampaigns = filter === "All" 
        ? campaigns 
        : campaigns.filter(c => c.category === filter)

    return (
        <PageWrapper>
            <Navbar />
            <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative">
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col mb-16">
                        <span className="font-mono text-sm tracking-widest text-gold uppercase mb-4">
                            {"// OPEN CAMPAIGNS"}
                        </span>
                        <h1 className="font-anton text-5xl md:text-7xl text-white uppercase mb-6 drop-shadow-lg">
                            ACTIVE BRAND CAMPAIGNS
                        </h1>
                        <p className="font-sans text-lg text-gray-light max-w-2xl leading-relaxed">
                            Browse live campaigns below. Each campaign shows the brand, brief summary, pay rate, and deadline. Apply from your dashboard.
                        </p>
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={cn(
                                    "px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors rounded-sm border",
                                    filter === category 
                                        ? "bg-green border-green text-black font-bold" 
                                        : "bg-ink border-border text-gray-light hover:text-white"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        /* Card Grid */
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence>
                                {filteredCampaigns.map((campaign: Campaign) => (
                                    <motion.div
                                        key={campaign.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CampaignCard campaign={campaign} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {filteredCampaigns.length === 0 && (
                                <div className="col-span-full py-16 text-center border border-dashed border-border rounded-xl">
                                    <p className="font-sans text-gray-light text-lg">
                                        No open campaigns for this category right now.<br/>
                                        Check back soon or register to get notified!
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </PageWrapper>
    )
}
