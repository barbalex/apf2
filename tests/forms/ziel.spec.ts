import { test, expect } from '@playwright/test'

test.describe('Ziel form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Ziele/1/b41cdf2a-3cf9-11e8-b0c5-fff3a8fbb9e5?feldkontrTab=entwicklung&projekteTabs=tree&projekteTabs=daten',
    )
    await page.waitForTimeout(1500)
  })

  test('has Title Ziel', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText('Ziel')
  })

  test('updates jahr', async ({ page }) => {
    const typedText = '1'
    const input = page.locator('#jahr')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates bezeichnung', async ({ page }) => {
    const typedText = 'test'
    const input = page.locator('#bezeichnung')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
