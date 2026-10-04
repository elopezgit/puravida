/**
 * Auditoría de contraste WCAG sobre la paleta real de index.css.
 *
 * Calcula el ratio de cada token de texto contra los fondos que realmente se
 * usan (tinta, tinta con el velo del glass encima, y el degradado del hero).
 * Marca lo que no llega al mínimo de AA.
 *
 * Uso: node scripts/check-contrast.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CSS = path.resolve(fileURLToPath(new URL('../src/styles/index.css', import.meta.url)))

const css = fs.readFileSync(CSS, 'utf8')

const tokens = {}
for (const m of css.matchAll(/--color-([a-z]+-\d+):\s*(#[0-9a-f]{6})\s*;/gi)) {
  tokens[m[1]] = m[2]
}

/* ---- conversion WCAG ---- */
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const channel = (v) => {
  const s = v / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/* El color del glass: blanco (bone-50) al 6% sobre la tinta. */
const overlay = (hex, alpha) => {
  const fg = hexToRgb(hex)
  const bg = hexToRgb(tokens['ink-950'])
  const mix = fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)))
  return '#' + mix.map((c) => c.toString(16).padStart(2, '0')).join('')
}

const GLASS = overlay(tokens['bone-50'], 0.06)

const BACKGROUNDS = [
  { name: 'ink-950 (fondo de pagina)', hex: tokens['ink-950'] },
  { name: 'ink-900 (superficies)', hex: tokens['ink-900'] },
  { name: 'ink-800 (mas oscuro)', hex: tokens['ink-800'] },
  { name: `glass ${GLASS}`, hex: GLASS },
]

const FOREGROUNDS = [
  'bone-50', 'bone-100', 'bone-200', 'bone-300', 'bone-400', 'bone-500',
  'gold-50', 'gold-100', 'gold-200', 'gold-300', 'gold-400', 'gold-500',
  'clay-300', 'clay-400',
]

const AA_NORMAL = 4.5
const AA_LARGE = 3.0

console.log('Ratio de contraste (WCAG 2.1). AA normal = 4.5 · AA texto grande = 3.0\n')

const fails = []
const header = 'token'.padEnd(11) + BACKGROUNDS.map((b) => b.name.split(' ')[0].padStart(9)).join('')
console.log(header)
console.log('-'.repeat(header.length))

for (const fg of FOREGROUNDS) {
  const hex = tokens[fg]
  if (!hex) continue
  let row = fg.padEnd(11)
  let worst = Infinity
  let worstBg = ''
  for (const bg of BACKGROUNDS) {
    const r = contrast(hex, bg.hex)
    worst = Math.min(worst, r)
    if (r < AA_NORMAL) worstBg = bg.name
    row += r.toFixed(2).padStart(9)
  }
  const flag = worst >= AA_NORMAL ? '  ok ' : worst >= AA_LARGE ? '  !G ' : '  XX '
  console.log(row + flag + worst.toFixed(2))
  if (worst < AA_NORMAL) fails.push({ fg, worst, worstBg })
}

console.log('\n--- Legendas ---')
for (const fg of FOREGROUNDS) {
  const hex = tokens[fg]
  if (!hex) continue
  const worst = Math.min(...BACKGROUNDS.map((b) => contrast(hex, b.hex)))
  if (worst < AA_NORMAL)
    console.log(
      `${fg} (${hex}) → ${worst.toFixed(2)}:1  ${worst < AA_LARGE ? 'NO LLEGA ni para texto grande' : 'solo sirve en texto grande'}`,
    )
}

console.log(`\n${fails.length} token(s) por debajo de AA.\n`)