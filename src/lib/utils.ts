import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** 24300 -> "$ 24.300" */
export const money = (n: number) => ars.format(n).replace(/\u00a0/g, ' ')

export const pad = (n: number) => String(n).padStart(2, '0')

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Interpolacion exponencial independiente del framerate. */
export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt))

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export const isTouch = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false ||
    'ontouchstart' in window)