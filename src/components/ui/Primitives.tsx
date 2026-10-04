import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ---------------------------------------------------------------------- */
/*  Cristal                                                                */
/* ---------------------------------------------------------------------- */
type GlassProps = {
  children: ReactNode
  className?: string
  strong?: boolean
  /** Halo dorado que sigue al cursor. */
  glow?: boolean
  style?: CSSProperties
  as?: 'div' | 'section' | 'article' | 'aside' | 'li' | 'header' | 'footer'
}

export function Glass({ children, className, strong, glow, style, as = 'div' }: GlassProps) {
  const Tag = as
  return (
    <Tag
      style={style}
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-[var(--radius-glass)] edge-light',
        glow && 'group/glass',
        className,
      )}
    >
      {glow && <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" />}
      {children}
    </Tag>
  )
}

/* ---------------------------------------------------------------------- */
/*  Botones                                                                */
/* ---------------------------------------------------------------------- */
type BtnProps = {
  children: ReactNode
  onClick?: () => void
  href?: string
  target?: string
  className?: string
  variant?: 'gold' | 'ghost' | 'outline' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
}

const SIZES = {
  sm: 'h-9 px-4 text-[0.75rem] tracking-[0.18em]',
  md: 'h-11 px-6 text-[0.75rem] tracking-[0.2em]',
  lg: 'h-14 px-8 text-[0.78rem] tracking-[0.22em]',
} as const

const VARIANTS = {
  gold: 'text-ink-950 bg-gradient-to-b from-gold-100 via-gold-300 to-gold-400 hover:from-gold-50 hover:to-gold-300 border border-gold-200/60 shadow-[0_18px_44px_-18px_rgba(214,174,106,0.75)]',
  dark: 'text-bone-100 bg-ink-800/70 hover:bg-ink-700/70 border border-gold-200/15 backdrop-blur-xl',
  ghost: 'text-bone-200 hover:text-gold-100 border border-transparent hover:border-gold-200/25',
  outline: 'text-gold-100 border border-gold-200/35 hover:bg-gold-200/10 hover:border-gold-200/70',
} as const

export function Button({
  children,
  onClick,
  href,
  target,
  className,
  variant = 'gold',
  size = 'md',
  type = 'button',
  disabled,
  ariaLabel,
}: BtnProps) {
  const cls = cn(
    'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full',
    'font-mono uppercase font-normal whitespace-nowrap',
    'transition-[transform,box-shadow,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
    SIZES[size],
    VARIANTS[variant],
    className,
  )

  const inner = (
    <>
      {/* Barrido de luz al hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-[120%]"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </>
  )

  if (href)
    return (
      <a href={href} target={target} rel={target ? 'noreferrer noopener' : undefined} className={cls} aria-label={ariaLabel}>
        {inner}
      </a>
    )
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  )
}

/* ---------------------------------------------------------------------- */
/*  Etiquetas                                                             */
/* ---------------------------------------------------------------------- */
export function Chip({
  children,
  active,
  onClick,
  className,
  title,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
  title?: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'relative rounded-full px-5 py-2.5 font-mono text-[0.78rem] uppercase tracking-[0.2em] transition-all duration-500',
        active
          ? 'text-ink-950'
          : 'text-bone-300 hover:text-gold-100 border border-transparent hover:border-gold-200/25',
        className,
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-b from-gold-100 to-gold-400 shadow-[0_10px_30px_-12px_rgba(214,174,106,0.8)]"
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function Pill({
  children,
  className,
  tone = 'gold',
}: {
  children: ReactNode
  className?: string
  tone?: 'gold' | 'clay' | 'bone'
}) {
  const tones = {
    gold: 'text-gold-200 border-gold-300/25 bg-gold-300/8',
    clay: 'text-clay-300 border-clay-400/25 bg-clay-400/8',
    bone: 'text-bone-300 border-bone-300/20 bg-bone-100/5',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.22em] backdrop-blur-md',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------------- */
/*  Bloque de encabezado de seccion                                        */
/* ---------------------------------------------------------------------- */
export function SectionHead({
  index,
  kicker,
  title,
  lead,
  align = 'left',
  className,
}: {
  index?: string
  kicker: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn('flex items-center gap-4', align === 'center' && 'justify-center')}>
        {index && (
          <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">{index}</span>
        )}
        <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
        <span className="eyebrow">{kicker}</span>
      </div>
      <h2 className="max-w-[19ch] text-[clamp(2rem,5.2vw,4.1rem)] leading-[0.98] text-bone-50">{title}</h2>
      {lead && (
        <p
          className={cn(
            'max-w-[52ch] text-[0.98rem] leading-relaxed text-bone-400',
            align === 'center' && 'mx-auto',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  Separador ornamental                                                   */
/* ---------------------------------------------------------------------- */
export function Flourish({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/40" />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gold-300/80">
        <path
          d="M12 3c0 5-5 6-5 11a5 5 0 0 0 10 0c0-5-5-6-5-11Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/40" />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  Boton de icono                                                         */
/* ---------------------------------------------------------------------- */
export function IconButton({
  children,
  onClick,
  label,
  className,
  active,
}: {
  children: ReactNode
  onClick?: () => void
  label: string
  className?: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'glass relative grid h-11 w-11 place-items-center rounded-full text-bone-200 transition-all duration-500',
        'hover:border-gold-300/45 hover:text-gold-100 active:scale-95',
        active && 'border-gold-300/50 text-gold-100',
        className,
      )}
    >
      {children}
    </button>
  )
}