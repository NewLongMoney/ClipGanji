import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Standard scroll-triggered fade-up
export const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
}

// Staggered children
export const stagger = {
    whileInView: { transition: { staggerChildren: 0.12 } }
}

// Phone float
export const float: import("framer-motion").Variants = {
    animate: {
        y: [0, -12, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
}
