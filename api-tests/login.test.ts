import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

import { assertBackendAvailable, pgrst } from './helpers.ts'

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
})
