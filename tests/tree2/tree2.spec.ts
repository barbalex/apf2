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
