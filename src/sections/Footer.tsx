import { ArrowUp, Instagram } from 'lucide-react'
import { BRAND, CONTACTS, SOCIALS } from '@/lib/site'
import { scrollTo, scrollToTop } from '@/lib/smooth'
import { Reveal } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/Atmosphere'

const COLS = [
  {
    t: 'Catálogo',
    links: [
      { l: 'Elixires simples', id: 'catalogo' },
      { l: 'Blends', id: 'catalogo' },
      { l: '¿Qué necesito?', id: 'buscador' },
      { l: 'El ritual', id: 'ritual' },
    ],
  },
  {
    t: 'Nosotros',
    links: [
      { l: 'El método', id: 'metodo' },
      { l: 'Manifiesto', id: 'manifiesto' },
      { l: 'Voces', id: 'voces' },
      { l: 'Preguntas', id: 'preguntas' },
    ],
  },
  {
    t: 'Compra',
    links: [
      { l: 'Armar pedido', id: 'catalogo' },
      { l: 'Cómo comprar', id: 'envios' },
      { l: 'Envíos', id: 'envios' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-gold-200/10 bg-ink-950 pt-20">
      <div className="container-x relative">
        <div className="grid gap-12 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Marca */}
          <div>
            <Reveal>
              <p className="max-w-[40ch] text-[0.96rem] leading-relaxed text-bone-400">
                {BRAND.claim}. Elaboramos elixires de hongos medicinales en {BRAND.origin} con
                extracción cíclica y cavitación acústica. Envíos a todo el país.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="glass group inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 transition-colors duration-500 hover:border-gold-300/45"
                  >
                    {s.label === 'Instagram' && <Instagram size={13} strokeWidth={1.6} className="text-gold-300" />}
                    <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-300 transition-colors group-hover:text-gold-100">
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 space-y-2">
                {CONTACTS.map((c) => (
                  <a
                    key={c.region}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-baseline gap-3 text-[0.9rem] text-bone-400 transition-colors hover:text-gold-100"
                  >
                    <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-gold-300/80">
                      {c.region}
                    </span>
                    <span className="h-px w-6 bg-gold-400/30 transition-all duration-500 group-hover:w-12" />
                    <span>{c.phone}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Columnas */}
          <div className="grid gap-8 sm:grid-cols-3">
            {COLS.map((c, k) => (
              <Reveal key={c.t} delay={0.06 * (k + 1)}>
                <div>
                  <p className="font-mono text-[0.75rem] uppercase tracking-[0.24em] text-gold-300/85">
                    {c.t}
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {c.links.map((l) => (
                      <li key={l.l}>
                        <button
                          type="button"
                          onClick={() => scrollTo(`#${l.id}`, -80)}
                          className="group relative text-[0.9rem] text-bone-400 transition-colors duration-400 hover:text-bone-50"
                        >
                          {l.l}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-300 transition-all duration-500 group-hover:w-full"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-gold-200/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.16em] text-bone-600">
            © {year} {BRAND.name} · {BRAND.origin}
          </p>
          <p className="max-w-[52ch] font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.14em] text-bone-600">
            La información de esta web es orientativa y no reemplaza la consulta médica.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Volver arriba"
            className="glass group inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2.5 transition-colors duration-500 hover:border-gold-300/45"
          >
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-400 transition-colors group-hover:text-gold-100">
              Arriba
            </span>
            <ArrowUp
              size={13}
              strokeWidth={1.7}
              className="text-gold-300 transition-transform duration-500 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* Marca gigante */}
      <div className="relative select-none border-t border-gold-200/8">
        <Marquee duration={58} fade>
          <span className="px-8 font-display text-[clamp(3.4rem,12vw,10rem)] leading-none tracking-[-0.03em] text-bone-50/[0.055]">
            HONGOS PURA VIDA
          </span>
        </Marquee>
      </div>
    </footer>
  )
}