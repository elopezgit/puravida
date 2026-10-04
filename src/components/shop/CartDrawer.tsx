import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { cn, money } from '@/lib/utils'
import { EASE, spring } from '@/lib/motion'
import { useBodyLock, useDismiss, useMediaQuery } from '@/lib/hooks'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/Primitives'
import { CONTACTS } from '@/lib/site'

/**
 * Carrito. No procesa pagos: arma el pedido y se va al WhatsApp elegido.
 * Es exactamente el flujo real del negocio, asi que el sitio "anda de verdad".
 */
export function CartDrawer() {
  const { open, show, detailed, subtotal, setQty, remove, checkoutUrl, count } = useCart()
  const [who, setWho] = useState<0 | 1 | 2>(0)
  const [note, setNote] = useState('')
  const lateral = useMediaQuery('(min-width: 640px)')
  useBodyLock(open)
  useDismiss(open, () => show(false))

  /*
   * En el celu el pedido entra como hoja desde abajo y no como panel lateral:
   * el pulgar llega al borde inferior y el pulgar queda sobre las acciones de
   *checkout, sin tapar la pantalla con una columna de 440px.
   */
  const panel = lateral
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  const envio = subtotal >= 45000 ? 0 : 3500
  const total = subtotal + envio
  const falta = Math.max(0, 45000 - subtotal)

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[160]" role="dialog" aria-modal="true" aria-label="Tu pedido">
          <motion.button
            type="button"
            aria-label="Cerrar pedido"
            onClick={() => show(false)}
            className="absolute inset-0 bg-ink-950/82 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          />

          <motion.aside
            initial={panel.initial}
            animate={panel.animate}
            exit={panel.exit}
            transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
            className="glass-strong absolute flex flex-col sm:inset-y-0 sm:right-0 sm:w-full sm:max-w-[440px] sm:rounded-none bottom-0 left-0 max-h-[90svh] w-full rounded-t-[1.75rem]"
          >
            {/* Tirador: senal de que la hoja se arrastra, tipico del celular. */}
            <span
              aria-hidden
              className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-gold-200/25 sm:hidden"
            />
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gold-200/12 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-300/30 text-gold-300">
                  <ShoppingBag size={15} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="font-display text-[1.15rem] leading-none text-bone-50">Tu pedido</h2>
                  <p className="mt-1 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => show(false)}
                aria-label="Cerrar"
                className="grid h-11 w-11 place-items-center rounded-full border border-gold-200/18 text-bone-300 transition-colors hover:border-gold-300/55 hover:text-gold-100"
              >
                <X size={15} strokeWidth={1.6} />
              </button>
            </header>

            {/* Líneas */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
              {detailed.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-200/18 text-gold-300/85">
                    <ShoppingBag size={22} strokeWidth={1.2} />
                  </span>
                  <p className="font-display text-[1.2rem] text-bone-100">Tu pedido está vacío</p>
                  <p className="max-w-[30ch] text-[0.88rem] text-bone-500">
                    Elegí un elixir y te lo preparamos acá.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => show(false)}>
                    Ver el catálogo
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {detailed.map(({ product, qty }) => (
                      <motion.li
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, x: 26, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={spring}
                        className="overflow-hidden"
                      >
                        <div className="glass flex gap-3.5 rounded-2xl p-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-24 w-[74px] shrink-0 rounded-xl object-cover"
                            loading="lazy"
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate font-display text-[0.98rem] text-bone-50">
                                  {product.name}
                                </p>
                                <p className="mt-0.5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-bone-500">
                                  {money(product.price)} c/u
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(product.slug)}
                                aria-label={`Quitar ${product.name}`}
                                className="-m-2.5 grid h-11 w-11 shrink-0 place-items-center rounded-full text-bone-600 transition-colors hover:bg-gold-200/10 hover:text-clay-300"
                              >
                                <Trash2 size={15} strokeWidth={1.5} />
                              </button>
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                              <div className="flex items-center gap-0.5 rounded-full border border-gold-200/18 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setQty(product.slug, qty - 1)}
                                  aria-label="Restar"
                                  className="grid h-11 w-11 place-items-center rounded-full text-bone-200 transition-colors hover:bg-gold-200/12 active:scale-90"
                                >
                                  <Minus size={13} strokeWidth={2} />
                                </button>
                                <span className="w-7 text-center font-mono text-[0.85rem] tabular-nums text-bone-50">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQty(product.slug, qty + 1)}
                                  aria-label="Sumar"
                                  className="grid h-11 w-11 place-items-center rounded-full text-bone-200 transition-colors hover:bg-gold-200/12 active:scale-90"
                                >
                                  <Plus size={13} strokeWidth={2} />
                                </button>
                              </div>
                              <span className="font-display text-[1.02rem] text-gold-100">
                                {money(product.price * qty)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Pie. El padding de abajo respeta la barra de inicio del iPhone. */}
            {detailed.length > 0 && (
              <footer className="shrink-0 border-t border-gold-200/12 px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-5">
                <label className="block">
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
                    ¿Dónde estás? (opcional)
                  </span>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ej. San Miguel de Tucumán"
                    className="mt-2 h-11 w-full rounded-full border border-gold-200/14 bg-ink-900/50 px-4 text-[0.88rem] text-bone-100 placeholder:text-bone-600 outline-none transition-colors focus:border-gold-300/50"
                  />
                </label>

                <dl className="mt-5 space-y-2 text-[0.85rem]">
                  <div className="flex items-center justify-between text-bone-400">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{money(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between text-bone-400">
                    <dt>Envío estimado</dt>
                    <dd className="tabular-nums">
                      {envio === 0 ? <span className="text-gold-200">Sin cargo</span> : money(envio)}
                    </dd>
                  </div>
                  {falta > 0 && (
                    <p className="rounded-xl border border-gold-200/14 bg-gold-200/[0.05] px-3.5 py-2.5 text-[0.78rem] leading-snug text-gold-100/85">
                      Te faltan {money(falta)} para que el envío no te tenga costo.
                    </p>
                  )}
                  <div className="flex items-end justify-between border-t border-gold-200/12 pt-3">
                    <dt className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
                      Total estimado
                    </dt>
                    <dd className="font-display text-[1.6rem] leading-none text-gold-100 tabular-nums">
                      {money(total)}
                    </dd>
                  </div>
                </dl>

                {/* Canal */}
                <div className="mt-5">
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
                    ¿A quién le escribimos?
                  </span>
                  <div className="mt-2 flex gap-1.5">
                    {CONTACTS.map((c, i) => (
                      <button
                        key={c.region}
                        type="button"
                        onClick={() => setWho(i as 0 | 1 | 2)}
                        className={cn(
                          'flex-1 rounded-full border px-2 py-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] transition-all duration-400',
                          who === i
                            ? 'border-gold-300/60 bg-gold-300/12 text-gold-100'
                            : 'border-gold-200/14 text-bone-500 hover:border-gold-200/30 hover:text-bone-300',
                        )}
                      >
                        {c.region}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href={checkoutUrl(CONTACTS[who], note ? `Soy de ${note}.` : '')}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => show(false)}
                  className="group/btn relative mt-5 flex h-13 w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-gold-100 via-gold-300 to-gold-400 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-ink-950 transition-transform duration-500 active:scale-[0.98]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-[120%]"
                  />
                  <span className="relative z-10">Confirmar por WhatsApp</span>
                </a>

                <p className="mt-3 text-center font-mono text-[0.75rem] uppercase tracking-[0.16em] text-bone-600">
                  Te respondemos con stock y envío real
                </p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}