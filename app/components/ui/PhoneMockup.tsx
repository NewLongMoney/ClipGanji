"use client"

import { motion } from "framer-motion"

export function PhoneMockup() {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative mx-auto"
      style={{ width: 280, height: 560 }}
    >
      {/* Phone shell */}
      <div className="absolute inset-0 rounded-[40px] bg-[#1a1a1a] border-2 border-[#333] shadow-2xl overflow-hidden">
        
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <span className="text-white text-xs font-medium">9:41</span>
          <div className="w-16 h-4 bg-black rounded-full" /> {/* Dynamic island */}
          <div className="flex gap-1 items-center">
            <div className="w-3 h-2 border border-white rounded-sm" />
          </div>
        </div>

        {/* Video background — dark gradient simulating a clip */}
        <div className="absolute inset-0 top-10 bg-gradient-to-b from-[#1a2a1a] via-[#0d1a0d] to-[#060809]" />
        
        {/* LOGO BUG — positioned in the lower third as requested */}
        <div className="absolute bottom-[90px] left-3 right-12 z-20 flex flex-col items-center">
            <div className="absolute -top-6 left-2 flex items-center gap-1">
              <span className="text-[#00C853] text-[9px] font-mono whitespace-nowrap">↓ always visible</span>
            </div>
            <div className="w-full h-[60px] bg-[#F5B800] text-black text-xl font-black rounded-lg flex items-center justify-center shadow-lg border-[3px] border-[#d49f00]">
                BRAND LOGO
            </div>
        </div>

        {/* Creator info bottom */}
        <div className="absolute bottom-6 left-3 right-12 z-20">
          <p className="text-white text-xs font-bold">@clipganji_creator</p>
          <p className="text-white/70 text-[10px] mt-1 leading-tight">
            Your brand. Every clip. Every view. 🔥
          </p>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-4 h-4 rounded-full bg-[#00C853]" />
            <span className="text-white/60 text-[9px]">original sound - ClipGanji</span>
          </div>
        </div>

        {/* TikTok right-side icons */}
        <div className="absolute right-2 bottom-12 flex flex-col items-center gap-4 z-20">
          {['❤️', '💬', '↗️', '🎵'].map((icon, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-lg">{icon}</span>
              <span className="text-white/60 text-[8px]">{['102K','1.2K','8K',''][i]}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-white/20">
          <motion.div
            className="h-full bg-white"
            animate={{ width: ['30%', '75%', '30%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
