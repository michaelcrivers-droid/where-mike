/**
 * Generates `public/favicon.ico` — a 32x32 PNG in an ICO container.
 *
 * Declaring only an SVG icon leaves some browsers probing `/favicon.ico` at
 * the origin root, and on a project site that path does not exist, so the one
 * error on an otherwise silent console was a missing favicon. Rather than
 * vendor a binary nobody can regenerate, it is drawn here from the same motif
 * as favicon.svg: a rounded tile, a vertical blue gradient, a white dot and a
 * soft accuracy ring.
 *
 *   npm run assets:favicon
 */

import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SIZE = 32
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'favicon.ico')

const pixels = Buffer.alloc(SIZE * SIZE * 4)
const put = (x, y, r, g, b, a) => {
  const i = (y * SIZE + x) * 4
  pixels[i] = r
  pixels[i + 1] = g
  pixels[i + 2] = b
  pixels[i + 3] = a
}

const centre = (SIZE - 1) / 2
const CORNER = 7.5
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    // Rounded square: distance from the inset box, not from the centre.
    const dx = Math.max(Math.abs(x - centre) - (SIZE / 2 - CORNER), 0)
    const dy = Math.max(Math.abs(y - centre) - (SIZE / 2 - CORNER), 0)
    if (Math.hypot(dx, dy) > CORNER) {
      put(x, y, 0, 0, 0, 0)
      continue
    }
    const t = y / (SIZE - 1)
    let r = Math.round(79 + (31 - 79) * t)
    let g = Math.round(168 + (111 - 168) * t)
    let b = Math.round(255 + (224 - 255) * t)
    const fromCentre = Math.hypot(x - centre, y - centre)
    if (fromCentre < 3.8) {
      r = g = b = 255
    } else if (fromCentre > 7.6 && fromCentre < 9.2) {
      r = Math.round(r + (255 - r) * 0.55)
      g = Math.round(g + (255 - g) * 0.55)
      b = Math.round(b + (255 - b) * 0.55)
    }
    put(x, y, r, g, b, 255)
  }
}

// PNG scanlines each carry a leading filter byte; 0 means "no filter".
const stride = SIZE * 4 + 1
const raw = Buffer.alloc(SIZE * stride)
for (let y = 0; y < SIZE; y++) {
  pixels.copy(raw, y * stride + 1, y * SIZE * 4, (y + 1) * SIZE * 4)
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // colour type: RGBA

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

// ICO directory: one entry, pointing at the PNG payload straight after it.
const header = Buffer.alloc(6)
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count

const entry = Buffer.alloc(16)
entry[0] = SIZE
entry[1] = SIZE
entry.writeUInt16LE(1, 4) // colour planes
entry.writeUInt16LE(32, 6) // bits per pixel
entry.writeUInt32LE(png.length, 8)
entry.writeUInt32LE(header.length + entry.length, 12)

writeFileSync(OUT, Buffer.concat([header, entry, png]))
console.log(`Wrote ${OUT} (${header.length + entry.length + png.length} bytes)`)
