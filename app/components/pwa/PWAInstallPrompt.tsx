'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone) {
      setIsStandalone(true)
      return
    }

    const handler = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent
      promptEvent.preventDefault()
      setDeferredPrompt(promptEvent)
      
      // Delay showing the prompt slightly for better UX
      setTimeout(() => {
        setIsVisible(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsVisible(false)
    }
  }

  if (isStandalone) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 z-[100] md:bottom-10 md:right-10"
        >
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00C853] to-[#F5B800] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex items-center gap-2 bg-[#0E1214]/90 backdrop-blur-xl border border-white/10 rounded-full pl-5 pr-2 py-2 shadow-2xl">
              <button 
                onClick={handleInstallClick}
                className="flex items-center gap-3 text-white"
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-mono text-[#00C853] uppercase tracking-tighter">Install Now</span>
                  <span className="font-anton text-xs uppercase tracking-wider">ClipGanji App</span>
                </div>
                <div className="w-10 h-10 bg-[#00C853] text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95">
                  <Download size={18} strokeWidth={2.5} />
                </div>
              </button>
              
              <div className="w-[1px] h-6 bg-white/10 mx-1" />
              
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 text-[#4A5259] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
