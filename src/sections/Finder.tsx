import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { AXES, PRODUCTS, type Axis } from '@/lib/products'
import { money } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { Button, Pill } from '@/components/ui/Primitives'
import { useCart } from '@/store/cart'
import { scrollTo } from '@/lib/smooth'
import { cn } from '@/lib/utils'

/**
 * Buscador por necesidad. El cliente no sabe que hongo necesita: sabe que
 * se siente mal. Le mostramos el feeling, el elige, y le decimos que tomar.
 */
export function Finder() {
  const [axis, setAxis] = useState<Axis | null>(null)
  const { add, show } = useCart()

  const hits = useMemo(
    () =>
      axis
        ? PRODUCTS.filter((p) => p.axes.includes(axis)).sort((a, b) => {
            const aBlend = a.category === 'blend' ? 1 : 0
            const bBlend = b.category === 'blend' ? 1 : 0
            return bBlend - aBlend || b.highlights.length - a.highlights.length
          })
        : [],
    [axis],
  )

  const label = axis ? AXES.find((a) => a.id === axis)?.label : ''

  return (
    <section
      id="buscador"
      className="relative overflow-hidden border-y border-gold-200/10 bg-ink-950/70 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[60vmax] w-[60vmax] rounded-full opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle,rgba(165,126,94,0.3),transparent 68%)' }}
      />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">04</span>
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
              <span className="eyebrow">¿Qué necesito?</span>
            </div>
          </Reveal>
          <h2 className="mt-6 text-[clamp(1.95rem,5.2vw,3.9rem)] leading-[1] font-light text-bone-50">
            <SplitText text="No pensés en hongos." className="block" />
            <SplitText text="Pensá en cómo" className="block text-gold-gradient" delay={0.08} />
            <SplitText text="te sentís hoy." className="block" delay={0.16} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-[52ch] text-[0.98rem] leading-relaxed text-bone-400">
              Elegí lo que te está pasando y te decimos qué sumar. Es la misma pregunta que nos
              hacemos nosotros cuando alguien nos escribe.
            </p>
          </Reveal>
        </div>

        {/* Opciones */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap justify-center gap-2.5">
            {AXES.map((a) => {
              const on = axis === a.id
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAxis(on ? null : a.id)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border px-5 py-3.5 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    on
                      ? 'border-gold-300/55 bg-gold-300/10'
                      : 'border-gold-200/14 bg-ink-900/40 hover:-translate-y-0.5 hover:border-gold-200/35 hover:bg-ink-800/50',
                  )}
                >
                  <span
                    className={cn(
                      'block text-[0.94rem] leading-tight transition-colors duration-400',
                      on ? 'text-gold-100' : 'text-bone-200',
                    )}
                  >
                    {a.label}
                  </span>
                  <span className="mt-1 block font-mono text-[0.75rem] uppercase tracking-[0.14em] text-bone-600">
                    {a.hint}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {axis && (
            <motion.div
              key={axis}
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-12"
            >
              <div className="glass overflow-hidden rounded-[1.75rem]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-200/12 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <Pill>Para: {label}</Pill>
                    <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-500">
                      {hits.length} {hits.length === 1 ? 'opción' : 'opciones'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAxis(null)}
                    className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-500 transition-colors hover:text-gold-200"
                  >
                    <RotateCcw size={12} strokeWidth={1.7} />
                    Empezar de nuevo
                  </button>
                </div>

                <ul className="divide-y divide-gold-200/10">
                  {hits.map((p, i) => (
                    <motion.li
                      key={p.slug}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.06 + i * 0.055 }}
                      className="group flex flex-wrap items-center gap-4 px-6 py-5 transition-colors duration-500 hover:bg-gold-200/[0.04] sm:flex-nowrap sm:px-8"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-20 w-16 shrink-0 rounded-xl object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-[1.12rem] leading-tight text-bone-50">
                            {p.name}
                          </h3>
                          <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-gold-300/85">
                            {p.category === 'blend' ? 'Blend' : 'Elixir simple'}
                          </span>
                        </div>
                        <p className="mt-1.5 max-w-[54ch] text-[0.87rem] leading-relaxed text-bone-400">
                          {p.short}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="font-display text-[1.15rem] text-gold-100">
                          {money(p.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            add(p.slug)
                            show(true)
                          }}
                          aria-label={`Agregar ${p.name}`}
                          className="grid h-11 w-11 place-items-center rounded-full border border-gold-300/30 text-gold-100 transition-all duration-500 hover:border-gold-200 hover:bg-gold-300 hover:text-ink-950 active:scale-90"
                        >
                          <ArrowRight size={15} strokeWidth={1.7} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold-200/12 px-6 py-5 sm:px-8">
                  <p className="max-w-[48ch] text-[0.85rem] leading-relaxed text-bone-500">
                    ¿Seguís con dudas? Contanos tu caso y te decimos cuál sumar y en qué horario.
                    No te vamos a vender de más.
                  </p>
                  <Button size="sm" onClick={() => scrollTo('#catalogo')}>
                    Ver todo el catálogo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}