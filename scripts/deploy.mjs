// deploys production by updating the apflora branch from master:
// bumps the version (scripts/bumpVersion.mjs), commits the bump on master,
// pushes master, then creates a merge commit of master into apflora and
// pushes it. pushing apflora triggers the production deploy on Vercel.
// the merge is created without checking apflora out, so the working
// tree and uncommitted changes to other files are left alone.
// usage: npm run deploy [patch|minor|major] (default: patch)
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const run = (cmd, args, opts = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...opts,
  }).trim()
}

const type = process.argv[2] ?? 'patch'
if (!['patch', 'minor', 'major'].includes(type)) {
  console.error(`unknown bump type "${type}" — use patch, minor or major`)
  process.exit(1)
}

const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
if (branch !== 'master') {
  console.error(`deploy must be run on master, not on ${branch}`)
  process.exit(1)
}

// bump the version and date in package.json
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
console.log(run('node', [path.join(root, 'scripts/bumpVersion.mjs'), type]))

// commit the version bump
run('git', ['add', 'package.json'])
if (run('git', ['diff', '--cached', '--name-only'])) {
  run('git', ['commit', '-m', 'up version'])
  console.log(`committed: ${run('git', ['log', '-1', '--format=%h %s'])}`)
} else {
  console.log('no version change to commit')
}

run('git', ['push', 'origin', 'master'])

// merge master into apflora without checking it out
run('git', ['fetch', 'origin', 'apflora'])
let tree
try {
  tree = run('git', ['merge-tree', '--write-tree', 'origin/apflora', 'master']).split('\n')[0]
} catch (err) {
  console.error(
    'merging master into apflora failed — resolve manually with:\n' +
      '  git checkout apflora && git merge master',
  )
  console.error(err.stdout?.trim())
  process.exit(1)
}
const mergeCommit = run('git', [
  'commit-tree',
  tree,
  '-p',
  'origin/apflora',
  '-p',
  'master',
  '-m',
  "Merge branch 'master' into apflora",
])
run('git', ['push', 'origin', `${mergeCommit}:apflora`])
console.log(`apflora updated: ${mergeCommit} — production deploy triggered`)
