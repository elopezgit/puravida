import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, Plus } from 'lucide-react'
import { FAQ } from '@/lib/site'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { Button, Glass } from '@/components/ui/Primitives'
import { Aurora } from '@/components/ui/Atmosphere'
import { CONTACTS } from '@/lib/site'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="preguntas"
      className="relative overflow-hidden border-t border-gold-200/10 bg-ink-950/70 py-24 sm:py-32"
    >
      <Aurora opacity={0.35} />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">09</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">Preguntas</span>
              </div>
            </Reveal>
            <h2 className="mt-6 text-[clamp(1.9rem,4.8vw,3.3rem)] leading-[1.01] font-light text-bone-50">
              <SplitText text="Sin letra" className="block" />
              <SplitText text="chica." className="block text-gold-gradient" delay={0.08} />
            </h2>
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-[34ch] text-[0.96rem] leading-relaxed text-bone-400">
                Y si igual te queda una duda, escribinos. Contestamos con criterio y con calma.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Button
                className="mt-8"
                href={`${CONTACTS[0].href}?text=${encodeURIComponent('Hola! Tengo una consulta…')}`}
                target="_blank"
              >
                <MessageCircle size={14} strokeWidth={1.7} />
                Preguntar
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <Glass className="overflow-hidden p-2 sm:p-3">
              <ul>
                {FAQ.map((f, i) => {
                  const on = open === i
                  return (
                    <li key={f.q} className="border-b border-gold-200/10 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setOpen(on ? null : i)}
                        aria-expanded={on}
                        className="group flex w-full items-start gap-4 px-4 py-5 text-left sm:px-6"
                      >
                        <span className="font-mono text-[0.75rem] tracking-[0.24em] text-gold-300/80 sm:pt-1.5">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'flex-1 font-display text-[1.08rem] leading-snug transition-colors duration-400 sm:text-[1.18rem]',
                            on ? 'text-gold-100' : 'text-bone-100 group-hover:text-gold-100',
                          )}
                        >
                          {f.q}
                        </span>
                        <span
                          className={cn(
                            'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-500',
                            on
                              ? 'rotate-45 border-gold-300/60 bg-gold-300/12 text-gold-100'
                              : 'border-gold-200/18 text-bone-500 group-hover:border-gold-200/40',
                          )}
                        >
                          <Plus size={13} strokeWidth={1.8} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-[62ch] px-4 pb-6 pl-[3.1rem] text-[0.93rem] leading-relaxed text-bone-400 sm:px-6 sm:pl-[4.4rem]">
                              {f.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </Glass>
          </Reveal>
        </div>
      </div>
    </section>
  )
}