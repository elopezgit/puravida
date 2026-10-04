/**
 * Piso de tamaño de texto: nada por debajo de 12 px.
 *
 * El sitio usa mucho microtexto en mono mayúscula con tracking abierto, y por
 * debajo de 12 px deja de leerse en un celular a plena luz del día. Este script
 * recorre los `.tsx` y el CSS y lista todo `text-[Nrem]` o `text-[Npx]` que
 * quede por debajo del piso, con archivo y línea.
 *
 * No cubre `text-xs` / `text-sm` y otras escalas con nombre: se controlan a
 * mano, porque Tailwind las define y no aparecen como valores arbitrarios.
 *
 * Uso: node scripts/check-text-size.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const FLOOR_PX = 12

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (full.endsWith('.tsx') || full.endsWith('.ts') || full.endsWith('.css')) out.push(full)
  }
  return out
}

const findings = []

for (const file of walk(path.join(ROOT, 'src'))) {
  fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      for (const m of line.matchAll(/text-\[([\d.]+)(rem|px)\]/g)) {
        const px = m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1])
        if (px < FLOOR_PX) {
          findings.push({
            where: `${path.relative(ROOT, file).replace(/\\/g, '/')}:${i + 1}`,
            value: m[0],
            px,
          })
        }
      }
    })
}

console.log(`Piso de tamaño de texto: ${FLOOR_PX}px\n`)

if (!findings.length) {
  console.log('  Ningún texto del proyecto queda por debajo de 12px.\n')
  process.exit(0)
}

for (const f of findings.sort((a, b) => a.px - b.px)) {
  console.log(`  ${f.px.toFixed(2).padStart(6)} px  ${f.value.padEnd(18)} ${f.where}`)
}
console.log(`\n${findings.length} texto(s) por debajo del piso.\n`)
process.exit(1)
