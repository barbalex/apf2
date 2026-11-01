import { test, expect, type Page } from '@playwright/test'

// Dead sessions must be logged out (Anmeldung dialog opens) instead of the
// app silently browsing on cached data until a refetch fails.
// api.ts logs out when a request would carry an expired token or comes
// back 401; App.tsx checks expiry at boot and every minute.

// Run without authenticated state
test.use({ storageState: { cookies: [], origins: [] } })

// structurally valid JWT; the client only decodes (no signature check),
// the server rejects the fake signature with 401
const fakeJwt = (exp: number) => {
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({
    exp,
    role: 'apflora_manager',
    username: 'gabriel',
  })}.fake-signature`
}

async function seedUser(page: Page, token: string) {
  await page.addInitScript(([t]) => {
    localStorage.setItem(
      'user',
      JSON.stringify({ name: 'gabriel', token: t, id: 'test-id' }),
    )
  }, [token])
}

test.describe('dead session logout', () => {
  test('expired token opens Anmeldung at boot', async ({ page }) => {
    await seedUser(page, fakeJwt(Math.floor(Date.now() / 1000) - 3600))
    await page.goto('/Daten/')
    await expect(page.locator('#dialog-title')).toContainText('Anmeldung')
  })

  test('server-rejected token (401) opens Anmeldung', async ({ page }) => {
    // future exp, invalid signature: the app boots with a session, the
    // first api call answers 401, which must log the session out
    await seedUser(page, fakeJwt(Math.floor(Date.now() / 1000) + 3600))
    await page.goto('/Daten/')
    await expect(page.locator('#dialog-title')).toContainText('Anmeldung', {
      timeout: 10_000,
    })
  })
})
