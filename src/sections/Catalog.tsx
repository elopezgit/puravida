import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, PRODUCTS, type Category, type Product } from '@/lib/products'
import { cn, money } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductModal } from '@/components/shop/ProductModal'
import { Reveal, SplitText } from '@/components/ui/Reveal'
import { Button, Chip } from '@/components/ui/Primitives'
import { scrollTo } from '@/lib/smooth'
import { CONTACTS } from '@/lib/site'

type Filter = Category | 'all'
type Sort = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'destacados', label: 'Destacados' },
  { id: 'precio-asc', label: 'Menor precio' },
  { id: 'precio-desc', label: 'Mayor precio' },
  { id: 'nombre', label: 'Alfabético' },
]

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export function Catalog() {
  const { add, lines } = useCart()
  const [cat, setCat] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('destacados')
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState<Product | null>(null)

  const qtyOf = useMemo(() => {
    const m: Record<string, number> = {}
    lines.forEach((l) => (m[l.slug] = l.qty))
    return m
  }, [lines])

  const list = useMemo(() => {
    const term = norm(q.trim())
    let out = PRODUCTS.filter((p) => (cat === 'all' ? true : p.category === cat))
    if (term) {
      out = out.filter((p) =>
        norm(
          [p.name, p.short, p.kicker, ...p.highlights, ...p.long].join(' '),
        ).includes(term),
      )
    }
    const sorted = [...out]
    if (sort === 'precio-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'precio-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'nombre') sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    return sorted
  }, [cat, q, sort])

  const total = list.reduce((a, p) => a + p.price, 0)

  return (
    <section id="catalogo" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle,rgba(214,174,106,0.22),transparent 66%)' }}
      />

      <div className="container-x relative">
        {/* Encabezado */}
        <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-gold-300/85">03</span>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-400/70 to-transparent" />
                <span className="eyebrow">Catálogo</span>
              </div>
            </Reveal>
            <h2 className="mt-6 max-w-[14ch] text-[clamp(2rem,5.6vw,4.4rem)] leading-[0.96] font-light text-bone-50">
              <SplitText text="Diez aliados" className="block" />
              <SplitText text="naturales" className="block text-gold-gradient" delay={0.08} />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-[44ch] text-[0.98rem] leading-relaxed text-bone-400 lg:pb-3">
              Elixires simples de un solo hongo y blends formulados para un objetivo puntual. Todos
              de 50 ml, todos con extracción cíclica. Armá tu pedido acá y confirmalo por WhatsApp.
            </p>
          </Reveal>
        </div>

        {/* Barra de control */}
        <Reveal delay={0.06}>
          {/*
          La barra solo se pega en escritorio. En movil es una columna de
          ~170px; pegada tapaba un tercio de la pantalla mientras se recorre
          el catalogo, y ademas se montaba encima de la nav.
        */}
          <div className="glass mt-12 flex flex-col gap-4 rounded-[1.5rem] p-4 lg:sticky lg:top-[86px] lg:z-30 lg:flex-row lg:items-center lg:justify-between">
            {/* Categorías */}
            <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
              {CATEGORIES.map((c) => {
                const n = c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length
                return (
                  <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} title={c.note}>
                    {c.label}
                    <span className="ml-2 opacity-60">{n}</span>
                  </Chip>
                )
              })}
            </div>

            {/* Búsqueda + orden */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-64 lg:flex-none">
                <Search
                  size={14}
                  strokeWidth={1.6}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-500"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setSearching(true)}
                  onBlur={() => setSearching(false)}
                  placeholder="Buscar un hongo…"
                  aria-label="Buscar en el catálogo"
                  className={cn(
                    'h-11 w-full rounded-full border bg-ink-900/50 pl-10 pr-11 text-[0.88rem] text-bone-100 placeholder:text-bone-500 transition-all duration-400 outline-none',
                    searching || q
                      ? 'border-gold-300/50'
                      : 'border-gold-200/14 hover:border-gold-200/28',
                  )}
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-bone-300 transition-colors hover:bg-gold-200/12 hover:text-gold-100"
                  >
                    <X size={14} strokeWidth={1.8} />
                  </button>
                )}
              </div>

              <label className="relative hidden sm:block">
                <span className="sr-only">Ordenar por</span>
                <SlidersHorizontal
                  size={13}
                  strokeWidth={1.6}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bone-500"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-11 cursor-pointer appearance-none rounded-full border border-gold-200/14 bg-ink-900/50 pl-9 pr-8 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-300 outline-none transition-colors hover:border-gold-200/28"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-ink-800 text-bone-100">
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </Reveal>

        {/* Resultado */}
        <div className="mt-5 flex items-center justify-between gap-4 px-1">
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500">
            {list.length} {list.length === 1 ? 'producto' : 'productos'}
            {cat !== 'all' && ` · ${CATEGORIES.find((c) => c.id === cat)?.label}`}
          </p>
          {list.length > 0 && (
            <p className="hidden font-mono text-[0.75rem] uppercase tracking-[0.2em] text-bone-500 sm:block">
              Suma del listado {money(total)}
            </p>
          )}
        </div>

        {/* Grilla */}
        <motion.div
          layout
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard
                key={p.slug}
                product={p}
                index={i}
                qty={qtyOf[p.slug] ?? 0}
                onOpen={setOpen}
                onAdd={add}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Vacío */}
        {list.length === 0 && (
          <div className="glass mt-8 flex flex-col items-center gap-5 rounded-[1.6rem] px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-300/25 text-gold-300">
              <Search size={20} strokeWidth={1.4} />
            </span>
            <div>
              <p className="font-display text-[1.35rem] text-bone-50">No encontramos eso</p>
              <p className="mt-2 max-w-[40ch] text-[0.92rem] text-bone-400">
                Probá con otro nombre —Reishi, Cordyceps, Ashwagandha— o escribinos y te
                orientamos por WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => { setQ(''); setCat('all') }}>
                Ver todo
              </Button>
              <Button
                size="sm"
                href={`${CONTACTS[0].href}?text=${encodeURIComponent('Hola! Busco un hongo para…')}`}
                target="_blank"
              >
                Consultar
              </Button>
            </div>
          </div>
        )}

        {/* Cierre */}
        {list.length > 0 && (
          <Reveal delay={0.05}>
            <div className="glass mt-10 flex flex-col items-center justify-between gap-5 rounded-[1.6rem] p-7 text-center sm:flex-row sm:text-left">
              <div>
                <p className="font-display text-[1.4rem] leading-tight text-bone-50">
                  ¿No sabés cuál te conviene?
                </p>
                <p className="mt-1.5 max-w-[46ch] text-[0.92rem] text-bone-400">
                  Contanos qué te está pasando y te decimos qué sumar y en qué horario. Sin
                  venderte de más.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-center gap-3">
                <Button
                  onClick={() => scrollTo('#buscador')}
                  variant="outline"
                  size="sm"
                >
                  Buscar por necesidad
                </Button>
                <Button size="sm" href={CONTACTS[0].href} target="_blank">
                  Hablar con el equipo
                </Button>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <ProductModal product={open} onClose={() => setOpen(null)} onAdd={add} qty={open ? qtyOf[open.slug] ?? 0 : 0} />
    </section>
  )
}