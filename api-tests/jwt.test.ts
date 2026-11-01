import crypto from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  config,
  mintToken,
  pgrst,
} from './helpers.ts'

// how PostgREST treats broken tokens - the cases seen in the #830
// production diagnosis. a correctly signed token without a role claim
// silently runs as anon, which surfaces as a misleading
// 'permission denied' instead of an auth error

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const sign = (payload: Record<string, unknown>, expOffsetSeconds = 600) => {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const body = b64url(
    JSON.stringify({ iat: now, exp: now + expOffsetSeconds, ...payload }),
  )
  const sig = b64url(
    crypto
      .createHmac('sha256', config.jwtSecret)
      .update(`${header}.${body}`)
      .digest(),
  )
  return `${header}.${body}.${sig}`
}

describe('jwt handling', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  it('a valid token with a role claim works', async () => {
    const res = await pgrst('/ap?select=id&limit=1', {
      token: mintToken('apflora_manager', 'gabriel'),
    })
    expect(res.status).toBe(200)
  })

  it('an expired token is rejected as PGRST301', async () => {
    const res = await pgrst('/ap?select=id&limit=1', {
      token: sign({ role: 'apflora_manager' }, -60),
    })
    expect(res.status).toBe(401)
    expect(res.data.code).toBe('PGRST301')
    expect(res.data.message).toContain('JWT expired')
  })

  it('a garbage token is rejected', async () => {
    const res = await pgrst('/ap?select=id&limit=1', {
      token: 'not.a.jwt',
    })
    expect(res.status).toBe(401)
    expect(res.data.code).toBe('PGRST301')
  })

  it('a token signed with the wrong secret is rejected', async () => {
    const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const now = Math.floor(Date.now() / 1000)
    const body = b64url(
      JSON.stringify({ role: 'apflora_manager', iat: now, exp: now + 600 }),
    )
    const sig = b64url(
      crypto
        .createHmac('sha256', 'definitely-the-wrong-secret')
        .update(`${header}.${body}`)
        .digest(),
    )
    const res = await pgrst('/ap?select=id&limit=1', {
      token: `${header}.${body}.${sig}`,
    })
    expect(res.status).toBe(401)
  })

  it('a correctly signed token WITHOUT a role claim runs as anon', async () => {
    const res = await pgrst('/rpc/query_tpop?select=id', {
      method: 'POST',
      token: sign({ username: 'gabriel' }),
      body: { p_filter: {}, p_limit: 1 },
    })
    // signature valid, but no role: PostgREST falls back to the anon
    // role, so the error is a permission error, not an auth error
    expect(res.status).toBe(401)
    expect(res.data.message).toContain('permission denied for function')
  })
})
