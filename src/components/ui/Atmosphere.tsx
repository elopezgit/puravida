import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useCountUp, useInView, useReducedMotion } from '@/lib/hooks'

/* ---------------------------------------------------------------------- */
/*  Marquee infinito con velocidad editable                                */
/* ---------------------------------------------------------------------- */
export function Marquee({
  children,
  duration = 42,
  reverse,
  className,
  pauseOnHover = true,
  fade = true,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
  fade?: boolean
}) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>
  }
  return (
    <div
      className={cn('group relative flex overflow-hidden', fade && 'mask-fade-x', className)}
      onMouseEnter={(e) => {
        if (!pauseOnHover) return
        e.currentTarget.querySelectorAll<HTMLElement>('.animate-marquee').forEach((n) => {
          n.style.animationPlayState = 'paused'
        })
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelectorAll<HTMLElement>('.animate-marquee').forEach((n) => {
          n.style.animationPlayState = 'running'
        })
      }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="animate-marquee flex shrink-0 items-center"
          style={{
            ['--dur' as string]: `${duration}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  Fondo aurora: tres manchas de luz lenta                                */
/* ---------------------------------------------------------------------- */
export function Aurora({ className, opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ opacity }}
    >
      <div
        className="animate-aurora absolute -left-[18%] top-[-14%] h-[62vmax] w-[62vmax] rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(214,174,106,0.26), rgba(214,174,106,0.06) 46%, transparent 70%)',
        }}
      />
      <div
        className="animate-aurora absolute -right-[14%] top-[24%] h-[54vmax] w-[54vmax] rounded-full blur-[100px]"
        style={{
          animationDelay: '-8s',
          background:
            'radial-gradient(circle at 50% 50%, rgba(165,126,94,0.28), rgba(120,88,60,0.06) 48%, transparent 72%)',
        }}
      />
      <div
        className="animate-aurora absolute -bottom-[24%] left-[22%] h-[58vmax] w-[58vmax] rounded-full blur-[110px]"
        style={{
          animationDelay: '-15s',
          background:
            'radial-gradient(circle at 50% 50%, rgba(120,140,110,0.18), rgba(70,90,70,0.05) 48%, transparent 72%)',
        }}
      />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  Grano de pelicula a pantalla completa                                 */
/* ---------------------------------------------------------------------- */
export function Film({ className, opacity = 0.3 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn('grain pointer-events-none fixed inset-0 z-[60]', className)}
      style={{ opacity }}
    />
  )
}

/* ---------------------------------------------------------------------- */
/*  Numero que cuenta solo, cuando entra en pantalla                      */
/* ---------------------------------------------------------------------- */
function CounterInner({
  to,
  suffix,
  duration,
}: {
  to: number
  suffix: string
  duration: number
}) {
  const { ref, seen } = useInView<HTMLSpanElement>()
  const v = useCountUp(to, seen, duration)
  return (
    <span ref={ref}>
      {Math.round(v)}
      {suffix}
    </span>
  )
}

export function Counter({
  to,
  suffix = '',
  duration = 1700,
  className,
}: {
  to: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const id = useId()
  return (
    <span className={cn('tabular-nums', className)} data-counter={id}>
      <CounterInner to={to} suffix={suffix} duration={duration} />
    </span>
  )
}