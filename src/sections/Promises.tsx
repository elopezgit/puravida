import { Marquee } from '@/components/ui/Atmosphere'
import { PROMISES } from '@/lib/site'

/**
 * Franja de garantias. Es la unica seccion que se repite sin pedir permiso:
 * el cliente escanea, no lee, asi que tiene que estar a un golpe de vista.
 */
export function Promises() {
  return (
    <section className="relative border-y border-gold-200/10 bg-ink-950/60 py-5 backdrop-blur-sm">
      <Marquee duration={54} fade={false}>
        {PROMISES.map((p, i) => (
          <div key={p.t} className="flex shrink-0 items-center">
            <div className="flex items-center gap-3.5 px-7">
              <span className="font-mono text-[0.75rem] tracking-[0.24em] text-gold-300/80">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-[0.98rem] whitespace-nowrap text-bone-200">{p.t}</span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.16em] whitespace-nowrap text-bone-500">
                {p.d}
              </span>
            </div>
            <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold-400/50" />
          </div>
        ))}
      </Marquee>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent"
      />
    </section>
  )
}