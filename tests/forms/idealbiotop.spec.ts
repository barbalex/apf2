import { test, expect } from '@playwright/test'

test.describe('Idealbiotop form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Idealbiotop',
    )
    await page.waitForTimeout(1500)
  })

  test('has Title Idealbiotop', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Idealbiotop',
    )
  })

  test('shows testdata-message', async ({ page }) => {
    await expect(page.locator('[data-id=testdata-message]')).toContainText(
      'Test-Aktionsplan',
    )
  })

  test('updates Erstelldatum', async ({ page }) => {
    const typedText = '01.02.2000'
    const input = page.locator('[data-id=erstelldatum] input')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates Hoehenlage', async ({ page }) => {
    const typedText = 'test'
    const input = page.locator('#hoehenlage')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
