import { test, expect } from '@playwright/test'

test.describe('Massnahme form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Massnahmen/87379a58-4f62-11e7-aebe-f32f5b153432',
    )
    await page.waitForTimeout(2000)
  })

  test('has correct Title', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Massnahme',
    )
  })

  test('updates jahr', async ({ page }) => {
    const typedText = '2000'
    const input = page.locator('#jahr')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates datum', async ({ page }) => {
    const typedText = '01.02.2000'
    const input = page.locator('[data-id=datum] input')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates beschreibung', async ({ page }) => {
    const typedText = 'test'
    const input = page.locator('#beschreibung')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
