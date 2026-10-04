import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Send } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { CONTACTS, BRAND } from '@/lib/site'
import { PRODUCTS } from '@/lib/products'
import { scrollTo } from '@/lib/smooth'
import { cn, money } from '@/lib/utils'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Primitives'

import { useCart } from '@/store/cart'

const TRIO = ['cordyceps', 'ashwagandha', 'reishi']

export function Cta() {
  const [name, setName] = useState('')
  const [need, setNeed] = useState('')
  const { count, show } = useCart()

  const msg = `Hola Hongos Pura Vida!${name ? ` Soy ${name}.` : ''}${
    need ? ` ${need}` : ''
  }${count > 0 ? `\n\nYa armé un pedido en la web con ${count} producto(s).` : ''} Me asesoras?`

  const trio = TRIO.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean)

  return (
    <section id="contacto" className="relative overflow-hidden py-24 sm:py-32">
      {/* Fondo con frasco */}
      <div className="container-x relative">
        <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[10%] -top-[30%] h-[70vmax] w-[70vmax] rounded-full opacity-45 blur-[110px]"
            style={{
              background:
                'radial-gradient(circle,rgba(214,174,106,0.32),rgba(165,126,94,0.12) 45%,transparent 70%)',
            }}
          />
          <div className="grain absolute inset-0" style={{ opacity: 0.14 }} />

          <div className="relative grid gap-14 lg:grid-cols-[0.58fr_0.42fr] lg:gap-16">
            {/* Lado de texto */}
            <div className="flex flex-col justify-center">
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">10</span>
                  <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                  <span className="eyebrow">Hablemos</span>
                </div>
              </Reveal>

              <h2 className="mt-6 text-[clamp(2.1rem,6vw,4.4rem)] leading-[0.95] font-light text-bone-50">
                <SplitText text="Contanos qué" className="block" />
                <SplitText text="te está pasando." className="block text-gold-gradient" delay={0.08} />
              </h2>

              <Reveal delay={0.16}>
                <p className="mt-6 max-w-[46ch] text-[1rem] leading-relaxed text-bone-300">
                  Escribinos y te decimos qué sumar, en qué horario y cómo tomarlo. Sin venderte de
                  más: si lo que necesitás no lo tenemos, te lo decimos.
                </p>
              </Reveal>

              {/* Formulario que arma el mensaje */}
              <Reveal delay={0.24}>
                <form
                  className="mt-9 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    window.open(
                      `${CONTACTS[0].href}?text=${encodeURIComponent(msg)}`,
                      '_blank',
                      'noreferrer',
                    )
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      aria-label="Tu nombre"
                      className="h-13 flex-1 rounded-full border border-gold-200/16 bg-ink-900/50 px-5 py-3.5 text-[0.9rem] text-bone-100 placeholder:text-bone-600 outline-none transition-colors duration-400 focus:border-gold-300/55"
                    />
                    <input
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                      placeholder="Qué te pasa (ej: no duermo bien)"
                      aria-label="Qué te pasa"
                      className="h-13 flex-[1.6] rounded-full border border-gold-200/16 bg-ink-900/50 px-5 py-3.5 text-[0.9rem] text-bone-100 placeholder:text-bone-600 outline-none transition-colors duration-400 focus:border-gold-300/55"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" size="lg">
                      <Send size={14} strokeWidth={1.7} />
                      Enviar por WhatsApp
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => (count > 0 ? show(true) : scrollTo('#catalogo'))}
                    >
                      {count > 0 ? `Ver mi pedido (${count})` : 'Ver el catálogo'}
                      <ArrowUpRight size={14} strokeWidth={1.7} />
                    </Button>
                  </div>
                </form>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {CONTACTS.map((c) => (
                    <a
                      key={c.region}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-bone-500 transition-colors hover:text-gold-200"
                    >
                      <span className="h-1 w-1 rounded-full bg-gold-400/60 transition-transform duration-500 group-hover:scale-150" />
                      {c.region} · {c.phone}
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Trío de frascos */}
            <div className="relative grid grid-cols-3 gap-3 self-center lg:gap-4">
              {trio.map((p, i) => (
                <motion.button
                  key={p.slug}
                  type="button"
                  onClick={() => scrollTo('#catalogo')}
                  initial={{ opacity: 0, y: 50, rotate: i === 1 ? 0 : i === 0 ? -6 : 6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i === 1 ? 0 : i === 0 ? -4 : 4 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
                  className={cn(
                    'group glass relative overflow-hidden rounded-2xl p-2 transition-transform duration-700 hover:-translate-y-2',
                  )}
                >
                  <div className="overflow-hidden rounded-xl bg-ink-950">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-[533/800] w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="px-1 pb-1 pt-2.5">
                    <p className="truncate font-display text-[0.82rem] leading-tight text-bone-50">
                      {p.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.75rem] tracking-[0.1em] text-gold-300/80">
                      {money(p.price)}
                    </p>
                  </div>
                </motion.button>
              ))}

              <p className="col-span-3 mt-2 text-center font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.18em] text-bone-600">
                {BRAND.format} · {BRAND.origin} · envíos a todo el país
              </p>
            </div>
          </div>
        </div>
      </div>

      </section>
  )
}