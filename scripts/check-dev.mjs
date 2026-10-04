/**
 * Verificacion estatica contra el dev server: pide cada modulo y cada asset
 * y falla si alguno no se sirve como JS/CSS/binario (o sea, si cae al
 * fallback HTML de la SPA). Sirve para pillar rutas rotas sin abrir el navegador.
 *
 * Uso: node scripts/check-dev.mjs [url]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const BASE = process.argv[2] ?? 'http://localhost:5173'

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const all = walk(ROOT)

/* Modulos que el navegador pide al dev server */
const modules = all
  .filter((f) => f.includes(`${path.sep}src${path.sep}`) && /\.(tsx?|css)$/.test(f))
  .map((f) => '/' + path.relative(ROOT, f).replace(/\\/g, '/'))

/* Assets publicos referenciados en el codigo */
const refs = new Set()
for (const f of all.filter((f) => /\.(tsx?|html)$/.test(f))) {
  const src = fs.readFileSync(f, 'utf8')
  for (const m of src.matchAll(/["'(](\/media\/[^"')]+)["')]/g)) refs.add(m[1])
}

const checks = [
  ...modules.map((u) => ({ url: u, kind: 'module' })),
  ...[...refs].map((u) => ({ url: u, kind: 'asset' })),
  { url: '/', kind: 'html' },
]

let bad = 0
const fail = (c, msg) => {
  bad++
  console.log(`  FALLA  ${c.url}  ${msg}`)
}

const probe = await fetch(BASE + '/src/main.tsx').catch(() => null)
const isDev =
  !!probe &&
  probe.ok &&
  (probe.headers.get('content-type') ?? '').includes('javascript')

if (!isDev) {
  console.log(
    `\n[check] ${BASE} no parece un dev server (o el build esta roto).\n` +
      `        Se verifican solo HTML y assets de /media.\n`,
  )
}

const toCheck = checks.filter((c) => isDev || c.kind !== 'module')

for (const c of toCheck) {
  try {
    const res = await fetch(BASE + c.url)
    const type = res.headers.get('content-type') ?? ''
    const fellBack = c.kind !== 'html' && type.includes('text/html')

    if (!res.ok) fail(c, `HTTP ${res.status}`)
    else if (fellBack) fail(c, `cayo al fallback HTML de la SPA (${type})`)
    else if (c.kind === 'module' && !/javascript|css/.test(type)) fail(c, `content-type raro: ${type}`)
  } catch (err) {
    fail(c, err.message)
  }
}

console.log(`\n${toCheck.length} comprobaciones · ${bad} fallo(s) · servidor ${BASE}\n`)
process.exit(bad ? 1 : 0)