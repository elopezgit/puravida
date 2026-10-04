/**
 * Validador de tokens de color.
 *
 * Busca clases del tipo `text-bone-500`, `bg-ink-900`, `border-gold-200/14` y
 * comprueba que el token exista en `@theme`. Tailwind v4 no avisa cuando una
 * clase referencia un token inexistente: simplemente no genera la utilidad y el
 * elemento se queda heredando el color del padre. Es un fallo silencioso que
 * arruina el contraste sin romper el build.
 *
 * Uso: node scripts/check-tokens.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1'), '..')
const SRC = path.join(ROOT, 'src')
const CSS = path.join(SRC, 'styles', 'index.css')

/* Familias de color propias (las que definimos en @theme). */
const FAMILIES = ['ink', 'gold', 'bone', 'clay']

/* Tokens declarados en @theme. */
const css = fs.readFileSync(CSS, 'utf8')
const defined = new Set()
for (const m of css.matchAll(/--color-([a-z]+-\d+)\s*:/g)) defined.add(m[1])

/* Prefijos de utilidad que llevan un token de color. */
const PREFIXES = [
  'text-', 'bg-', 'border-', 'border-t-', 'border-b-', 'border-l-', 'border-r-',
  'border-x-', 'border-y-', 'outline-', 'decoration-', 'fill-', 'stroke-',
  'from-', 'via-', 'to-', 'shadow-', 'accent-', 'caret-', 'ring-',
]

const files = []
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name)
    if (e.isDirectory()) walk(full)
    else if (/\.tsx?$/.test(e.name)) files.push(full)
  }
}
walk(SRC)

const found = new Map()

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, i) => {
    for (const fam of FAMILIES) {
      /* text-bone-500, bg-ink-900/50, border-gold-200/14, text-clay-300 */
      const re = new RegExp(
        '(?:text|bg|border|outline|decoration|fill|stroke|from|via|to|ring|accent|caret)-(' +
          fam +
          '-\\d{2,3})\\b',
        'g',
      )
      for (const m of line.matchAll(re)) {
        const token = m[1]
        if (defined.has(token)) continue
        const key = token
        if (!found.has(key)) found.set(key, [])
        found.get(key).push(path.relative(ROOT, file) + ':' + (i + 1))
      }
    }
  })
}

if (found.size === 0) {
  console.log(`Tokens OK: los ${defined.size} tokens de @theme cubren todas las clases usadas.`)
  process.exit(0)
}

console.log('Clases que referencian tokens inexistentes (NO se generan en el CSS):\n')
for (const [token, where] of [...found].sort()) {
  console.log(`  ${token.padEnd(14)} ${where.length} uso(s)`)
  for (const w of where.slice(0, 8)) console.log(`      ${w}`)
  if (where.length > 8) console.log(`      ... y ${where.length - 8} mas`)
}
console.log(`\n${found.size} token(s) sin definir.`)
process.exit(1)