import { useEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------- */
/*  Matchers                                                              */
/* ---------------------------------------------------------------------- */
export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])

  return match
}

/** Puntero grueso: mouse o trackpad. En el celu es false. */
export const useIsFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)')
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/* ---------------------------------------------------------------------- */
/*  Scroll                                                                */
/* ---------------------------------------------------------------------- */

/** Progress bar 0..1 del scroll vertical, interpolada. */
export function useScrollProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    let cur = 0
    let raf = 0
    let last = performance.now()

    const read = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const max = document.documentElement.scrollHeight - window.innerHeight
      const target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

      cur += (target - cur) * (1 - Math.exp(-14 * dt))
      if (Math.abs(target - cur) < 0.0002) cur = target
      setP(cur)

      raf = requestAnimationFrame(read)
    }

    raf = requestAnimationFrame(read)
    return () => cancelAnimationFrame(raf)
  }, [])

  return p
}

/** Booleano cuando el elemento entro en viewport. Se desconecta luego. */
export function useInView<T extends HTMLElement>(rootMargin = '-10% 0px -10% 0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold: 0.08 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [seen, rootMargin])

  return { ref, seen }
}

/** Valor animado 0 -> target cuando entra en pantalla. */
export function useCountUp(target: number, run: boolean, duration = 1700) {
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!run) {
      setV(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(target)
      return
    }

    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setV(target * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])

  return v
}

/* ---------------------------------------------------------------------- */
/*  Scroll lock sin la dermatitis de los iOS                              */
/* ---------------------------------------------------------------------- */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const y = window.scrollY
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }

    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.width = '100%'

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      window.scrollTo(0, y)
    }
  }, [locked])
}

/* ---------------------------------------------------------------------- */
/*  Escape + click fuera, para drawers y modales                          */
/* ---------------------------------------------------------------------- */
export function useDismiss(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onClose])
}