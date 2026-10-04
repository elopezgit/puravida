import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Banknote, Clock, MapPin, PackageCheck } from 'lucide-react'
import { CONTACTS, PROVINCES } from '@/lib/site'
import { EASE } from '@/lib/motion'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Primitives'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    i: PackageCheck,
    t: 'Armás tu pedido acá',
    d: 'Agregás lo que necesitás y el total se calcula solo. No hace falta que te registres.',
  },
  {
    i: MessageCircleIcon,
    t: 'Lo confirmás por WhatsApp',
    d: 'Te respondemos stock real, costo de envío y forma de pago. Efectivo o transferencia.',
  },
  {
    i: Banknote,
    t: 'Pagás como te quede cómodo',
    d: 'Te pasamos el link o coordinamos en persona si estás cerca de Tucumán.',
  },
  {
    i: Clock,
    t: 'Lo recibís en tu casa',
    d: 'Despachamos a todo el país. Varias zonas del NOA llegan en 24 horas.',
  },
]

function MessageCircleIcon({ size, strokeWidth }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size ?? 20} height={size ?? 20} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth ?? 1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.5-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
    </svg>
  )
}

export function Shipping() {
  const [region, setRegion] = useState(0)
  const contact = CONTACTS[region]

  return (
    <section
      id="envios"
      className="relative overflow-hidden border-t border-gold-200/10 py-24 sm:py-32"
    >
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.44fr_0.56fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">08</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">Cómo comprar</span>
              </div>
            </Reveal>
            <h2 className="mt-6 text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.01] font-light text-bone-50">
              <SplitText text="Del frasco" className="block" />
              <SplitText text="a tu puerta," className="block" />
              <SplitText text="sin salir de casa." className="block text-gold-gradient" delay={0.12} />
            </h2>

            <ol className="mt-10 flex flex-col gap-5">
              {STEPS.map((s, i) => (
                <Reveal key={s.t} delay={i * 0.06}>
                  <li className="group flex gap-4">
                    <span className="relative mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-300/25 text-gold-200 transition-colors duration-500 group-hover:border-gold-300/60">
                      <s.i size={15} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[0.98rem] leading-tight text-bone-50">{s.t}</p>
                      <p className="mt-1.5 max-w-[44ch] text-[0.89rem] leading-relaxed text-bone-400">
                        {s.d}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Panel de contacto */}
          <Reveal delay={0.1}>
            <div className="glass sticky top-32 overflow-hidden rounded-[1.75rem] p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-300/30 text-gold-300">
                  <MapPin size={16} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display text-[1.2rem] leading-none text-bone-50">
                    Escribinos directo
                  </p>
                  <p className="mt-1.5 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
                    Respondemos en el día
                  </p>
                </div>
              </div>

              {/* Selector de zona */}
              <div className="mt-7 flex gap-1.5">
                {CONTACTS.map((c, i) => (
                  <button
                    key={c.region}
                    type="button"
                    onClick={() => setRegion(i)}
                    className={cn(
                      'relative flex-1 overflow-hidden rounded-full border px-3 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.16em] transition-all duration-500',
                      region === i
                        ? 'border-gold-300/60 text-ink-950'
                        : 'border-gold-200/14 text-bone-400 hover:border-gold-200/35 hover:text-bone-100',
                    )}
                  >
                    {region === i && (
                      <motion.span
                        layoutId="zone-pill"
                        className="absolute inset-0 bg-gradient-to-b from-gold-100 to-gold-400"
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{c.region}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={contact.region}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-6"
                >
                  <p className="font-display text-[clamp(1.4rem,3.4vw,1.9rem)] leading-none text-gold-100">
                    {contact.phone}
                  </p>
                  <p className="mt-2 text-[0.86rem] text-bone-500">
                    {contact.region} · atendemos consultas de stock, envío y forma de pago.
                  </p>
                </motion.div>
              </AnimatePresence>

              <Button
                className="mt-7 w-full"
                size="lg"
                href={contact.href}
                target="_blank"
              >
                Abrir WhatsApp
              </Button>

              {/* Provincias */}
              <div className="mt-8 border-t border-gold-200/12 pt-6">
                <p className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
                  Llegamos a
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {PROVINCES.filter((p, i, a) => a.indexOf(p) === i).map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-gold-200/12 bg-ink-900/40 px-2.5 py-1 text-[0.75rem] text-bone-400"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}