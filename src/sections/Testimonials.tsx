import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/site'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Reveal, SplitText } from '@/components/ui/Reveal'

export function Testimonials() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const n = TESTIMONIALS.length

  const go = useCallback(
    (d: number) => {
      setDir(d)
      setI((v) => (v + d + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => go(1), 6500)
    return () => window.clearInterval(id)
  }, [go])

  const t = TESTIMONIALS[i]

  return (
    <section
      id="voces"
      className="relative overflow-hidden border-y border-gold-200/10 bg-ink-950/70 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-1/3 h-[56vmax] w-[56vmax] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle,rgba(214,174,106,0.24),transparent 68%)' }}
      />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">06</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">Voces</span>
              </div>
            </Reveal>
            <h2 className="mt-6 text-[clamp(1.95rem,5vw,3.4rem)] leading-[1] font-light text-bone-50">
              <SplitText text="Gente que" className="block" />
              <SplitText text="ya lo probó." className="block text-gold-gradient" delay={0.08} />
            </h2>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[34ch] text-[0.96rem] leading-relaxed text-bone-400">
                Sin filtros. Esto es lo que nos escribieron.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Anterior"
                  className="glass grid h-11 w-11 place-items-center rounded-full text-bone-300 transition-all duration-500 hover:border-gold-300/50 hover:text-gold-100"
                >
                  <ArrowLeft size={15} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Siguiente"
                  className="glass grid h-11 w-11 place-items-center rounded-full text-bone-300 transition-all duration-500 hover:border-gold-300/50 hover:text-gold-100"
                >
                  <ArrowRight size={15} strokeWidth={1.6} />
                </button>
                <span className="ml-2 font-mono text-[0.75rem] tabular-nums tracking-[0.2em] text-bone-500">
                  {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Tarjeta */}
          <div className="relative min-h-[380px] sm:min-h-[340px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={t.name}
                custom={dir}
                initial={{ opacity: 0, x: dir * 46, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: dir * -46, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-10 text-gold-200/[0.08]"
                >
                  <Quote size={150} strokeWidth={1} />
                </span>

                <div className="relative flex gap-1">
                  {Array.from({ length: t.stars }).map((_, k) => (
                    <Star key={k} size={14} className="fill-gold-300 text-gold-300" strokeWidth={0} />
                  ))}
                </div>

                <blockquote className="relative mt-7 flex-1">
                  <p className="font-display text-[clamp(1.35rem,3vw,2.1rem)] font-light leading-[1.24] text-bone-50">
                    «{t.quote}»
                  </p>
                </blockquote>

                <figcaption className="relative mt-9 flex items-center gap-4 border-t border-gold-200/12 pt-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300/30 bg-ink-800 font-display text-[1rem] text-gold-100">
                    {t.name.charAt(0)}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-display text-[1.02rem] leading-none text-bone-50">
                      {t.name}
                    </span>
                    <span className="mt-1.5 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-gold-300/85">
                      Tomó {t.product}
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Paginación */}
            {/*
              El botón mide 44x44 y el pill de 3px va dentro. Con la barra
              midiendo 3px de alto el botón quedaba imposible de tocar en el
              celular: el dedo nunca cae en 3px.
            */}
            <div className="-mb-2 mt-3 flex gap-1">
              {TESTIMONIALS.map((x, k) => (
                <button
                  key={x.name}
                  type="button"
                  onClick={() => {
                    setDir(k > i ? 1 : -1)
                    setI(k)
                  }}
                  aria-label={`Ver testimonio de ${x.name}`}
                  aria-current={k === i}
                  className="grid h-11 w-11 place-items-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'block h-[3px] rounded-full transition-all duration-600',
                      k === i ? 'w-10 bg-gold-300' : 'w-5 bg-gold-200/20 hover:bg-gold-200/40',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}