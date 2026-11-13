import { test, expect } from '@playwright/test'

// the second tree is an in-app pane (own React root + jotai store +
// MemoryRouter), successor of the former whole-app iframe
// (issues/tree2-second-pane.md)
test.describe('tree2', () => {
  test('opening tree2 renders a second workspace in-app (no iframe)', async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')

    await page.locator('[data-id="nav-tree2"]').click()

    await expect(page.locator('iframe')).toHaveCount(0)
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible()
    await expect(pane2.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    // closing tree2 removes the pane
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('[data-id="tree2-pane"]')).toHaveCount(0)
  })

  test('clicking a node in tree2 navigates the pane, not pane 1', async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')
    await page.locator('[data-id="nav-tree2"]').click()

    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    const urlBefore = page.url()

    // open the project folder inside pane 2
    await pane2.getByText('AP Flora Kt. Zürich').click()
    await expect(pane2.getByText('Arten')).toBeVisible({ timeout: 30_000 })

    // pane 1's url and tree are untouched
    expect(page.url()).toBe(urlBefore)
  })

  test("tree2 opens at pane 1's current node when no explicit target", async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')
    // navigate pane 1 into the project
    await page.getByText('AP Flora Kt. Zürich').click()
    // await the COMMITTED navigation — 'Arten' alone can appear from open
    // nodes while the route lazy-load is still pending, and clicking on
    // before it lands aborts the navigation (react-router replaces a
    // pending one), leaving the url at the project list
    await expect(page).toHaveURL(/\/Daten\/Projekte\/[0-9a-f-]{36}/, {
      timeout: 30_000,
    })
    await expect(page.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })

    await page.locator('[data-id="nav-tree2"]').click()
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible({ timeout: 30_000 })

    // the pane opened at pane 1's location: the project is expanded there
    await expect(pane2.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })
  })

  test('a QK message opens tree2 at the object to correct, not at pane 1', async ({
    page,
  }) => {
    // QK loads the full message list for the ap — needs more than the
    // default 30s alongside the navigation steps
    test.setTimeout(120_000)
    // regression: after an open/close cycle the pane's navigate outlived
    // the pane, so explicit opens (QK, Karte) navigated the dead memory
    // router and the pane fell back to pane 1's location
    const projId = '017d3474-6b07-7c56-86ef-84b0af1de903'
    await page.goto('/Daten/Projekte')
    await page.getByText('AP Flora Kt. Zürich').click()
    await expect(page).toHaveURL(/\/Daten\/Projekte\/[0-9a-f-]{36}/, {
      timeout: 30_000,
    })

    // open and close tree2 once — this is what leaves the stale navigate
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('[data-id="tree2-pane"]')).toBeVisible({
      timeout: 30_000,
    })
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('[data-id="tree2-pane"]')).toHaveCount(0)

    // open the aps folder, then the first art (rows carry their node url)
    await page.getByText('Arten').first().click()
    await expect(page).toHaveURL(/\/Arten(\?|\/|$)/, { timeout: 30_000 })
    // the art rows load with the aps query
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('[data-url]')].some((r) => {
          try {
            const u = JSON.parse(r.dataset.url ?? '[]') as unknown[]
            return Array.isArray(u) && u.length === 4 && u[2] === 'Arten'
          } catch {
            return false
          }
        }),
      { timeout: 30_000 },
    )
    await page.evaluate(() => {
      const rows = [...document.querySelectorAll<HTMLElement>('[data-url]')]
      const artRow = rows.find((r) => {
        try {
          const u = JSON.parse(r.dataset.url ?? '[]') as unknown[]
          return Array.isArray(u) && u.length === 4 && u[2] === 'Arten'
        } catch {
          return false
        }
      })
      ;(artRow?.querySelector('[class*="label"]') ?? artRow)?.click()
    })
    await expect(page).toHaveURL(/Arten\/[0-9a-f-]{36}/, { timeout: 30_000 })
    const apUrl = page.url().split('?')[0]
    await page.goto(
      `${apUrl}/Qualitätskontrollen?projekteTabs=tree&projekteTabs=daten`,
    )
    // reload on the QK page like a returning user, then click
    await page.reload()
    // message rows open tree2 on click
    const messageRow = page.locator('p[class*="styledA"]').first()
    await expect(messageRow).toBeVisible({ timeout: 60_000 })
    await messageRow.click()

    // the pane opens — on the message's node, not on pane 1's QK page:
    // it renders no QK message rows and its active path shows the ap
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible({ timeout: 30_000 })
    await expect(pane2.locator('p[class*="styledA"]')).toHaveCount(0)
    await expect(pane2.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })
  })

  test('navigating pane 1 does not reload tree2', async ({ page }) => {
    await page.goto('/Daten/Projekte')
    await page.locator('[data-id="nav-tree2"]').click()

    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    // mark the pane's DOM node: the pane is only reloaded if this
    // element disappears (separate React root, no remounts)
    await page.evaluate(() => {
      const pane = document.querySelector('[data-id="tree2-pane"]')
      pane?.setAttribute('data-marker', 'survives')
    })

    // navigate pane 1 by clicking in ITS tree (formerly every pane-1
    // navigation re-set the iframe src and reloaded the whole second app)
    // pane 1's tree is the first of the two in the DOM
    await page.getByText('AP Flora Kt. Zürich').first().click()
    await expect(page.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })

    await expect(
      page.locator('[data-id="tree2-pane"][data-marker="survives"]'),
    ).toBeVisible()
    await expect(
      page.locator('[data-id="tree2-pane"]').getByText('AP Flora Kt. Zürich'),
    ).toBeVisible({ timeout: 30_000 })
  })
})
