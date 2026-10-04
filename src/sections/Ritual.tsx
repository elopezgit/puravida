import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Droplets, Moon, Sun } from 'lucide-react'
import { RITUAL } from '@/lib/site'
import { getProduct } from '@/lib/products'
import { EASE, stagger } from '@/lib/motion'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { money } from '@/lib/utils'
import { scrollTo } from '@/lib/smooth'
import { useIsDesktop } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const ICON = [Sun, Droplets, Moon]
const TONE = [
  'from-[#F0CE8E]/25',
  'from-[#C8A583]/25',
  'from-[#5A6C8C]/25',
]

/**
 * El ritual diario. Convierte el producto en habito, que es lo que
 * realmente sostiene la venta: no el frasco, la rutina.
 */
export function Ritual() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])
  /*
   * El paralaje va solo en movil. En escritorio este mismo <div> es el ancestro
   * de una columna `lg:sticky`, y un transform permanente en el ancestro la
   * desactiva: el bloque se moveria pero la columna no se pegaria. En pantalla
   * chica la columna no es sticky, asi que ahi el efecto no pierde nada.
   */
  const wide = useIsDesktop()

  return (
    <section ref={root} id="ritual" className="relative overflow-hidden py-24 sm:py-32">
      <motion.div style={wide ? undefined : { y }} className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">05</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">El ritual</span>
              </div>
            </Reveal>
            <h2 className="mt-6 text-[clamp(1.95rem,5vw,3.6rem)] leading-[1] font-light text-bone-50">
              <SplitText text="Tres momentos" className="block" />
              <SplitText text="al día." className="block text-gold-gradient" delay={0.08} />
            </h2>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[36ch] text-[0.97rem] leading-relaxed text-bone-400">
                Un adaptógeno se toma como se toma un té, no como se toma un suplemento. Lo
                que sostiene el resultado es sostenerlo cuatro a seis semanas: ahí es donde se
                ve el antes y el después.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-5 max-w-[36ch] border-l border-gold-300/30 pl-4 font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.14em] text-gold-200/80">
                20 a 30 gotas · una o dos veces al día · agitar antes de usar
              </p>
            </Reveal>
          </div>

          <motion.ul
            variants={stagger(0.08, 0.14)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-5"
          >
            {RITUAL.map((r, i) => {
              const Icon = ICON[i]
              const p = getProduct(r.pick)
              return (
                <motion.li
                  key={r.when}
                  variants={{
                    hidden: { opacity: 0, y: 44, filter: 'blur(10px)' },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.9, ease: EASE },
                    },
                  }}
                >
                  <div className="group glass relative overflow-hidden rounded-[1.6rem] p-6 sm:p-8">
                    <div
                      aria-hidden
                      className={cn(
                        'pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100',
                        TONE[i],
                      )}
                    />

                    <div className="relative flex flex-wrap items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-300/25 text-gold-200">
                        <Icon size={17} strokeWidth={1.4} />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono text-[0.75rem] uppercase tracking-[0.24em] text-gold-300/85">
                          {r.when}
                        </span>
                        <span className="font-mono text-[0.75rem] tracking-[0.1em] text-bone-500">
                          {r.hh}
                        </span>
                      </div>
                      <span aria-hidden className="hidden h-px flex-1 bg-gold-200/12 sm:block" />
                      <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-600">
                        paso {String(i + 1).padStart(2, '0')} / 03
                      </span>
                    </div>

                    <h3 className="relative mt-6 text-[clamp(1.35rem,2.6vw,1.9rem)] leading-tight text-bone-50">
                      {r.title}
                    </h3>
                    <p className="relative mt-3 max-w-[52ch] text-[0.95rem] leading-relaxed text-bone-300/85">
                      {r.body}
                    </p>

                    {p && (
                      <button
                        type="button"
                        onClick={() => scrollTo('#catalogo')}
                        className="relative mt-6 flex items-center gap-3.5 rounded-2xl border border-gold-200/14 bg-ink-900/40 p-2.5 pr-5 text-left transition-all duration-500 hover:border-gold-300/45"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="h-14 w-11 shrink-0 rounded-lg object-cover"
                        />
                        <span className="flex flex-col">
                          <span className="font-display text-[0.95rem] text-bone-50">{p.name}</span>
                          <span className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-gold-300/80">
                            {money(p.price)} · 50 ml
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  )
}