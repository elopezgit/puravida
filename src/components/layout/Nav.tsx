import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, ShoppingBag, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { scrollTo } from '@/lib/smooth'
import { useBodyLock, useMediaQuery } from '@/lib/hooks'
import { useCart } from '@/store/cart'

import { CONTACTS } from '@/lib/site'

export const SECTIONS = [
  { id: 'metodo', label: 'El método' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'buscador', label: '¿Qué necesito?' },
  { id: 'ritual', label: 'El ritual' },
  { id: 'voces', label: 'Voces' },
  { id: 'preguntas', label: 'Preguntas' },
] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { count, show } = useCart()

  useBodyLock(menu)

  /* Header que se esconde al bajar y vuelve al subir */
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        setHidden(y > 420 && y > last + 6)
        if (y < 60) setHidden(false)
        last = y
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, y / max) : 0)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  /* Scroll spy: marca en que seccion estas parado */
  useEffect(() => {
    if (!isDesktop) return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (vis) setActive(vis.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.6] },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [isDesktop])

  const go = (id: string) => {
    setMenu(false)
    window.setTimeout(() => scrollTo(`#${id}`, -80), menu ? 260 : 0)
  }

  return (
    <>
      {/* Barra de progreso del lectura */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[120] h-px origin-left"
        style={{
          scaleX: progress,
          background: 'linear-gradient(90deg,#a8813f,#d6ae6a,#f3e6c9)',
          boxShadow: '0 0 12px rgba(214,174,106,0.55)',
        }}
      />

      <motion.header
        data-nav
        className="fixed inset-x-0 top-0 z-[110] px-3 pt-3 sm:px-5 sm:pt-4"
        animate={{ y: hidden && !menu ? '-140%' : '0%' }}
        transition={{ duration: 0.62, ease: EASE }}
      >
        <nav
          className={cn(
            'mx-auto flex max-w-[88rem] items-center justify-between gap-3 rounded-full px-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-4',
            scrolled
              ? 'glass-strong h-[58px] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]'
              : 'h-[64px] border border-transparent bg-transparent',
          )}
        >
          {/* Marca */}
          <button
            type="button"
            onClick={() => go('top')}
            className="group flex shrink-0 items-center gap-2.5 py-1 pr-1"
            aria-label="Hongos Pura Vida — inicio"
          >
            {/* 44px en movil: por debajo el dedo no llega bien. */}
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300/30 bg-ink-900/60 transition-all duration-500 sm:h-9 sm:w-9 group-hover:border-gold-300/70 group-hover:bg-ink-800">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="text-gold-300">
                <path d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7Z" stroke="currentColor" strokeWidth="1.35" />
                <path d="M12 13c0-4-3-7-7-7 0 4 3 7 7 7Z" stroke="currentColor" strokeWidth="1.35" />
                <path d="M6 11h12" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
              </svg>
              <span
                aria-hidden
                className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: '0 0 0 4px rgba(214,174,106,0.10)' }}
              />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[0.95rem] tracking-[0.01em] text-bone-50">Pura Vida</span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.32em] text-gold-400/80">
                Hongos
              </span>
            </span>
          </button>

          {/* Links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {SECTIONS.map((s) => {
              const on = active === s.id
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[0.8rem] transition-colors duration-400',
                      on ? 'text-gold-100' : 'text-bone-400 hover:text-bone-100',
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-gold-300/25 bg-gold-300/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {s.label}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Acciones */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => show(true)}
              aria-label={`Abrir pedido (${count} productos)`}
              className="glass relative flex h-11 items-center gap-2 rounded-full pl-3.5 pr-3 transition-colors duration-400 hover:border-gold-300/50"
            >
              <ShoppingBag size={15} className="text-gold-200" strokeWidth={1.5} />
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-200">
                Pedido
              </span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                    className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-300 px-1 font-mono text-[0.75rem] font-medium text-ink-950"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <a
              href={CONTACTS[0].href}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden h-10 items-center gap-2 rounded-full border border-gold-300/35 bg-gold-300/10 px-4 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-gold-100 transition-all duration-400 hover:border-gold-300/70 hover:bg-gold-300/20 sm:flex"
            >
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menu}
              className="glass grid h-11 w-11 place-items-center rounded-full text-bone-100 transition-colors duration-400 hover:border-gold-300/50 lg:hidden"
            >
              {menu ? <X size={17} strokeWidth={1.5} /> : <Menu size={17} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Menu mobile a pantalla completa */}
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[105] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="absolute inset-0 bg-ink-950/92 backdrop-blur-2xl" />
            <div className="aurora absolute inset-0" aria-hidden />

            <motion.div
              className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } }}
            >
              <ul className="flex flex-col">
                {[{ id: 'top', label: 'Inicio' }, ...SECTIONS].map((s, i) => (
                  <motion.li
                    key={s.id}
                    variants={{
                      hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.7, ease: EASE },
                      },
                    }}
                    className="border-b border-gold-200/10"
                  >
                    <button
                      type="button"
                      onClick={() => go(s.id)}
                      className="flex w-full items-baseline gap-4 py-4 text-left"
                    >
                      <span className="font-mono text-[0.75rem] tracking-[0.24em] text-gold-300/85">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[1.85rem] leading-none text-bone-50">
                        {s.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                className="flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false)
                    window.setTimeout(() => show(true), 280)
                  }}
                  className="flex h-13 items-center justify-center gap-2 rounded-full border border-gold-200/25 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-gold-100"
                >
                  <Plus size={14} strokeWidth={1.6} /> Armar mi pedido
                </button>
                <a
                  href={CONTACTS[0].href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-100 to-gold-400 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-ink-950"
                >
                  Hablar por WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}