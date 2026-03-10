"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import Image from "next/image"

export function PhoneMockup() {
    return (
        <motion.div
            className="relative w-full max-w-[320px] mx-auto aspect-[9/16] bg-black rounded-[2rem] border-4 border-border overflow-hidden shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Fake Video Content Area */}
            <div className="absolute inset-0 bg-ink" />


            {/* Fake UI Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 pb-12 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10">
                <div className="flex items-end justify-between mb-2">
                    <div className="flex-1 pr-4">
                        {/* Enlarged Brand Logo (1.5x) positioned lower, shoulder-to-shoulder with UI icons */}
                        <div className="w-1/2 max-w-[150px] opacity-95 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.8)] relative aspect-video mb-4">
                            <Image
                                src="/images/2.png"
                                alt="Brand Logo"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="font-sans font-medium text-white text-sm mb-1">
                            @clipganji_creator
                        </div>
                        <div className="font-sans text-xs text-white/80 line-clamp-2">
                            Wait until the end 🤯 This is why we created the best network in Kenya. Let&apos;s go! 🚀
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-white/80 overflow-hidden border border-white/20">
                            <div className="w-full h-full bg-gray" />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <Heart className="w-6 h-6 text-white drop-shadow-md" />
                            <span className="text-[10px] text-white font-medium">102K</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <MessageCircle className="w-6 h-6 text-white drop-shadow-md" />
                            <span className="text-[10px] text-white font-medium">1,204</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <Bookmark className="w-6 h-6 text-white drop-shadow-md" />
                            <span className="text-[10px] text-white font-medium">8K</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <Share2 className="w-6 h-6 text-white drop-shadow-md" />
                            <span className="text-[10px] text-white font-medium">Share</span>
                        </div>
                    </div>
                </div>

                {/* Fake Music Scroller */}
                <div className="flex items-center gap-2 mt-3 overflow-hidden">
                    <div className="w-3 h-3 text-white">🎵</div>
                    <div className="font-sans text-xs text-white font-normal truncate">
                        original sound - ClipGanji
                    </div>
                </div>
            </div>

            {/* Fake Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
                <div className="h-full bg-white/80 w-1/3" />
            </div>
        </motion.div >
    )
}
