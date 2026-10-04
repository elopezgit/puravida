import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Minus, Plus, ShieldCheck, Truck, X } from 'lucide-react'
import type { Product } from '@/lib/products'
import { discountPct } from '@/lib/products'
import { cn, money } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { useBodyLock, useDismiss } from '@/lib/hooks'
import { Button, Pill } from '@/components/ui/Primitives'

export function ProductModal({
  product,
  onClose,
  onAdd,
  qty,
}: {
  product: Product | null
  onClose: () => void
  onAdd: (slug: string, qty?: number) => void
  qty: number
}) {
  const [n, setN] = useState(1)
  useBodyLock(!!product)
  useDismiss(!!product, onClose)

  useEffect(() => {
    setN(1)
  }, [product?.slug])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/82 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="glass-strong relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[1.75rem] sm:rounded-[1.75rem] lg:flex-row"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle"
              className="absolute right-3 top-3 z-30 grid h-11 w-11 place-items-center rounded-full border border-gold-200/20 bg-ink-950/70 text-bone-200 backdrop-blur-md transition-colors hover:border-gold-300/60 hover:text-gold-100 sm:right-4 sm:top-4"
            >
              <X size={16} strokeWidth={1.6} />
            </button>

            {/* Imagen */}
            <div className="relative w-full shrink-0 lg:w-[46%]">
              <div className="relative h-[240px] overflow-hidden sm:h-[340px] lg:h-full lg:min-h-[600px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-ink-950/20 lg:to-ink-950/85" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(60% 45% at 50% 100%, ${product.glow}30, transparent 70%)`,
                  }}
                />
              </div>
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <Pill>{product.category === 'blend' ? 'Blend' : 'Elixir simple'}</Pill>
                <Pill tone="clay">−{discountPct(product)}%</Pill>
              </div>
            </div>

            {/* Datos */}
            <div className="no-scrollbar flex-1 overflow-y-auto p-6 sm:p-9">
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.24em] text-gold-300/85">
                {product.label}
              </p>
              <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] leading-[0.98] font-light text-bone-50">
                {product.name}
              </h3>
              <p className="mt-3 max-w-[46ch] text-[1rem] leading-relaxed text-gold-100/85">
                {product.short}
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-500 line-through">
                    {money(product.listPrice)}
                  </span>
                  <span className="font-display text-[2.1rem] leading-none text-gold-100">
                    {money(product.price)}
                  </span>
                </div>
                <span className="mb-1.5 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-500">
                  {product.kicker}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold-200/16 bg-gold-200/[0.06] px-3.5 py-1.5 text-[0.78rem] text-bone-300"
                  >
                    <Check size={11} strokeWidth={2} className="text-gold-300" />
                    {h}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4 border-t border-gold-200/12 pt-7">
                {product.long.map((p, i) => (
                  <p key={i} className="max-w-[56ch] text-[0.94rem] leading-relaxed text-bone-300/85">
                    {p}
                  </p>
                ))}
              </div>

              <p className="mt-7 rounded-2xl border border-gold-200/14 bg-gold-200/[0.05] p-4 font-display text-[1.02rem] italic leading-relaxed text-bone-100">
                {product.para}
              </p>

              {/* Compra */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex h-12 items-center gap-1 rounded-full border border-gold-200/20 bg-ink-900/50 px-1.5">
                  <button
                    type="button"
                    onClick={() => setN((v) => Math.max(1, v - 1))}
                    aria-label="Quitar uno"
                    className="grid h-11 w-11 place-items-center rounded-full text-bone-300 transition-colors hover:bg-gold-200/10 hover:text-gold-100"
                  >
                    <Minus size={14} strokeWidth={1.8} />
                  </button>
                  <span className="w-8 text-center font-mono text-[0.9rem] tabular-nums text-bone-50">
                    {n}
                  </span>
                  <button
                    type="button"
                    onClick={() => setN((v) => Math.min(9, v + 1))}
                    aria-label="Agregar uno"
                    className="grid h-11 w-11 place-items-center rounded-full text-bone-300 transition-colors hover:bg-gold-200/10 hover:text-gold-100"
                  >
                    <Plus size={14} strokeWidth={1.8} />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    onAdd(product.slug, n)
                    onClose()
                  }}
                >
                  Agregar al pedido
                  {qty > 0 && (
                    <span className="ml-1 rounded-full bg-ink-950/20 px-2 py-0.5 font-mono text-[0.75rem]">
                      {qty} en el carrito
                    </span>
                  )}
                </Button>
              </div>

              {/* Garantías */}
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { i: Truck, t: 'Envíos a todo el país' },
                  { i: ShieldCheck, t: 'Extracción cíclica' },
                  { i: Check, t: 'Efectivo o transferencia' },
                ].map(({ i: Icon, t }) => (
                  <li
                    key={t}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl border border-gold-200/12 bg-ink-900/40 px-3.5 py-3',
                    )}
                  >
                    <Icon size={14} strokeWidth={1.5} className="shrink-0 text-gold-300" />
                    <span className="text-[0.76rem] leading-tight text-bone-400">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}