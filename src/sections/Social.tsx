import { BRAND } from '@/lib/site'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/Atmosphere'

/** Piezas reales publicadas por la marca. */
const POSTS = [
  { src: '/media/social/post-ashwagandha.webp', cap: 'Ashwagandha · el eje hormonal' },
  { src: '/media/social/post-rhodiola-cordyceps.webp', cap: 'Rhodiola + Cordyceps · el dúo' },
  { src: '/media/social/post-reishi.webp', cap: 'Reishi · calma y longevidad' },
  { src: '/media/social/post-ashwagandha-b.webp', cap: 'Ashwagandha · para qué sirve' },
  { src: '/media/social/post-ashwagandha-c.webp', cap: 'Ashwagandha · el eje del cuerpo' },
]

export function Social() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">07</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">Desde el feed</span>
              </div>
            </Reveal>
            <h2 className="mt-6 text-[clamp(1.8rem,4.4vw,3rem)] leading-[1.02] font-light text-bone-50">
              <SplitText text="Lo que última" className="block" />
              <SplitText text="sabés de cada" className="block" />
              <SplitText text="hongo." className="block text-gold-gradient" delay={0.12} />
            </h2>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-[36ch] text-[0.96rem] leading-relaxed text-bone-400">
                Cada etiqueta, cada origen y cada uso explicado como lo entendemos: sin exagerar
                nada y sin esconderse.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <a
                href={`https://instagram.com/${BRAND.handle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-8 inline-flex items-center gap-3.5 rounded-full border border-gold-200/15 bg-white/[0.02] py-1.5 pr-5 pl-1.5 backdrop-blur-md transition-colors duration-500 hover:border-gold-300/35"
              >
                <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-ink-900 ring-1 ring-gold-200/20">
                  <img
                    src="/media/social/avatar.webp"
                    alt={`Avatar de ${BRAND.handle}`}
                    loading="lazy"
                    className="size-full scale-105 object-cover transition-transform duration-700 group-hover:scale-125"
                  />
                </span>
                <span className="font-mono text-[0.78rem] uppercase tracking-[0.22em] text-bone-200 transition-colors duration-500 group-hover:text-gold-100">
                  {BRAND.handle}
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {POSTS.map((p, i) => (
                <a
                  key={p.src}
                  href="https://instagram.com/hongospuravida"
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`group glass overflow-hidden rounded-2xl p-1.5 ${
                    i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl bg-ink-950">
                    <img
                      src={p.src}
                      alt={p.cap}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent opacity-0 transition-opacity duration-600 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 font-mono text-[0.75rem] uppercase leading-tight tracking-[0.14em] text-gold-100 opacity-0 transition-all duration-600 group-hover:translate-y-0 group-hover:opacity-100">
                      {p.cap}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Tira de nombres de hongos */}
      <div className="mt-20 border-y border-gold-200/10 py-5">
        <Marquee duration={46} reverse>
          {[
            'REISHI', 'CORDYCEPS', 'MELENA DE LEÓN', 'ASHWAGANDHA', 'RHODIOLA', 'TREMELLA',
            'MAITAKE', 'SHIITAKE', 'COLA DE PAVO', 'CHAMPIÑÓN DEL SOL',
          ].map((h) => (
            <span key={h} className="flex shrink-0 items-center gap-8 px-8">
              <span className="font-display text-[1.05rem] tracking-[0.06em] whitespace-nowrap text-bone-300/70">
                {h}
              </span>
              <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold-400/50" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}