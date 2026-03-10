"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

export function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative min-h-screen"
        >
            <div className="grain" />
            {children}
        </motion.div>
    )
}
