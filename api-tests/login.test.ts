import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

import { assertBackendAvailable, pgrst, psql } from './helpers.ts'

// the login RPC is the one anonymous entry point: it must be executable
// without a token and return the jwt_token composite (role, username,
// token) that the app stores

const devPassword = (() => {
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
})()

describe('login rpc', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  it('returns a manager token for valid credentials, without any token', async () => {
    if (!devPassword) throw new Error('no dev password: set APF2_TEST_PASSWORD')
    const res = await pgrst('/rpc/login', {
      method: 'POST',
      body: { username: 'gabriel', pass: devPassword },
    })
    expect(res.status).toBe(200)
    expect(res.data.role).toBe('apflora_manager')
    expect(res.data.username).toBe('gabriel')
    expect(res.data.token).toMatch(/^eyJ/)
    // and the minted token authenticates
    const who = await pgrst('/ap?select=id&limit=1', { token: res.data.token })
    expect(who.status).toBe(200)
  })

  it('rejects a wrong password', async () => {
    const res = await pgrst('/rpc/login', {
      method: 'POST',
      body: { username: 'gabriel', pass: 'definitely-not-it' },
    })
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.data.message).toContain('invalid user or password')
  })

  // the forced password rotation is enforced here, not only by the
  // frontend precheck (#835): a flagged account gets no token, even
  // with valid credentials
  it('refuses a token for a flagged account, valid credentials included', async () => {
    if (!devPassword) throw new Error('no dev password: set APF2_TEST_PASSWORD')
    try {
      psql(`update apflora."user" set require_new_password_on_next_login = true where name = 'gabriel'`)
      const res = await pgrst('/rpc/login', {
        method: 'POST',
        body: { username: 'gabriel', pass: devPassword },
      })
      expect(res.status).toBeGreaterThanOrEqual(400)
      expect(res.data.message).toContain('neues Passwort erforderlich')
      // credentials are checked before the flag: a wrong password
      // must not leak whether the account is flagged
      const wrong = await pgrst('/rpc/login', {
        method: 'POST',
        body: { username: 'gabriel', pass: 'definitely-not-it' },
      })
      expect(wrong.status).toBeGreaterThanOrEqual(400)
      expect(wrong.data.message).toContain('invalid user or password')
    } finally {
      psql(`update apflora."user" set require_new_password_on_next_login = false where name = 'gabriel'`)
    }
    // restored: login works again
    const after = await pgrst('/rpc/login', {
      method: 'POST',
      body: { username: 'gabriel', pass: devPassword },
    })
    expect(after.status).toBe(200)
  })
})
