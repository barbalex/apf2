// Type-check against a committed baseline of known errors.
// Fails when NEW type errors appear; fixed errors are reported.
// Regenerate the baseline with: npm run typecheck:update-baseline
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baselineFile = path.join(root, 'type-baseline.json')
const update = process.argv.includes('--update')

let output
try {
  output = execSync('npx tsc --noEmit --pretty false', {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
} catch (err) {
  // tsc exits non-zero when errors exist — the output is what we want
  output = err.stdout ?? ''
}

// lines look like: src/foo.ts(12,34): error TS2322: Some message
const errorRe = /^(.+?)\(\d+,\d+\): error (TS\d+): (.*)$/
const current = new Set()
for (const line of output.split('\n')) {
  const match = errorRe.exec(line)
  if (match) current.add(`${match[1]}::${match[2]}::${match[3]}`)
}

if (update) {
  writeFileSync(baselineFile, JSON.stringify([...current].sort(), null, 2) + '\n')
  console.log(`typecheck-baseline: wrote ${current.size} known errors to type-baseline.json`)
  process.exit(0)
}

let baseline = []
try {
  baseline = JSON.parse(readFileSync(baselineFile, 'utf8'))
} catch {
  console.error('typecheck-baseline: type-baseline.json is missing or invalid.')
  console.error('Run: npm run typecheck:update-baseline')
  process.exit(1)
}
const known = new Set(baseline)

const added = [...current].filter((k) => !known.has(k))
const fixed = [...known].filter((k) => !current.has(k))

if (added.length > 0) {
  console.error(`typecheck-baseline: ${added.length} NEW type error(s):`)
  for (const key of added) console.error(`  ${key.replaceAll('::', ' | ')}`)
  console.error('')
  console.error('Fix them, then re-run. If they are expected, regenerate with: npm run typecheck:update-baseline')
  process.exit(1)
}

console.log(`typecheck-baseline: OK — ${current.size} known errors, no new ones${fixed.length ? `, ${fixed.length} fixed since baseline (consider regenerating)` : ''}`)
