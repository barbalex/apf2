// bumps the version and sets versionDate to today, so every
// deploy is visible to users (hamburger menu).
// usage: node scripts/bumpVersion.mjs [patch|minor|major] (default: patch)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const type = process.argv[2] ?? 'patch'
if (!['patch', 'minor', 'major'].includes(type)) {
  console.error(`unknown bump type "${type}" — use patch, minor or major`)
  process.exit(1)
}

const pkgFile = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  'package.json',
)
const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))

const parts = pkg.version.split('.').map(Number)
if (type === 'major') {
  parts[0]++
  parts[1] = 0
  parts[2] = 0
} else if (type === 'minor') {
  parts[1]++
  parts[2] = 0
} else {
  parts[2]++
}
pkg.version = parts.join('.')

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
pkg.versionDate = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`

writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n')
console.log(`version to deploy: ${pkg.version} (${pkg.versionDate})`)
