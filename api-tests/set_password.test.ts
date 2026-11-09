import { beforeAll, describe, expect, it } from 'vitest'

import { assertBackendAvailable, getDevPassword, pgrst, psql } from './helpers.ts'

// set_password stays anon-executable for the forced rotation (#835)
// but must not let anon claim an account whose pass is still NULL:
// those accounts are onboarded by topos (assigned initial password,
// forced rotation on first login) - see
// sql/apflora/migrations/2026-11-09_set-password-no-passless-claiming

const newPassword = 'NeuesTestPasswort-2026!'

describe('set_password rpc', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  it('refuses to let anon claim a passless account', async () => {
    const devPassword = getDevPassword()
    if (!devPassword) throw new Error('no dev password: set APF2_TEST_PASSWORD')
    const savedHash = psql(
      `select pass from apflora."user" where name = 'gabriel'`,
    ).trim()
    // sanity: gabriel has a bcrypt hash to restore afterwards
    expect(savedHash).toMatch(/^\$2[aby]\$/)
    try {
      psql(
        `update apflora."user" set pass = null, require_new_password_on_next_login = false where name = 'gabriel'`,
      )
      const claimWithoutOldPass = await pgrst('/rpc/set_password', {
        method: 'POST',
        body: { p_username: 'gabriel', p_new_pass: newPassword },
      })
      expect(claimWithoutOldPass.status).toBeGreaterThanOrEqual(400)
      expect(claimWithoutOldPass.data.message).toContain(
        'noch kein Passwort gesetzt',
      )
      // supplying an old pass must not help either
      const claimWithOldPass = await pgrst('/rpc/set_password', {
        method: 'POST',
        body: {
          p_username: 'gabriel',
          p_new_pass: newPassword,
          p_old_pass: newPassword,
        },
      })
      expect(claimWithOldPass.status).toBeGreaterThanOrEqual(400)
      expect(claimWithOldPass.data.message).toContain(
        'noch kein Passwort gesetzt',
      )
      // the account was not modified
      expect(
        psql(
          `select pass is null from apflora."user" where name = 'gabriel'`,
        ).trim(),
      ).toBe('t')
      // login points the owner to topos instead of the generic refusal
      const login = await pgrst('/rpc/login', {
        method: 'POST',
        body: { username: 'gabriel', pass: newPassword },
      })
      expect(login.status).toBeGreaterThanOrEqual(400)
      expect(login.data.message).toContain('noch kein Passwort gesetzt')
    } finally {
      psql(
        `update apflora."user" set pass = '${savedHash}', require_new_password_on_next_login = false where name = 'gabriel'`,
      )
    }
    // restored: the original password logs in again
    const after = await pgrst('/rpc/login', {
      method: 'POST',
      body: { username: 'gabriel', pass: devPassword },
    })
    expect(after.status).toBe(200)
  })

  it('rotates the password only with proof of the old one', async () => {
    const devPassword = getDevPassword()
    if (!devPassword) throw new Error('no dev password: set APF2_TEST_PASSWORD')
    const savedHash = psql(
      `select pass from apflora."user" where name = 'gabriel'`,
    ).trim()
    psql(
      `update apflora."user" set require_new_password_on_next_login = false where name = 'gabriel'`,
    )
    try {
      const missingOldPass = await pgrst('/rpc/set_password', {
        method: 'POST',
        body: {
          p_username: 'gabriel',
          p_new_pass: newPassword,
          p_old_pass: '',
        },
      })
      expect(missingOldPass.status).toBeGreaterThanOrEqual(400)
      expect(missingOldPass.data.message).toContain('altes Passwort erforderlich')

      const wrongOldPass = await pgrst('/rpc/set_password', {
        method: 'POST',
        body: {
          p_username: 'gabriel',
          p_new_pass: newPassword,
          p_old_pass: 'definitely-not-it',
        },
      })
      expect(wrongOldPass.status).toBeGreaterThanOrEqual(400)
      expect(wrongOldPass.data.message).toContain(
        'altes Passwort ist nicht korrekt',
      )

      const correct = await pgrst('/rpc/set_password', {
        method: 'POST',
        body: {
          p_username: 'gabriel',
          p_new_pass: newPassword,
          p_old_pass: devPassword,
        },
      })
      expect(correct.status).toBe(200)
      // the rotation clears the flag and the new password logs in
      expect(
        psql(
          `select coalesce(require_new_password_on_next_login, true) from apflora."user" where name = 'gabriel'`,
        ).trim(),
      ).toBe('f')
      const login = await pgrst('/rpc/login', {
        method: 'POST',
        body: { username: 'gabriel', pass: newPassword },
      })
      expect(login.status).toBe(200)
    } finally {
      psql(
        `update apflora."user" set pass = '${savedHash}', require_new_password_on_next_login = false where name = 'gabriel'`,
      )
    }
    const after = await pgrst('/rpc/login', {
      method: 'POST',
      body: { username: 'gabriel', pass: devPassword },
    })
    expect(after.status).toBe(200)
  })
})
