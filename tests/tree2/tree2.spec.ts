import { test, expect } from '@playwright/test'

// pins the current tree2 behavior: the second tree is the whole app loaded
// in an iframe (see src/components/Projekte/index.tsx). Any rewrite of tree2
// as an in-app pane (see issues/tree2-second-pane.md) must keep these green
// or consciously change them
test.describe('tree2', () => {
  test('opening tree2 renders a second workspace in an iframe', async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')

    // open the second tree via the app bar
    await page.locator('[data-id="nav-tree2"]').click()

    // the pane appears and loads the app inside the iframe. At half the
    // default viewport width the embedded app renders in mobile view, so
    // assert on the project name rather than the tree's root label
    const tree2Frame = page.frameLocator('iframe[title="tree2"]')
    await expect(tree2Frame.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    // closing tree2 removes the pane
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('iframe[title="tree2"]')).toHaveCount(0)
  })

  test('tree2 opens on the active node', async ({ page }) => {
    await page.goto('/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903')

    await page.locator('[data-id="nav-tree2"]').click()

    // the iframe receives the parent's pathname
    const iframe = page.locator('iframe[title="tree2"]')
    await expect(iframe).toBeVisible({ timeout: 30_000 })
    const src = await iframe.getAttribute('src')
    expect(src).toContain(
      '/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903',
    )
  })
})
