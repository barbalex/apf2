import { test, expect } from '@playwright/test'

test.describe('Erfolgs-Kriterium form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Erfolgskriterien/124b46ae-3cc3-11e8-b0c5-8b5949b25bb7',
    )
    await page.waitForTimeout(1500)
  })

  test('has Title Erfolgs-Kriterium', async ({ page }) => {
    await page.waitForTimeout(3000)
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Erfolgs-Kriterium',
    )
  })

  test('updates Beurteilung', async ({ page }) => {
    await page.locator('[data-id=erfolg_4] input').check()
    await page.locator('[data-id=erfolg_1] input').check()
    await expect(page.locator('[data-id=erfolg_1] input')).toHaveValue('1')
  })

  test('updates kriterien', async ({ page }) => {
    const typedText = 'test'
    const input = page.locator('#kriterien')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
