import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { EASE, itemUp, stagger } from '@/lib/motion'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { PILLARS } from '@/lib/site'
import { cn } from '@/lib/utils'

const DETAIL = [
  {
    tag: 'Ciclo 01',
    t: 'Molienda y maceración',
    d: 'El hongo se muele al momento y se deja macerar en agua purificada durante horas. Nada de extractos importados: la materia prima es la que elegimos nosotros.',
    k: ['Sin extractos prefabricados', 'Lote identificado', 'Materia prima propia'],
  },
  {
    tag: 'Ciclo 02',
    t: 'Extracción seriada',
    d: 'Tres pasadas sobre la misma biomasa. Cada ciclo separa lo que el anterior dejó; la suma es lo que termina en el frasco.',
    k: ['Tres extracciones', 'Mayor concentración', 'Absorción más fácil'],
  },
  {
    tag: 'Ciclo 03',
    t: 'Cavitación acústica',
    d: 'Ondas de ultrasonido rompen la pared celular del hongo y liberan los compuestos activos sin daño térmico ni mecánico.',
    k: ['Sin daño térmico', 'Compuestos liberados', 'Sin conservantes'],
  },
  {
    tag: 'Frase final',
    t: 'Estabilización y frasco',
    d: 'Se asienta, se filtra y se envasa en un frasco ámbar de 50 ml. Sale de acá con bitácora y fecha. Se conserva en lugar fresco.',
    k: ['Frasco de 50 ml ámbar', 'Bitácora por lote', 'Conservar en lugar fresco'],
  },
] as const

export function Method() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const lineH = useTransform(scrollYProgress, [0.08, 0.82], ['0%', '100%'])

  return (
    <section
      ref={root}
      id="metodo"
      className="relative overflow-hidden border-t border-gold-200/10 bg-ink-950/70 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(214,174,106,0.6) 1px, transparent 1px)',
          backgroundSize: '88px 100%',
        }}
      />

      <div className="container-x relative">
        {/* Encabezado */}
        <div className="grid gap-10 lg:grid-cols-[0.62fr_0.38fr] lg:items-end">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">02</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">El método</span>
              </div>
            </Reveal>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(2rem,5.4vw,4.2rem)] leading-[0.97] font-light text-bone-50">
              <SplitText text="Tres ciclos." className="block" />
              <SplitText text="Una sola" className="block text-gold-gradient" delay={0.08} />
              <SplitText text="coherencia." className="block" delay={0.16} />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-[42ch] text-[0.98rem] leading-relaxed text-bone-400 lg:pb-3">
              La mayoría de los elixires que se venden usan una sola extracción y productos
              terminados. Nosotros hacemos tres ciclos y después los rompemos con ultrasonido.
              La diferencia se nota en la botella abierta.
            </p>
          </Reveal>
        </div>

        {/* Línea de tiempo */}
        <div className="relative mt-16 lg:mt-24">
          {/* Riel */}
          <div className="absolute left-[19px] top-2 hidden h-[calc(100%-16px)] w-px bg-gold-200/12 lg:block">
            <motion.div
              className="absolute inset-x-0 top-0 w-px origin-top bg-gradient-to-b from-gold-200 via-gold-400 to-clay-400"
              style={{ height: lineH }}
            />
          </div>

          <motion.ul
            variants={stagger(0.05, 0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            className="flex flex-col gap-5 lg:gap-8"
          >
            {DETAIL.map((d, i) => (
              <motion.li key={d.tag} variants={itemUp} className="relative lg:pl-16">
                <div className="glass group relative overflow-hidden rounded-[1.6rem] p-6 transition-colors duration-700 hover:border-gold-300/35 sm:p-8">
                  {/* Numero gigante de fondo */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-8 font-display text-[7rem] leading-none text-gold-200/[0.055] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative flex flex-wrap items-center gap-4">
                    {/* Nodo del riel */}
                    <span className="relative hidden h-10 w-10 shrink-0 place-items-center lg:absolute lg:-left-16 lg:top-8 lg:grid">
                      <span className="absolute inset-0 rounded-full border border-gold-300/30 bg-ink-900" />
                      <span className="h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_14px_3px_rgba(214,174,106,0.45)]" />
                    </span>

                    <span className="font-mono text-[0.75rem] uppercase tracking-[0.26em] text-gold-400/80">
                      {d.tag}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-gold-200/12" />
                  </div>

                  <div className="relative mt-5 grid gap-6 lg:grid-cols-[0.44fr_0.56fr] lg:gap-10">
                    <h3 className="text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.06] text-bone-50">
                      {d.t}
                    </h3>
                    <div className="flex flex-col gap-5">
                      <p className="max-w-[52ch] text-[0.96rem] leading-relaxed text-bone-300/85">{d.d}</p>
                      <ul className="flex flex-wrap gap-2">
                        {d.k.map((k) => (
                          <li
                            key={k}
                            className="rounded-full border border-gold-200/16 bg-gold-200/[0.06] px-3.5 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-gold-100/75"
                          >
                            {k}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Tres pilares */}
        <motion.div
          variants={stagger(0.05, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.n}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
              }}
              className={cn(
                'glass relative overflow-hidden rounded-[1.5rem] p-7',
                'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5',
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle,rgba(214,174,106,0.32),transparent 70%)' }}
              />
              <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">{p.n}</span>
              <h3 className="mt-5 text-[1.32rem] leading-tight text-bone-50">{p.title}</h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-bone-400">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}