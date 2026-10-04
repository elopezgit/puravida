/**
 * scripts/optimize-media.mjs
 *
 * Recomprime las imagenes de public/media a WebP (calidad ~82, ancho maximo 1100px)
 * y transcodea los videos a MP4 liviano (720p, H.264 + faststart) para que la
 * landing cargue rapido sin perder calidad visible.
 *
 * Uso:  npm run optimize
 *
 * Requiere las herramientas opcionales (no son dependencias de la app):
 *   npm i -D sharp ffmpeg-static
 * Si no estan instaladas, el script avisa y sale sin tocar nada.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../public/media', import.meta.url)))
const MAX_WIDTH = 1100
const QUALITY = 82

const load = async (name) => {
  try {
    const mod = await import(name)
    return mod.default ?? mod
  } catch {
    return null
  }
}

const sharp = await load('sharp')
const ffmpeg = await load('ffmpeg-static')

if (!sharp && !ffmpeg) {
  console.error('[optimize] Faltan las herramientas. Instalas con:  npm i -D sharp ffmpeg-static')
  process.exit(1)
}
if (!sharp) console.warn('[optimize] sharp no esta instalado: se omiten las imagenes.')
if (!ffmpeg) console.warn('[optimize] ffmpeg-static no esta instalado: se omiten los videos.')

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

async function walk(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, out)
    else out.push(full)
  }
  return out
}

async function optimizeImages() {
  if (!sharp) return
  const files = (await walk(ROOT)).filter((f) => /\.(png|jpe?g)$/i.test(f))
  if (!files.length) return
  console.log(`\n[imagenes] ${files.length} archivo(s)`)

  for (const file of files) {
    const before = (await fs.stat(file)).size
    const { width, height } = await sharp(file).metadata()
    const target = file.replace(/\.(png|jpe?g)$/i, '.webp')

    await sharp(file)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(target)

    const after = (await fs.stat(target)).size
    await fs.unlink(file)
    console.log(`  ${path.basename(file)} ${width}x${height} ${kb(before)} -> ${kb(after)}`)
  }
}

async function optimizeVideos() {
  if (!ffmpeg) return
  const files = (await walk(ROOT)).filter((f) => /\.(mp4|mov|m4v)$/i.test(f))
  if (!files.length) return
  console.log(`\n[videos] ${files.length} archivo(s)`)

  for (const file of files) {
    const before = (await fs.stat(file)).size
    const target = file.replace(/\.(mp4|mov|m4v)$/i, '.optimized.mp4')

    const args = [
      '-y',
      '-i', file,
      '-vf', 'scale=min(1280\\,iw):-2',
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-preset', 'slow',
      '-crf', '26',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      target,
    ]

    const res = spawnSync(ffmpeg, args, { stdio: 'ignore' })
    if (res.status !== 0) {
      console.log(`  ${path.basename(file)} ${kb(before)} -> se mantiene original (ffmpeg fallo)`)
      await fs.rm(target, { force: true })
      continue
    }

    const after = (await fs.stat(target)).size
    await fs.rm(file)
    await fs.rename(target, file)
    console.log(`  ${path.basename(file)} ${kb(before)} -> ${kb(after)}`)
  }
}

if (!sharp && !ffmpeg) {
  console.error('[optimize] Faltan las herramientas. Instalas con:  npm i -D sharp ffmpeg-static')
  process.exit(1)
}

await optimizeImages()
await optimizeVideos()
console.log('\n[optimize] Listo.\n')