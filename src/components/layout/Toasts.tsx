import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { useCart } from '@/store/cart'
import { EASE, spring } from '@/lib/motion'

/** Aviso flotante al agregar un producto. Confirma sin robar atención. */
export function Toasts() {
  const { toasts } = useCart()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[170] flex flex-col items-center gap-2.5 px-4">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 26, scale: 0.94, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, scale: 0.96, filter: 'blur(4px)' }}
            transition={spring}
            className="glass-strong pointer-events-auto flex items-center gap-3.5 rounded-2xl py-2.5 pl-2.5 pr-5"
          >
            {t.image ? (
              <img
                src={t.image}
                alt=""
                className="h-11 w-9 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold-300/30 text-gold-300">
                <Check size={15} strokeWidth={1.8} />
              </span>
            )}
            <div className="flex flex-col">
              <span className="text-[0.86rem] leading-tight text-bone-50">{t.title}</span>
              {t.note && (
                <span className="mt-0.5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-bone-500">
                  {t.note}
                </span>
              )}
            </div>
            <motion.span
              aria-hidden
              className="ml-1 h-8 w-px overflow-hidden bg-gold-300/15"
              initial={{ opacity: 1 }}
            >
              <motion.span
                className="block h-full w-full bg-gradient-to-b from-gold-200 to-gold-500"
                initial={{ y: '-100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 3.2, ease: EASE }}
              />
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}