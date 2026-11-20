// fetches a fresh production backup into backend-dev/db/apflora.backup
// (the file a fresh dev db volume initializes from, see backend-dev/db/
// Dockerfile). runs the production backup first - its fingerprint skip
// makes this cheap when nothing changed; /sik_data/last.backup.age in the
// db container always holds the newest uploaded backup either way.
// the backup arrives age-encrypted (the VM holds the public key only) and
// is decrypted here with the notebook's private key (~/.config/age/keys.txt)
// - every fetch doubles as the restore drill AND as proof that this
// machine's key still decrypts current backups.
// afterwards rebuild the dev stack with a fresh volume:
//   docker compose -f backend-dev/docker-compose.yml down -v
//   docker compose -f backend-dev/docker-compose.yml up -d --build
// (down -v deletes the local dev data!)
// then re-apply the sql the backup predates: npm run db:apply-sql
import { execFileSync } from 'node:child_process'
import { existsSync, renameSync, rmSync, statSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SERVER = 'root@139.162.172.88'
const run = (cmd, args, opts = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, { stdio: 'inherit', ...opts })
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const target = path.join(root, 'backend-dev', 'db', 'apflora.backup')
const identity = path.join(homedir(), '.config', 'age', 'keys.txt')
const encrypted = path.join(tmpdir(), 'apflora-fetch.backup.age')
const decrypted = path.join(tmpdir(), 'apflora-fetch.backup')

console.log('creating a backup on the server (skips if data unchanged)...')
run('ssh', ['-o', 'BatchMode=yes', SERVER, 'docker exec apf_db bash ./backup.sh'])

console.log('copying the encrypted backup out of the container...')
run('ssh', [
  '-o',
  'BatchMode=yes',
  SERVER,
  'docker cp apf_db:/sik_data/last.backup.age /tmp/apflora-fetch.backup.age',
])

console.log('downloading...')
run('scp', [
  '-o',
  'BatchMode=yes',
  `${SERVER}:/tmp/apflora-fetch.backup.age`,
  encrypted,
])
run('ssh', [
  '-o',
  'BatchMode=yes',
  SERVER,
  'rm -f /tmp/apflora-fetch.backup.age',
])

if (!existsSync(identity)) {
  console.error(`ERROR: age identity ${identity} not found`)
  console.error('it holds the private backup key and lives on the notebook only - see PRODUCTION.md (Backups)')
  rmSync(encrypted, { force: true })
  process.exit(1)
}

console.log('decrypting with the local age key...')
try {
  run('age', ['-d', '-i', identity, '-o', decrypted, encrypted])
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('ERROR: age not found - install it (apt install age, or the static binary into ~/.local/bin)')
  }
  rmSync(encrypted, { force: true })
  throw error
}
rmSync(encrypted, { force: true })

if (!existsSync(decrypted) || statSync(decrypted).size < 10_000_000) {
  console.error('ERROR: the decrypted backup looks wrong (missing or < 10MB)')
  process.exit(1)
}
// rename so backend-dev/db/apflora.backup is never a half-written file
renameSync(decrypted, target)
const mb = Math.round(statSync(target).size / 100_000) / 10
console.log(`backend-dev/db/apflora.backup updated (${mb} MB, decrypted + verified non-trivial size)`)
console.log(
  'rebuild the dev stack against it: docker compose -f backend-dev/docker-compose.yml down -v && up -d --build, then npm run db:apply-sql',
)
