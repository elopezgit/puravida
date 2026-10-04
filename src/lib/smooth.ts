/**
 * Scroll suave con inercia propia. Singleton para que cualquier modulo
 * (nav, botones, carrito) pueda ordenar el scroll sin propagar refs.
 *
 * En tactil NO se prende. El scroll nativo del celular ya viene con inercia y
 * con el comportamiento correcto al tocar y arrastrar; meterle un motor propio
 * lo vuelve pastoso, pelea con el rebote del rubber-band y gasta bateria en un
 * requestAnimationFrame que no para. Ahi se deja el scroll del sistema.
 */
import Lenis from 'lenis'

let instance: Lenis | null = null
let rafId = 0
let reduced = false

const wantsSmooth = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function initSmoothScroll() {
  if (typeof window === 'undefined') return
  destroySmoothScroll()
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!wantsSmooth()) return

  instance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    lerp: 0.09,
    /* En tactil se deja el scroll nativo: ver nota de arriba. */
    syncTouch: false,
  })

  /* El rAF se detiene cuando la pestaña no esta a la vista. */
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId)
      rafId = 0
      instance?.stop()
    } else if (!rafId) {
      instance?.start()
      rafId = requestAnimationFrame(loop)
    }
  }

  const loop = (time: number) => {
    instance?.raf(time)
    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)
  document.addEventListener('visibilitychange', onVisibility)

  const cleanup = () => document.removeEventListener('visibilitychange', onVisibility)
  ;(instance as Lenis & { __cleanup?: () => void }).__cleanup = cleanup
}

export function destroySmoothScroll() {
  cancelAnimationFrame(rafId)
  rafId = 0
  if (instance) {
    ;(instance as Lenis & { __cleanup?: () => void }).__cleanup?.()
    instance.destroy()
    instance = null
  }
}

/**
 * Cuanto hay que dejar libre arriba para que la nav no tape el destino.
 *
 * No es un numero fijo: la nav cambia de alto segun si esta scrolleada (64px
 * contra 58px) y el padding superior varia por breakpoint (76px en celular,
 * 80px en escritorio). Se mide el header real en el momento del salto, asi que
 * el destino siempre queda justo por debajo de la barra.
 */
function navOffset() {
  const header = document.querySelector<HTMLElement>('[data-nav]')
  return -(header?.offsetHeight ?? 76)
}

/** Salta a un elemento o selector con offset para la nav. */
export function scrollTo(target: string | HTMLElement, extra = 12) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  const offset = navOffset() - extra
  if (instance) instance.scrollTo(el, { offset, duration: 1.35 })
  else {
    /* Sin Lenis (movil o reduced motion): scroll nativo, que ya es fluido. */
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

export function stopScroll(v: boolean) {
  if (instance) {
    if (v) instance.stop()
    else instance.start()
  }
}