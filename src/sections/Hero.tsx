import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, MessageCircle, Sparkles } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { scrollTo } from '@/lib/smooth'
import { useIsFinePointer, useReducedMotion } from '@/lib/hooks'
import { Aurora, Counter } from '@/components/ui/Atmosphere'
import { SplitText } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Primitives'
import { BRAND, CONTACTS, STATS } from '@/lib/site'
import { PRODUCTS } from '@/lib/products'
import { cn } from '@/lib/utils'

/* Slides de fondo: las piezas reales de marca + el video de taller. */
const SLIDES = [
  { src: '/media/carrusel-3.webp', kind: 'img' as const, zoom: 1.14 },
  { src: '/media/lab-m.mp4', kind: 'video' as const, zoom: 1, poster: '/media/lab-poster.webp' },
  { src: '/media/carrusel-1.webp', kind: 'img' as const, zoom: 1.1 },
  { src: '/media/carrusel-2.webp', kind: 'img' as const, zoom: 1.16 },
  { src: '/media/carrusel-4.webp', kind: 'img' as const, zoom: 1.08 },
]

/* Tres frascos flotando, tomados del catalogo real. */
const FLOATERS = ['reishi', 'cordyceps', 'rhodiola']

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const [slide, setSlide] = useState(0)
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()
  const fine = useIsFinePointer()

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ['start start', 'end start'],
  })

  const yCards = useTransform(scrollYProgress, [0, 1], [0, -110])
  const yMedia = useTransform(scrollYProgress, [0, 1], [0, 90])
  const fade = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const scaleMedia = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  /* Cambio de slide cada 6,5 s, pausado si la pestaña no se ve. */
  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6500)
    const onVis = () => document.hidden && window.clearInterval(id)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120)
    return () => window.clearTimeout(t)
  }, [])

  /* Paralaje sutil de los frascos con el mouse. */
  const parallax = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    if (!fine || reduce || !parallax.current) return
    const r = parallax.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    parallax.current.style.setProperty('--mx', `${(-px * 26).toFixed(2)}px`)
    parallax.current.style.setProperty('--my', `${(-py * 20).toFixed(2)}px`)
  }

  const floaters = FLOATERS.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean)

  return (
    <section
      ref={root}
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden pt-[86px] pb-16 sm:pt-[96px]"
    >
      {/* ---------------------------------------------------------------- */}
      {/*  Fondo: slideshow + aurora + grano + vineta                         */}
      {/* ---------------------------------------------------------------- */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: yMedia, scale: scaleMedia }}>
        <div className="absolute inset-0 bg-ink-950" />

        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            aria-hidden
            className={cn(
              'absolute inset-0 transition-opacity duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
              slide === i && ready ? 'opacity-100' : 'opacity-0',
            )}
          >
            {s.kind === 'img' ? (
              <img
                src={s.src}
                alt=""
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover opacity-[0.42]"
                style={
                  reduce
                    ? undefined
                    : { animation: `float-slow ${16 + i * 4}s ease-in-out infinite` }
                }
              />
            ) : /* El video solo se monta cuando su slide esta en pantalla: asi el
                   navegador no descarga los 2.7 MB de golpe al entrar. */
              slide === i && ready ? (
              <video
                src={s.src}
                poster={s.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
                className="h-full w-full object-cover opacity-[0.34]"
              />
            ) : null}
          </div>
        ))}

        {/* Auroras + velo oscuro para que el texto siempre gane */}
        <Aurora opacity={0.75} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/62 to-ink-950" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 82% at 50% 8%, transparent 30%, rgba(7,6,5,0.72) 78%, rgba(7,6,5,0.96) 100%)',
          }}
        />
        <div className="grain absolute inset-0" style={{ opacity: 0.24 }} />
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/*  Contenido                                                       */}
      {/* ---------------------------------------------------------------- */}
      <motion.div
        style={{ opacity: fade }}
        className="container-x relative flex min-h-[calc(100svh-160px)] flex-col justify-center"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
          {/* --- Columna de texto --- */}
          <div className="relative z-10 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-gold-300/25 bg-ink-900/50 py-2 pl-2 pr-4 backdrop-blur-xl"
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-gold-300/35" />
                <Sparkles size={12} className="relative text-gold-200" strokeWidth={1.6} />
              </span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.26em] text-gold-100/90">
                {BRAND.origin} · {BRAND.format}
              </span>
            </motion.div>

            <h1 className="max-w-[15ch] text-[clamp(2.6rem,8.4vw,6.6rem)] font-light leading-[0.96] tracking-[-0.035em]">
              <SplitText text="Dónde comienza" className="block text-bone-50" delay={0.25} />
              <SplitText text="tu transformación" className="block text-gold-gradient" delay={0.34} />
              <SplitText text="interior" className="block text-bone-50" delay={0.43} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.75 }}
              className="mt-7 max-w-[46ch] text-[1.02rem] leading-relaxed text-bone-300 sm:text-[1.08rem]"
            >
              Elixires de hongos medicinales elaborados con{' '}
              <span className="text-gold-100">extracción cíclica</span> y cavitación acústica.
              Diez aliados naturales para volver a sentirte en eje — sin cafeína, sin
              estimulantes y sin perder el sueño por ello.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.88 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" onClick={() => scrollTo('#catalogo')}>
                Ver el catálogo
                <ArrowDown size={14} strokeWidth={1.8} className="transition-transform duration-500 group-hover/btn:translate-y-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                href={CONTACTS[0].href}
                target="_blank"
              >
                <MessageCircle size={14} strokeWidth={1.8} />
                Pedir por WhatsApp
              </Button>
            </motion.div>

            {/* Cifras */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 1.05 }}
              className="mt-12 grid w-full max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-gold-200/12 pt-7 sm:grid-cols-4"
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="font-display text-[1.65rem] leading-none text-gold-100">
                    <Counter to={s.value} suffix={s.suffix} />
                  </dt>
                  <dd className="font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.18em] text-bone-500">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* --- Columna de frascos flotantes --- */}
          <div
            ref={parallax}
            onMouseMove={onMove}
            className="relative hidden h-[540px] lg:block"
            style={{ ['--mx' as string]: '0px', ['--my' as string]: '0px' }}
          >
            <motion.div
              style={{ y: yCards }}
              className="absolute inset-0"
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.5 } } }}
            >
              {floaters.map((p, i) => {
                const depth = [0, -46, -22][i]
                const rot = [-7, 4, 9][i]
                return (
                  <motion.div
                    key={p.slug}
                    variants={{
                      hidden: { opacity: 0, y: 70, rotate: rot * 2.4, scale: 0.9, filter: 'blur(14px)' },
                      show: {
                        opacity: 1,
                        y: 0,
                        rotate: rot,
                        scale: 1,
                        filter: 'blur(0px)',
                        transition: { duration: 1.25, ease: EASE },
                      },
                    }}
                    className="animate-float-slow absolute w-[212px]"
                    style={{
                      left: `${6 + i * 24}%`,
                      top: `${i === 1 ? -6 : i === 0 ? 22 : 46}%`,
                      zIndex: i === 1 ? 3 : 2,
                      animationDelay: `${i * -3.4}s`,
                      transform: `translate3d(calc(var(--mx) * ${1 - i * 0.32}), calc(var(--my) * ${1 - i * 0.32}), ${depth}px)`,
                      transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => scrollTo('#catalogo')}
                      className="group glass block w-full overflow-hidden rounded-[1.4rem] p-2.5 text-left transition-shadow duration-700 hover:shadow-[0_40px_90px_-30px_rgba(214,174,106,0.4)]"
                    >
                      <div className="relative overflow-hidden rounded-[1rem] bg-ink-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="aspect-[533/800] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                          style={{ background: `radial-gradient(70% 55% at 50% 100%, ${p.glow}44, transparent 70%)` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 px-2 pb-1 pt-3">
                        <span className="font-display text-[0.95rem] text-bone-50">{p.name}</span>
                        <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-gold-400/80">
                          50 ml
                        </span>
                      </div>
                    </button>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.button
        type="button"
        onClick={() => scrollTo('#manifiesto')}
        style={{ opacity: fade }}
        className="group absolute inset-x-0 bottom-5 mx-auto flex w-fit flex-col items-center gap-2.5"
        aria-label="Bajar al contenido"
      >
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.3em] text-bone-500 transition-colors duration-500 group-hover:text-gold-200">
          Deslizá
        </span>
        <span className="relative h-9 w-px overflow-hidden bg-gold-300/20">
          <span className="animate-scroll-hint absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-gold-200 to-transparent" />
        </span>
      </motion.button>
    </section>
  )
}