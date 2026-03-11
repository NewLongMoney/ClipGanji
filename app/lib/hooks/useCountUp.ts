import { useMotionValue, animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 1.5) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const count = useMotionValue(0)
  
  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration, ease: 'easeOut' })
    }
  }, [isInView, count, target, duration])
  
  return { ref, count }
}
