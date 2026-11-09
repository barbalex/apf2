import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

// Shared harness for the api tests (npm run test:api).
// They run against the LOCAL backend started with:
//   docker compose -f backend-dev/docker-compose.yml up -d
// and talk to PostgREST directly, with per-role JWTs minted here.
// Deliberately separate from `npm test` (Playwright): these tests
// need docker + the local backend and must not run in CI.

const REPO_ROOT = path.resolve(__dirname, '..')
const DEV_ENV_PATH = path.join(REPO_ROOT, 'backend-dev/.env')

// backend-dev/.env has mixed line endings - strip \r
const parseEnv = (file: string): Record<string, string> => {
  const env: Record<string, string> = {}
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const clean = line.replace(/\r$/, '')
    if (!clean || clean.startsWith('#')) continue
    const eq = clean.indexOf('=')
    if (eq === -1) continue
    env[clean.slice(0, eq)] = clean.slice(eq + 1)
  }
  return env
}

const devEnv = parseEnv(DEV_ENV_PATH)

export const config = {
  pgrstUri: process.env.PGRST_URI ?? 'http://localhost:3000',
  jwtSecret: process.env.PGRST_JWT_SECRET ?? devEnv.JWT_SECRET,
}

export const APP_ROLES = [
  'apflora_reader',
  'apflora_ap_reader',
  'apflora_ap_writer',
  'apflora_freiwillig',
  'apflora_manager',
] as const
export type AppRole = (typeof APP_ROLES)[number]

// ---- PostgREST ----

// the login RPC mints HS256 tokens carrying role + username; the RLS
// policies read the username claim via current_user_name()
export const mintToken = (role: string, username?: string): string => {
  const b64url = (buf: Buffer | string) =>
    Buffer.from(buf)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = b64url(
    JSON.stringify({
      role,
      ...(username ? { username } : {}),
      iat: now,
      exp: now + 60 * 60,
    }),
  )
  const sig = b64url(
    crypto
      .createHmac('sha256', config.jwtSecret)
      .update(`${header}.${payload}`)
      .digest(),
  )
  return `${header}.${payload}.${sig}`
}

export type Json =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any

export const pgrst = async (
  pathAndQuery: string,
  options: {
    method?: string
    token?: string
    body?: unknown
    prefer?: string
  } = {},
): Promise<{ status: number; data: Json }> => {
  const headers: Record<string, string> = {
    accept: 'application/json',
  }
  if (options.token) headers.authorization = `Bearer ${options.token}`
  if (options.prefer) headers.prefer = options.prefer
  let body: string | undefined
  if (options.body !== undefined) {
    headers['content-type'] = 'application/json'
    body = JSON.stringify(options.body)
  }
  const res = await fetch(`${config.pgrstUri}${pathAndQuery}`, {
    method: options.method ?? 'GET',
    headers,
    body,
  })
  let data: Json = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }
  return { status: res.status, data }
}

// ---- db (docker exec psql, for reading state and seeding fixtures) ----

export const psql = (sql: string): string =>
  execFileSync(
    'docker',
    [
      'exec',
      'apf_db',
      'psql',
      '-U',
      'postgres',
      '-d',
      'apflora',
      '-v',
      'ON_ERROR_STOP=1',
      '-q',
      '-t',
      '-A',
      '-c',
      sql,
    ],
    { encoding: 'utf8', timeout: 30_000 },
  )

export const psqlJson = <T = Json>(sql: string): T[] =>
  JSON.parse(
    psql(`select coalesce(json_agg(t), '[]'::json) from (${sql}) t`),
  ) as T[]

// ---- test users ----

export interface TestUser {
  name: string
  role: AppRole
  hasAps: boolean
}

let cachedUsers: TestUser[] | null = null

// one user per role from the dev db, preferring ones with ap_user
// assignments so the ap-scoped policies actually have something to
// bite on
export const getTestUsers = (): TestUser[] => {
  if (cachedUsers) return cachedUsers
  const users = psqlJson<{ name: string; role: string; has_aps: boolean }>(
    `select u.name, u.role::text as role,
       exists(select 1 from apflora.ap_user a where a.user_name = u.name) as has_aps
     from apflora."user" u
     where u.role::text in ('apflora_reader','apflora_ap_reader','apflora_ap_writer',
                            'apflora_freiwillig','apflora_manager')`,
  )
  const byRole: Record<string, TestUser[]> = {}
  for (const u of users) {
    byRole[u.role] ??= []
    byRole[u.role].push({ name: u.name, role: u.role as AppRole, hasAps: u.has_aps })
  }
  const result: TestUser[] = []
  for (const role of APP_ROLES) {
    const ofRole = [...(byRole[role] ?? [])].sort(
      (a, b) => Number(b.hasAps) - Number(a.hasAps),
    )
    // roles without any user (e.g. ap_reader on a fresh dev db) are
    // skipped - tests that need them seed their own
    if (ofRole.length) result.push(ofRole[0])
  }
  cachedUsers = result
  return result
}

export const getTestUser = (role: AppRole): TestUser => {
  const user = getTestUsers().find((u) => u.role === role)
  if (!user) throw new Error(`no test user with role ${role} in dev db`)
  return user
}

export const assertBackendAvailable = async (): Promise<void> => {
  const message =
    'the local backend is not reachable - start it with:\n' +
    '  docker compose -f backend-dev/docker-compose.yml up -d'
  const pgrstRes = await fetch(`${config.pgrstUri}/`, {
    signal: AbortSignal.timeout(3000),
  }).catch(() => null)
  if (!pgrstRes) throw new Error(message)
}

// password of the dev manager account (gabriel): either from the env
// or from the playwright storage state
export const getDevPassword = (): string | undefined => {
  const env = process.env.APF2_TEST_PASSWORD
  if (env) return env
  try {
    const auth = JSON.parse(
      readFileSync(path.resolve(__dirname, '../playwright/.auth/user.json'), 'utf8'),
    ) as { password?: string }
    return auth.password
  } catch {
    return undefined
  }
}
