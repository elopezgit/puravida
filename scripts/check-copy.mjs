/**
 * Barrido de corrupcion: busca caracteres y palabras que no tienen nada que
 * ver en el codigo ni en el copy en español (CJK, cirílico, emoji sueltos,
 * placeholders de otro idioma, restos de otro proyecto).
 *
 * Uso: node scripts/check-copy.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const SKIP = new Set(['node_modules', 'dist', '.git', 'package-lock.json'])

/* Rangos que jamas deberian aparecer en este proyecto */
const SUSPECT = [
  [/\u3040-\u30ff/g, 'japones'],
  [/\u4e00-\u9fff/g, 'chino'],
  [/\uac00-\ud7af/g, 'coreano'],
  [/\u0400-\u04ff/g, 'cirilico'],
  [/\u0600-\u06ff/g, 'arabe'],
  [/\u0590-\u05ff/g, 'hebreo'],
  [/\u0900-\u097f/g, 'devanagari'],
  [/\u0e00-\u0e7f/g, 'tailandes'],
  [/[\u{1f300}-\u{1faff}]/gu, 'emoji'],
  [/\ufffd/g, 'caracter de reemplazo'],
  [/\u200b|\u200c|\u200d|\ufeff/g, 'caracter invisible'],
]

/* Palabras que delatan texto generado en otro idioma o sin revisar.
   Ojo: "todo", "outline", "placeholder" y "undefined" son palabras legitimas
   (de español o de JavaScript) y NO van aqui. */
const SUSPECT_WORDS = [
  'lorem', 'ipsum', 'dolor sit', 'consectetur', 'sample text', 'fixme', 'hack',
  'xxx', 'your company', 'click here', 'learn more', 'read more',
  'get started', 'as an ai', 'language model', 'in conclusion',
  'describe ', 'generate ', 'draft ', 'bullet points', 'placeholder text',
  'your text here', 'your headline', 'your description', 'tbd', 'n/a',
]

const files = []
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue
    const full = path.join(d, e.name)
    if (e.isDirectory()) walk(full)
    else if (/\.(tsx?|css|html|md|json|mjs)$/.test(e.name)) files.push(full)
  }
}
walk(ROOT)

/* El propio script contiene la lista de palabras: no se escanea a si mismo. */
const scannable = files.filter((f) => !f.includes(`${path.sep}scripts${path.sep}`))

const hits = []
for (const file of scannable) {
  const isMarkdown = file.endsWith('.md')
  const raw = fs.readFileSync(file, 'utf8')

  raw.split(/\r?\n/).forEach((line, i) => {
    /* --- 1. caracteres imposiblees (esto no da falsos positivos) --- */
    for (const [re, label] of SUSPECT) {
      if (re.test(line)) {
        hits.push({ file, line: i + 1, label, snippet: line.trim().slice(0, 100) })
        re.lastIndex = 0
      }
    }

    /* --- 2. palabras sospechosas, solo dentro de texto visible --- */
    /* en .md todo el archivo es texto; en codigo solo literales con comilla
       simple (el copy vive ahi) y texto entre tags de JSX */
    const texts = isMarkdown ? [line] : [...line.matchAll(/'([^']*)'/g)].map((m) => m[1])

    for (const text of texts) {
      const low = text.toLowerCase()
      for (const w of SUSPECT_WORDS) {
        const re = new RegExp(`\\b${w.replace(/\s+/g, '\\s+')}\\b`)
        if (re.test(low))
          hits.push({ file, line: i + 1, label: `palabra:"${w}"`, snippet: text.trim().slice(0, 100) })
      }
    }
  })
}

if (!hits.length) {
  console.log(`Barrido limpio: ${scannable.length} archivos, sin basura de texto.\n`)
} else {
  for (const h of hits)
    console.log(`${path.relative(ROOT, h.file)}:${h.line}  [${h.label}]  ${h.snippet}`)
  console.log(`\n${hits.length} hallazgo(s) en ${scannable.length} archivos.\n`)
}
process.exit(hits.length ? 1 : 0)