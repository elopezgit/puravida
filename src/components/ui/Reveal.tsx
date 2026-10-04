import { motion, type Variants } from 'motion/react'
import { useCallback, useRef, type ElementType, type ReactNode } from 'react'
import { EASE, stagger } from '@/lib/motion'
import { useReducedMotion } from '@/lib/hooks'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  blur?: boolean
  once?: boolean
  as?: ElementType
  amount?: number
}

/**
 * `motion.create` genera un tipo de componente NUEVO en cada llamada, asi que
 * llamarlo dentro del render remontaria el subarbol en cadaActualizacion y la
 * animacion volveria a empezar de cero. Se cachea por etiqueta para que la
 * identidad del componente sea estable entre renders.
 */
const motionTags = new Map<string, ElementType>()

function motionTag(tag: ElementType): ElementType {
  const key = typeof tag === 'string' ? tag : (tag.displayName ?? tag.name ?? 'custom')
  let found = motionTags.get(key)
  if (!found) {
    found = motion.create(tag as ElementType)
    motionTags.set(key, found)
  }
  return found
}

/**
 * Saca el `transform` y el `filter` que motion deja puestos en el elemento.
 *
 * No es cosmetico. Cualquier ancestro con `transform` o `filter` se convierte
 * en marco de referencia de posicionamiento, y eso desactiva de golpe:
 *
 *   - `position: sticky` de los descendientes (la barra de filtros, el panel de
 *     contacto, las columnas laterales),
 *   - `position: fixed` de los descendientes (el boton de WhatsApp flotante).
 *
 * Framer Motion deja `transform: translateY(0px)` y `filter: blur(0px)` inline
 * aunque el estado final sea "no movido": no los saca nunca. Por eso el reveal
 * tiene que limpiarlos a mano cuando termina, si no el layout se porta como si
 * todo el contenido flotara y nada se pueda pegar.
 */
function useReleaseAfterReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const release = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.filter = ''
    el.style.opacity = ''
  }, [])
  return { ref, release }
}

/** Entrada base: sube, se desenfoca y aparece. Sutil, nunca "pop". */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
  once = true,
  as = 'div',
  amount = 0.25,
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motionTag(as)
  const { ref, release } = useReleaseAfterReveal<HTMLElement>()

  if (reduce) return <div className={className}>{children}</div>

  const variants: Variants = {
    hidden: { opacity: 0, y, ...(blur ? { filter: 'blur(7px)' } : {}) },
    show: {
      opacity: 1,
      y: 0,
      ...(blur ? { filter: 'blur(0px)' } : {}),
      transition: { duration: 0.95, ease: EASE, delay },
    },
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      onAnimationComplete={release}
    >
      {children}
    </MotionTag>
  )
}

type SplitProps = {
  text: string
  className?: string
  /** 'lines' corta por palabras respetando saltos; 'chars' letra por letra. */
  mode?: 'words' | 'chars'
  delay?: number
  stagger?: number
  duration?: number
  once?: boolean
  start?: 'top' | 'center'
}

/**
 * Revelado tipografico. Cada palabra (o letra) sube desde una mascara.
 * Es el detalle que mas "hecha a mano" se ve en una pagina cara.
 *
 * El desplazamiento inicial es de 130% y no de 100% a proposito: la mascara
 * lleva un padding para no recortar tildes ni colas, asi que la palabra tiene
 * que arrancar mas abajo del fondo del recorte. Con 100% asomaba por debajo
 * antes de empezar a animarse.
 */
export function SplitText({
  text,
  className,
  mode = 'words',
  delay = 0,
  stagger: gap = 0.028,
  duration = 1.05,
  once = true,
  start = 'top',
}: SplitProps) {
  const reduce = useReducedMotion()
  const units = mode === 'words' ? text.split(/(\s+)/) : Array.from(text)

  if (reduce) return <span className={className}>{text}</span>

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: start === 'center' ? 0.5 : 0.2 }}
      variants={stagger(delay, gap)}
    >
      {units.map((u, i) => {
        if (u.trim() === '') return <span key={i}>{u}</span>
        return (
          <span key={i} className="text-mask">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: '130%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration, ease: EASE } },
              }}
            >
              {u}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

/** Revelado simple sin motions de entrada duplicados. */
export function RevealGroup({
  children,
  className,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const { ref, release } = useReleaseAfterReveal<HTMLDivElement>()

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={stagger(delay, 0.075)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      onAnimationComplete={release}
    >
      {children}
    </motion.div>
  )
}