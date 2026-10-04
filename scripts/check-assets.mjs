/**
 * Auditoría de assets: qué archivo de `public/` se usa y cuál no.
 *
 * `public/` se copia tal cual a `dist/`, así que un archivo sin usar no es
 * "inocuo": suma bytes a cada deploy y engaña a quien lea el código buscando
 * por qué existe.
 *
 * Recorre los módulos, el HTML y el CSS, junta todas las rutas públicas
 * mencionadas y compara contra lo que hay en disco.
 *
 * Uso: node scripts/check-assets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))

const walk = (dir, out = [], filter = () => true) => {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out, filter)
    else if (filter(full)) out.push(full)
  }
  return out
}

const isSource = (f) => /\.(tsx|ts|css|html|md)$/.test(f)
const isPublic = (f) => /\.(webp|png|jpe?g|svg|mp4|webm|avif|ico|woff2?)$/i.test(f)

/* Todo lo que el código menciona como ruta pública. */
const sources = [
  ...walk(path.join(ROOT, 'src')),
  ...walk(ROOT, [], (f) => path.basename(f) === 'index.html'),
]
if (fs.existsSync(path.join(ROOT, 'index.html'))) sources.push(path.join(ROOT, 'index.html'))

/* `site.ts` y compañía arman URLs con template, así que también se buscan
   los nombres de archivo sueltos por si aparecen sueltos. */
const referenced = new Set()
for (const file of sources) {
  const text = fs.readFileSync(file, 'utf8')
  for (const m of text.matchAll(/["'`(](\/[^"'`)\s]*?\.(?:webp|png|jpe?g|svg|mp4|webm|avif|ico|woff2?))/gi)) {
    referenced.add(m[1].replace(/^\//, ''))
  }
  for (const m of text.matchAll(/["'`]([a-z0-9-]+\.(?:webp|png|jpe?g|svg|mp4|webm|avif))["'`]/gi)) {
    referenced.add(m[1])
  }
}

/* Rutas declaradas en el HTML que no pasan por `/media`. */
const publicFiles = walk(path.join(ROOT, 'public'), [], isPublic)

const orphans = publicFiles.filter((f) => {
  const rel = path.relative(path.join(ROOT, 'public'), f).replace(/\\/g, '/')
  if (referenced.has(rel)) return false
  return !referenced.has(path.basename(rel))
})

const missing = [...referenced].filter((rel) => {
  const direct = path.join(ROOT, 'public', rel)
  return !fs.existsSync(direct)
})

console.log('Assets públicos\n')
console.log(`  ${publicFiles.length} archivo(s) en public/`)
console.log(`  ${publicFiles.length - orphans.length} referenciados desde el código`)
console.log(`  ${orphans.length} sin usar`)
console.log(`  ${missing.length} referenciados pero ausentes en disco\n`)

if (orphans.length) {
  console.log('--- Sin usar (no llegan a dist/, se pueden borrar o convertir) ---')
  for (const f of orphans.sort()) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/')
    const kb = (fs.statSync(f).size / 1024).toFixed(1)
    console.log(`  ${kb.padStart(7)} KB  ${rel}`)
  }
  console.log('')
}

if (missing.length) {
  console.log('--- Referenciados pero ausentes (imagen rota en producción) ---')
  for (const m of missing.sort()) console.log(`  ${m}`)
  console.log('')
}

process.exit(missing.length ? 1 : 0)
