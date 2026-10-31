import { test, expect, type Page } from '@playwright/test'
import loginData from '../../playwright/.auth/user.json' with { type: 'json' }

// Regression test for #824: hovering the Daten menu on a url with
// query params (e.g. ?projekteTabs=tree&projekteTabs=daten&projekteTabs=karte)
// prefetched projektById with the search string glued to the id,
// which the server rejected with "Variable $id got invalid value".

// Run without authenticated state
test.use({ storageState: { cookies: [], origins: [] } })

async function login(page: Page) {
  await page.goto('/Daten/')
  await page.evaluate(() => {
    localStorage.clear()
    indexedDB.deleteDatabase('apflora')
  })
  await page.reload()
  await page.locator('#name').fill(loginData.name)
  await page.locator('#passwort').fill(loginData.password)
  await page.getByRole('button', { name: /anmelden/i }).click()
  // wait for the login to complete, not for the url (which is already /Daten)
  await expect(page.getByRole('heading', { name: 'Anmeldung' })).toBeHidden({
    timeout: 60000,
  })
  await page.waitForTimeout(1000)

  // dev data contains unread messages - the dialog blocks the app
  const readAll = page.getByRole('button', { name: 'alle o.k.' })
  if (await readAll.isVisible().catch(() => false)) {
    await readAll.click()
    await expect(readAll).toBeHidden({ timeout: 15000 })
  }
}

test.describe('prefetchRouteData', () => {
  // dev server with map tab is slow
  test.setTimeout(120000)

  test('strips the search string from prefetched paths', async ({ page }) => {
    // transport-agnostic request capture: graphql bodies and PostgREST paths
    const graphqlBodies: string[] = []
    const restPaths: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('graphql')) {
        graphqlBodies.push(req.postData() ?? '')
      }
      if (req.url().includes('/postgrest/') || req.url().includes(':3000/')) {
        restPaths.push(req.url())
      }
    })

    await login(page)

    // visit Daten with tabs in the url: ProtectedRoute mounts
    // QueryClientSetter, which prefetchRouteData depends on.
    // The daten tab renders the Projekt form, which primes the
    // ['projekt', id] cache — later prefetches dedupe against it
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13?projekteTabs=tree&projekteTabs=daten&projekteTabs=karte',
    )
    await page.waitForTimeout(8000)

    // spa-navigate home via the AP Flora title button:
    // it keeps the search string, as in a real session
    await page.getByRole('link', { name: 'AP Flora', exact: true }).click()
    await page.waitForURL('**/?projekteTabs=*', { timeout: 30000 })

    // the AppBar menus are MUI Buttons rendered as links
    const datenLink = page.getByRole('link', { name: 'Daten', exact: true })
    await expect(datenLink).toBeVisible()

    // hovering prefetches the projekt route
    await datenLink.hover({ force: true })
    await page.waitForTimeout(2000)

    // no request may carry the search string glued to the id
    const polluted = graphqlBodies.filter((b) => b.includes('projekteTabs'))
    expect(polluted).toEqual([])
    const pollutedPaths = restPaths.filter((p) =>
      p.includes('projekteTabs=tree'),
    )
    expect(pollutedPaths).toEqual([])

    // and the projekt was loaded with the clean id — either by the form
    // (REST) or the prefetch (graphql), whichever ran first
    const projektLoaded =
      restPaths.some(
        (p) =>
          p.includes('/v_projekt?id=eq.e57f56f4-4376-11e8-ab21-4314b6749d13'),
      ) || graphqlBodies.some(
        (b) =>
          b.includes('projektById') &&
          b.includes('"id":"e57f56f4-4376-11e8-ab21-4314b6749d13"'),
      )
    expect(projektLoaded).toBe(true)
  })
})
