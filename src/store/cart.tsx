import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getProduct, type Product } from '@/lib/products'
import { waLink, PRIMARY_CONTACT, type Contact } from '@/lib/site'

export type CartLine = { slug: string; qty: number }

type State = { lines: CartLine[]; open: boolean }

type Action =
  | { type: 'add'; slug: string; qty?: number }
  | { type: 'setQty'; slug: string; qty: number }
  | { type: 'remove'; slug: string }
  | { type: 'clear' }
  | { type: 'open' }
  | { type: 'close' }

const KEY = 'hpv.cart.v1'

const initial: State = { lines: [], open: false }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const qty = a.qty ?? 1
      const found = s.lines.find((l) => l.slug === a.slug)
      const lines = found
        ? s.lines.map((l) => (l.slug === a.slug ? { ...l, qty: Math.min(9, l.qty + qty) } : l))
        : [...s.lines, { slug: a.slug, qty: Math.min(9, qty) }]
      return { ...s, lines }
    }
    case 'setQty': {
      if (a.qty <= 0) return { ...s, lines: s.lines.filter((l) => l.slug !== a.slug) }
      return { ...s, lines: s.lines.map((l) => (l.slug === a.slug ? { ...l, qty: Math.min(9, a.qty) } : l)) }
    }
    case 'remove':
      return { ...s, lines: s.lines.filter((l) => l.slug !== a.slug) }
    case 'clear':
      return { ...s, lines: [] }
    case 'open':
      return { ...s, open: true }
    case 'close':
      return { ...s, open: false }
  }
}

export type Toast = { id: number; title: string; note?: string; image?: string }

type Ctx = {
  lines: CartLine[]
  open: boolean
  count: number
  subtotal: number
  detailed: { product: Product; qty: number }[]
  add: (slug: string, qty?: number) => void
  setQty: (slug: string, qty: number) => void
  remove: (slug: string) => void
  clear: () => void
  show: (open: boolean) => void
  checkoutUrl: (contact?: Contact, note?: string) => string
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id'>) => void
}

const CartCtx = createContext<Ctx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[]
        const clean = parsed.filter((l) => getProduct(l.slug) && l.qty > 0)
        if (clean.length) dispatch({ type: 'clear' })
        clean.forEach((l) => dispatch({ type: 'add', slug: l.slug, qty: l.qty }))
      }
    } catch {
      /* carrito corrupto: arrancamos vacios */
    }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(KEY, JSON.stringify(state.lines))
    } catch {
      /* modo privado */
    }
  }, [state.lines])

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev.slice(-2), { ...t, id }])
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3200)
  }, [])

  const add = useCallback(
    (slug: string, qty = 1) => {
      const p = getProduct(slug)
      dispatch({ type: 'add', slug, qty })
      if (p) pushToast({ title: `${p.name} agregado`, note: 'Te lo confirmamos por WhatsApp', image: p.image })
    },
    [pushToast],
  )

  const detailed = useMemo(
    () =>
      state.lines
        .map((l) => {
          const product = getProduct(l.slug)
          return product ? { product, qty: l.qty } : null
        })
        .filter(Boolean) as { product: Product; qty: number }[],
    [state.lines],
  )

  const subtotal = useMemo(
    () => detailed.reduce((acc, l) => acc + l.product.price * l.qty, 0),
    [detailed],
  )
  const count = useMemo(() => detailed.reduce((a, l) => a + l.qty, 0), [detailed])

  /** Arma el pedido completo como texto y lo manda al WhatsApp elegido. */
  const checkoutUrl = useCallback(
    (contact: Contact = PRIMARY_CONTACT, note = '') => {
      const head = 'Hola Hongos Pura Vida! Quiero armar este pedido:'
      const body = detailed
        .map((l, i) => `${i + 1}. ${l.product.name} x${l.qty} — ${(l.product.price * l.qty).toLocaleString('es-AR')}.-`)
        .join('\n')
      const total = subtotal.toLocaleString('es-AR')
      const tail = `\nTotal estimado: ${total} ARP\n${note ? `\n${note}\n` : ''}\n¿Me confirman disponibilidad y envío?`
      return waLink(`${head}\n${body}${tail}`, contact)
    },
    [detailed, subtotal],
  )

  const value: Ctx = {
    lines: state.lines,
    open: state.open,
    count,
    subtotal,
    detailed,
    add,
    setQty: (slug, qty) => dispatch({ type: 'setQty', slug, qty }),
    remove: (slug) => dispatch({ type: 'remove', slug }),
    clear: () => dispatch({ type: 'clear' }),
    show: (open) => dispatch({ type: open ? 'open' : 'close' }),
    checkoutUrl,
    toasts,
    pushToast,
  }

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error('useCart debe usarse dentro de CartProvider')
  return c
}