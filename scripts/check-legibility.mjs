/**
 * Auditoría de legibilidad sobre el código real.
 *
 * `check-contrast.mjs` mira los tokens de la paleta. Este mira lo que el
 * navegador realmente pinta: cada `text-<familia>-<número>` que aparece en el
 * código fuente, con su modificador de opacidad ya aplicado.
 *
 * El caso que se escapa del chequeo de tokens es exactamente el que se ve mal:
 * `text-gold-500/60` sobre el glass no es gold-500, es gold-500 al 60%
 * compuesto sobre el fondo. El token pasa 5.10:1 y el texto real queda en 2.5:1.
 * Eso es lo que el usuario no puede leer.
 *
 * Por cada aparición se calcula el color efectivo y su ratio contra los fondos
 * que de verdad se usan en el tema, y se toma el peor. Si el peor no llega a
 * AA, se informa archivo y línea para poder arreglarlo.
 *
 * Uso: node scripts/check-legibility.mjs [--fix-list]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const CSS = path.join(ROOT, 'src', 'styles', 'index.css')

/* ------------------------------------------------------------------ */
/* Paleta                                                              */
/* ------------------------------------------------------------------ */
const css = fs.readFileSync(CSS, 'utf8')
const tokens = {}
for (const m of css.matchAll(/--color-([a-z]+-\d+):\s*(#[0-9a-f]{6})\s*;/gi)) {
  tokens[m[1]] = m[2]
}

/* ------------------------------------------------------------------ */
/* WCAG                                                                */
/* ------------------------------------------------------------------ */
const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const chan = (v) => {
  const s = v / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
const ratio = (fg, bg) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}
/** Compone `fg` sobre `bg` con alfa `alpha` (0..1). */
const over = (fg, bg, alpha) => {
  const f = toRgb(fg)
  const b = toRgb(bg)
  return f.map((c, i) => c * alpha + b[i] * (1 - alpha))
}

/* ------------------------------------------------------------------ */
/* Fondos reales del tema                                              */
/* ------------------------------------------------------------------ */
/*
 * Todos los fondos del tema son oscuros salvo los botones dorados, donde el
 * texto es tinta. Para texto claro, elratio baja cuando el fondo se aclara:
 * el peor caso es la esquina más clara del glass, no la página.
 *
 * `glass` (utils/index.css) arranca en gold-200 al 9%, y encima hay velos
 * `bg-ink-900/55`, `bg-ink-950/70` y degradados `from-ink-950`. Se listan los
 * tres casos: página, cristal y velo oscuro.
 */
const BACKGROUNDS = [
  { name: 'ink-900', hex: tokens['ink-900'] },
  { name: 'ink-950', hex: tokens['ink-950'] },
  /* gold-200 al 9% sobre la página: la esquina más clara del cristal */
  { name: 'glass', hex: '#' + over(tokens['gold-200'], tokens['ink-900'], 0.09).map((c) => Math.round(c).toString(16).padStart(2, '0')).join('') },
  /* velo bone-50 al 6% sobre la página */
  { name: 'veil', hex: '#' + over(tokens['bone-50'], tokens['ink-900'], 0.06).map((c) => Math.round(c).toString(16).padStart(2, '0')).join('') },
]

const AA_NORMAL = 4.5
const AA_LARGE = 3.0

/* ------------------------------------------------------------------ */
/* Recorrido de fuentes                                                 */
/* ------------------------------------------------------------------ */
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(full)
  }
  return out
}

const files = walk(path.join(ROOT, 'src'))

/* Texto oscuro: solo aparece sobre el botón dorado. */
const INVERTED = new Set(['ink-950', 'ink-900', 'ink-850', 'ink-800'])
/* Fondo claro de esa misma variante: el centro del degradado del botón. */
const BUTTON = tokens['gold-300']

const findings = []
const seen = new Map()

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const lines = src.split(/\r?\n/)

  lines.forEach((line, i) => {
    /* text-<familia>-<n> opcionalmente /<alfa> */
    const re = /text-((?:ink|gold|bone|clay)-\d+)(?:\/(\d{1,3}))?(?![0-9a-z-])/g
    for (const m of line.matchAll(re)) {
      const token = m[1]
      const hex = tokens[token]
      if (!hex) continue
      const alpha = m[2] === undefined ? 1 : Number(m[2]) / 100

      /* Tamaño de fuente declarado en la misma línea, si aparece. */
      const rem = line.match(/text-\[([\d.]+)rem\]/)
      const px = rem ? Number(rem[1]) * 16 : null
      /* Texto grande solo con 24px+ (o 18.66px+ en negrita; aquí no se usa). */
      const large = px !== null && px >= 24

      const inverted = INVERTED.has(token)
      const grounds = inverted ? [{ name: 'botón dorado', hex: BUTTON }] : BACKGROUNDS

      let worst = Infinity
      let worstBg = ''
      for (const bg of grounds) {
        const effective = alpha === 1 ? toRgb(hex) : over(hex, bg.hex, alpha)
        const r = ratio(effective, toRgb(bg.hex))
        if (r < worst) {
          worst = r
          worstBg = bg.name
        }
      }

      const need = large ? AA_LARGE : AA_NORMAL
      if (worst < need) {
        const rel = path.relative(ROOT, file).replace(/\\/g, '/')
        findings.push({
          where: `${rel}:${i + 1}`,
          token,
          alpha: m[2] ?? '100',
          px,
          large,
          ratio: worst,
          bg: worstBg,
          need,
          snippet: line.trim().slice(0, 90),
        })
      }

      const key = `${token}/${m[2] ?? '100'}`
      seen.set(key, (seen.get(key) ?? 0) + 1)
    }
  })
}

/* ------------------------------------------------------------------ */
/* Informe                                                             */
/* ------------------------------------------------------------------ */
findings.sort((a, b) => a.ratio - b.ratio)

console.log('Legibilidad real: cada color de texto tal como lo pinta el navegador.')
console.log('AA normal 4.5:1 · AA texto grande 3.0:1 · se evalúa el peor fondo\n')

if (!findings.length) {
  console.log('  Todo el texto del proyecto pasa AA contra todos los fondos del tema.\n')
  process.exit(0)
}

let current = null
for (const f of findings) {
  const head = `${f.token}/${f.alpha}`
  if (head !== current) {
    current = head
    console.log(`\n  ${head}  ${f.ratio.toFixed(2)}:1  (necesita ${f.need})  sobre ${f.bg}`)
    if (f.px !== null) console.log(`     tamaño ${f.px}px`)
  }
  console.log(`     ${f.where}`)
  console.log(`       ${f.snippet}`)
}

const combos = new Set(findings.map((f) => `${f.token}/${f.alpha}`)).size
console.log(
  `\n${findings.length} aparición(es) con contraste insuficiente en ${combos} combinación(es) de color.\n`,
)
process.exit(1)
