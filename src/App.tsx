import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'

import { Preloader } from '@/components/layout/Preloader'
import { Nav } from '@/components/layout/Nav'
import { Toasts } from '@/components/layout/Toasts'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { Film } from '@/components/ui/Atmosphere'

import { Hero } from '@/sections/Hero'
import { Promises } from '@/sections/Promises'
import { Manifesto } from '@/sections/Manifesto'
import { Method } from '@/sections/Method'
import { Catalog } from '@/sections/Catalog'
import { Finder } from '@/sections/Finder'
import { Ritual } from '@/sections/Ritual'
import { Testimonials } from '@/sections/Testimonials'
import { Social } from '@/sections/Social'
import { Shipping } from '@/sections/Shipping'
import { Faq } from '@/sections/Faq'
import { Cta } from '@/sections/Cta'
import { Footer } from '@/sections/Footer'

import { CartProvider } from '@/store/cart'
import { initSmoothScroll, destroySmoothScroll } from '@/lib/smooth'
import { EASE } from '@/lib/motion'
import { CONTACTS } from '@/lib/site'

export default function App() {
  const [loading, setLoading] = useState(true)

  const boot = useCallback(() => setLoading(false), [])

  useEffect(() => {
    initSmoothScroll()
    return () => destroySmoothScroll()
  }, [])

  return (
    <CartProvider>
      {/* Fondo base: nunca flash blanco al cargar */}
      <div className="fixed inset-0 -z-50 bg-ink-950" aria-hidden />

      <Preloader onDone={boot} />
      <Film />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Nav />
            <main>
              <Hero />
              <Promises />
              <Manifesto />
              <Method />
              <Catalog />
              <Finder />
              <Ritual />
              <Testimonials />
              <Social />
              <Shipping />
              <Faq />
              <Cta />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <Toasts />
      <WhatsAppFab />
    </CartProvider>
  )
}

/**
 * Boton flotante de WhatsApp, solo en celular.
 *
 * Vive aca y no dentro de una seccion a proposito: un `fixed` anidado debajo de
 * un elemento que anima puede quedar contenido por ese ancestro (cualquier
 * `transform`, `filter` o `will-change` lo convierte en marco de referencia) y
 * en vez de flotar se va con el scroll.
 */
function WhatsAppFab() {
  return (
    <a
      href={CONTACTS[0].href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Hablar por WhatsApp"
      className="fixed right-4 z-[100] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-gold-100 to-gold-400 text-ink-950 shadow-[0_18px_44px_-14px_rgba(214,174,106,0.85)] sm:hidden"
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
    >
      <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full bg-gold-300/45" />
      <MessageCircle size={22} strokeWidth={1.7} className="relative" />
    </a>
  )
}