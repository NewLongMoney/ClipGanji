"use client"

import { motion } from 'framer-motion'

const items = ['TIKTOK', 'INSTAGRAM REELS', 'YOUTUBE SHORTS', '10+ CLIPPERS', 'VERIFIED KENYAN VIEWS', 'UTM TRACKED', '72 HOUR LAUNCH', 'NO AD BLOCKERS']

export function Ticker() {
  return (
    <div className="bg-green overflow-hidden py-3 border-y border-green-dim">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-black font-black text-sm tracking-widest font-mono">
            {item} <span className="text-black/40 mx-2">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
