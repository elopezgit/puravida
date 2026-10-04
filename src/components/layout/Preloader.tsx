import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '@/lib/motion'

const LINES = [
  'Hongos Pura Vida',
  'Extracción cíclica',
  'Medicina ancestral',
  'Listo',
]

/**
 * Preloader con cortina: cuenta, arma la marca y se abre en dos paños.
 * Es el primer contacto, asi que va corto: nunca mas de 2,4 s.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [open, setOpen] = useState(false)
  const [gone, setGone] = useState(false)
  const lineRef = useRef(0)
  const raf = useRef(0)
  const start = useRef(0)

  useEffect(() => {
    const boot = document.getElementById('boot')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      setPct(100)
      setGone(true)
      boot?.setAttribute('data-done', '1')
      onDone()
      return
    }

    start.current = performance.now()
    /*
     * Espera minima para que la fuente no salte y el primer frame sea lindo.
     * Corto a proposito: en un celular con 4G, tres segundos de cortina se
     * sienten como que la pagina no responde. El total ronda los 2,4 s.
     */
    const MIN = 950
    const COUNT = 1.55
    const CURTAIN = 0.85

    const tick = (now: number) => {
      const t = (now - start.current) / 1000
      // Curva: rapido al inicio, se frena cerca del final. Nada lineal.
      const raw = Math.min(1, t / COUNT)
      const eased = 1 - Math.pow(1 - raw, 2.4)
      const v = Math.min(100, Math.round(eased * 100))
      setPct(v)
      if (v < 100) {
        raf.current = requestAnimationFrame(tick)
        return
      }
      const wait = Math.max(0, MIN + COUNT * 1000 - (now - start.current))
      window.setTimeout(() => {
        setOpen(true)
        window.setTimeout(() => {
          setGone(true)
          boot?.setAttribute('data-done', '1')
          onDone()
        }, CURTAIN * 1000)
      }, wait)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [onDone])

  useEffect(() => {
    const i = Math.min(LINES.length - 1, Math.floor((pct / 100) * (LINES.length - 0.35)))
    if (i !== lineRef.current) lineRef.current = i
  }, [pct])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-ink-950"
          initial={false}
          exit={{ transition: { duration: 0 } }}
        >
          {/* Dos paños que se abren en L, como una cortina de teatro */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
            initial={{ y: 0 }}
            animate={open ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: 0 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
            initial={{ y: 0 }}
            animate={open ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: 0 }}
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
            animate={open ? { opacity: 0, y: -14, filter: 'blur(8px)' } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Marca */}
            <div className="flex items-center gap-4">
              <motion.span
                className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-300/30"
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold-300">
                  <path
                    d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path d="M12 13c0-4-3-7-7-7 0 4 3 7 7 7Z" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M6 11h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </motion.span>
              {/* text-mask y no overflow-hidden pelado: la "g" de Pura tiene cola. */}
              <div className="text-mask">
                <motion.p
                  className="font-display text-[1.05rem] tracking-[0.02em] text-bone-100"
                  initial={{ y: '130%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  Hongos Pura Vida
                </motion.p>
              </div>
            </div>

            {/* Contador */}
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <div className="relative h-px w-full overflow-hidden bg-gold-300/15">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-500 via-gold-200 to-gold-100"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex w-full items-baseline justify-between">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lineRef.current}
                    className="eyebrow text-[0.75rem]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {LINES[lineRef.current]}
                  </motion.span>
                </AnimatePresence>
                <span className="font-mono text-[0.75rem] tabular-nums text-gold-200">
                  {String(pct).padStart(3, '0')}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}