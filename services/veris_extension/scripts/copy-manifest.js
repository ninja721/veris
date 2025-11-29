import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dist = path.resolve(__dirname, '..', 'dist')
const iconsDist = path.resolve(dist, 'icons')

if (!fs.existsSync(dist)) fs.mkdirSync(dist)
if (!fs.existsSync(iconsDist)) fs.mkdirSync(iconsDist)

// Copy manifest
fs.copyFileSync(
  path.resolve(__dirname, '..', 'manifest.json'),
  path.resolve(dist, 'manifest.json')
)

// Copy icons
const iconsDir = path.resolve(__dirname, '..', 'icons')
if (fs.existsSync(iconsDir)) {
  const iconFiles = fs.readdirSync(iconsDir)
  iconFiles.forEach(icon => {
    const src = path.resolve(iconsDir, icon)
    const dest = path.resolve(iconsDist, icon)
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest)
    }
  })
}

console.log('✅ Manifest and icons copied to dist')