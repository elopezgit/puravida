/**
 * Verificación del build de producción servido por `vite preview`.
 *
 * El dev server y el build no se comportan igual: el dev sirve los módulos uno
 * por uno y el build los concatena y calcula nombres con hash. Un asset que
 * funciona en dev puede faltar en `dist/`. Este script pide la home, todos los
 * bundles que la home referencia y todos los assets de `public/media`, y falla
 * si alguno no responde o si la home no trae los bundles.
 *
 * Uso: node scripts/check-build.mjs [url]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const BASE = process.argv[2] ?? 'http://localhost:4173'

const walk = (dir, out = [], filter = () => true) => {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out, filter)
    else if (filter(full)) out.push(full)
  }
  return out
}

/* Todo lo que hay que pedir: los bundles que la home declara y los assets
   públicos que el sitio referencia. */
const isAsset = (f) => /\.(webp|png|jpe?g|svg|mp4|webm|avif|ico)$/i.test(f)

const res = await fetch(BASE + '/').catch(() => null)
if (!res || !res.ok) {
  console.log(`\n[check] No responde ${BASE}. ¿Está corriendo "npm run preview"?\n`)
  process.exit(1)
}
const html = await res.text()

const bundles = [...html.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
if (!bundles.length) {
  console.log(`\n[check] La home de ${BASE} no declara ningún bundle en /assets.\n`)
  process.exit(1)
}

/* Cada asset de `dist/` tiene que estar en la salida y viceversa. */
const distAssets = walk(path.join(ROOT, 'dist'), [], isAsset).map((f) =>
  '/' + path.relative(path.join(ROOT, 'dist'), f).replace(/\\/g, '/'),
)

let bad = 0
const fail = (u, why) => {
  bad++
  console.log(`  FALLA  ${u}  ${why}`)
}

console.log(`\nBuild en ${BASE}\n`)

for (const u of [...new Set([...bundles, ...distAssets])]) {
  try {
    const r = await fetch(BASE + u)
    const type = r.headers.get('content-type') ?? ''
    /* Los bundles se sirven comprimidos y sin `content-length`, así que el
       tamaño se mide sobre el cuerpo, no sobre el header. */
    const body = await r.arrayBuffer()
    if (!r.ok) fail(u, `HTTP ${r.status}`)
    else if (type.includes('text/html')) fail(u, 'cayó al fallback HTML de la SPA')
    else if (body.byteLength === 0) fail(u, 'respuesta vacía')
  } catch (err) {
    fail(u, err.message)
  }
}

console.log(`  ${bundles.length} bundle(s) referenciados por la home`)
console.log(`  ${distAssets.length} asset(s) en dist/`)
console.log(`\n${bundles.length + distAssets.length} comprobaciones · ${bad} fallo(s)\n`)
process.exit(bad ? 1 : 0)
