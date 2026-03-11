"use client"

import { useTransform, motion } from "framer-motion"
import { useCountUp } from "@/app/lib/hooks/useCountUp"

interface StatCounterProps {
  value: number;
  suffix?: string;
}

export function StatCounter({ value, suffix = "" }: StatCounterProps) {
  const { ref, count } = useCountUp(value, 2)
  const displayValue = useTransform(count, (latest) => Math.round(latest).toString() + suffix)

  return (
    <motion.span ref={ref}>
      {displayValue}
    </motion.span>
  )
}
