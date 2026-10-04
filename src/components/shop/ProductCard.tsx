import { memo } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import type { Product } from '@/lib/products'
import { discountPct } from '@/lib/products'
import { cn, money } from '@/lib/utils'
import { EASE } from '@/lib/motion'

type Props = {
  product: Product
  index: number
  onOpen: (p: Product) => void
  onAdd: (slug: string) => void
  qty: number
}

function StockBadge({ stock }: { stock: number }) {
  const low = stock < 60
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.18em] backdrop-blur-md',
        low
          ? 'border-clay-400/35 bg-clay-400/10 text-clay-300'
          : 'border-gold-300/25 bg-ink-900/55 text-gold-200/85',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', low ? 'bg-clay-300' : 'bg-gold-300')} />
      {low ? 'Últimas unidades' : 'En stock'}
    </span>
  )
}

function CardBase({ product, index, onOpen, onAdd, qty }: Props) {
  const off = discountPct(product)

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.75, ease: EASE, delay: Math.min(index * 0.045, 0.4) }}
      layout
    >
      <div className="group glass relative flex h-full flex-col overflow-hidden rounded-[1.6rem] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-gold-200/30 motion-safe:hover:-translate-y-1.5">
        {/* Halo de color propio del hongo */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -bottom-16 top-1/3 opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-75"
          style={{ background: `radial-gradient(60% 60% at 50% 100%, ${product.glow}2e, transparent 72%)` }}
        />

        {/* Imagen */}
        <div className="relative overflow-hidden">
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="relative block w-full"
            aria-label={`Ver detalle de ${product.name}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-950">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />

              {/* Etiqueta de categoría */}
              <span className="absolute left-3.5 top-3.5">
                <StockBadge stock={product.stock} />
              </span>

              <span className="absolute right-3.5 top-3.5 rounded-full border border-gold-300/25 bg-ink-900/60 px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-gold-200/85 backdrop-blur-md">
                −{off}%
              </span>

              {/* Ver detalle */}
              <span className="absolute inset-x-3.5 bottom-3.5 flex translate-y-3 items-center justify-center gap-2 rounded-full border border-gold-200/25 bg-ink-950/70 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-gold-100 opacity-0 backdrop-blur-md transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                Ver detalle
                <ArrowUpRight size={12} strokeWidth={1.8} />
              </span>
            </div>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="relative flex flex-1 flex-col gap-3 p-5 pt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.22em] text-gold-300/85">
              {product.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpen(product)}
            className="text-left"
          >
            <h3 className="text-[1.32rem] leading-tight text-bone-50 transition-colors duration-400 group-hover:text-gold-100">
              {product.name}
            </h3>
          </button>

          <p className="text-[0.88rem] leading-relaxed text-bone-400">{product.short}</p>

          <ul className="mt-1 flex flex-wrap gap-1.5">
            {product.highlights.slice(0, 2).map((h) => (
              <li
                key={h}
                className="rounded-full border border-gold-200/14 bg-gold-200/[0.05] px-2.5 py-1 text-[0.75rem] leading-snug text-bone-300"
              >
                {h}
              </li>
            ))}
          </ul>

          {/* Precio + acción */}
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-gold-200/10 pt-4">
            <div className="flex flex-col">
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-500 line-through">
                {money(product.listPrice)}
              </span>
              <span className="font-display text-[1.35rem] leading-tight text-gold-100">
                {money(product.price)}
              </span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-bone-500">
                {product.kicker}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAdd(product.slug)}
              aria-label={`Agregar ${product.name} al pedido`}
              className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-gold-300/30 text-gold-100 transition-all duration-500 hover:border-gold-200 hover:bg-gold-300 hover:text-ink-950 active:scale-90"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-gold-300 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100" />
              {qty > 0 ? (
                <span className="relative font-mono text-[0.75rem]">{qty}</span>
              ) : (
                <Plus size={16} strokeWidth={1.7} className="relative" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export const ProductCard = memo(CardBase)