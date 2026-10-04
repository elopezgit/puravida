import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useIsDesktop } from '@/lib/hooks'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { EASE } from '@/lib/motion'
import { Aurora } from '@/components/ui/Atmosphere'
import { Flourish } from '@/components/ui/Primitives'

/**
 * Manifiesto. Texto corrido que se revela palabra por palabra mientras el
 * fondo se desplaza: el bloque editorial que separa el hero del metodo.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const words = useTransform(scrollYProgress, [0.12, 0.62], [0, 1])
  /* Ver nota en Ritual: el paralaje se apaga en escritorio por el sticky. */
  const wide = useIsDesktop()

  return (
    <section ref={root} id="manifiesto" className="relative overflow-hidden py-28 sm:py-36">
      <Aurora opacity={0.4} className="-inset-x-1/4" />
      <div className="grain absolute inset-0" style={{ opacity: 0.16 }} />

      <motion.div style={wide ? undefined : { y }} className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          {/* Lateral */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">01</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">Manifiesto</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[26ch] text-[0.98rem] leading-relaxed text-bone-400">
                Nacimos en Tucumán con una idea que no se negocia: que los hongos medicinales
                de verdad sean accesibles. No como un lujo, y no como un misterio.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Flourish className="mt-8 lg:mt-10" />
            </Reveal>
          </div>

          {/* Texto principal */}
          <div>
            <h2 className="font-light text-[clamp(1.85rem,4.6vw,3.6rem)] leading-[1.06] tracking-[-0.03em] text-bone-50">
              <SplitText
                text="Creemos que el bienestar es para todos. Por eso elaboramos elixires con tecnología de cavitación acústica: un método que respeta la esencia del hongo, amplifica sus compuestos activos y honra una medicina ancestral."
                className="block"
                delay={0.05}
              />
            </h2>

            <div className="mt-10 grid gap-8 border-t border-gold-200/12 pt-10 sm:grid-cols-2">
              <Reveal delay={0.05}>
                <p className="text-[0.98rem] leading-relaxed text-bone-400">
                  No creemos en la promesa de la cafeína ni en los activadores. Creemos en esto: un
                  cuerpo al que se lo acompaña un poco todos los días termina encontrándose otro.
                  La energía vuelve. El sueño se ordena. La cabeza baja un cambio.
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-[0.98rem] leading-relaxed text-bone-400">
                  Cada frasco sale de nuestra casa con el nombre del lote y la bitácora del ciclo.
                  Si algo no está claro, escribinos y te lo contamos: con calidez y con
                  conocimiento real, como nos gusta.
                </p>
              </Reveal>
            </div>

            {/* Palabras que se encienden al hacer scroll */}
            <motion.div
              style={{ opacity: words }}
              className="mt-14 flex flex-wrap gap-2.5"
            >
              {['SIN CAFEÍNA', 'TRIPLE EXTRACCIÓN', 'ENVÍOS A TODO EL PAÍS', 'ASESORAMIENTO REAL', 'EFECTIVO O TRANSFERENCIA'].map(
                (t) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0.16, filter: 'blur(3px)' }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="rounded-full border border-gold-200/18 bg-gold-200/5 px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.22em] text-gold-100/80"
                  >
                    {t}
                  </motion.span>
                ),
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}