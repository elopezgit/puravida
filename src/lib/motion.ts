import type { Transition, Variants } from 'motion/react'

/* Curvas compartidas. Todas arrancan rapito y terminan largo: eso es lo que
   hace que una transicion se lea como "premium" y no como "animada". */
export const EASE = [0.16, 1, 0.3, 1] as const

export const spring: Transition = { type: 'spring', stiffness: 220, damping: 30, mass: 0.9 }

export const stagger = (delayChildren = 0, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})

export const itemUp: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
}