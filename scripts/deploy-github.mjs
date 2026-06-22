import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

console.log('Building for GitHub Pages...')
execSync('npm run build', { cwd: root, stdio: 'inherit' })

const dist = resolve(root, 'dist')
const assets = resolve(root, 'assets')

if (existsSync(assets)) rmSync(assets, { recursive: true, force: true })

const builtHtml = existsSync(resolve(dist, 'index.html'))
  ? resolve(dist, 'index.html')
  : resolve(dist, 'index.dev.html')
cpSync(builtHtml, resolve(root, 'index.html'))
cpSync(resolve(dist, 'assets'), assets, { recursive: true })

for (const file of ['favicon.svg', 'icons.svg', 'manifest.json']) {
  const src = resolve(dist, file)
  if (existsSync(src)) cpSync(src, resolve(root, file))
}

const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf-8')
writeFileSync(resolve(root, '404.html'), indexHtml)
writeFileSync(resolve(root, '.nojekyll'), '')

console.log('GitHub Pages files ready at repo root (index.html + assets/)')