import { test, expect } from '@playwright/test'

test.describe('Population form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd',
    )
    await page.waitForTimeout(1500)
  })

  test('has Title Population', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Population',
    )
  })

  test('updates nr', async ({ page }) => {
    const typedText = '2'
    const input = page.locator('#nr')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates name', async ({ page }) => {
    const typedText = 'test bitte nicht löschen'
    const input = page.locator('#name')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates bekanntSeit', async ({ page }) => {
    const typedText = '1000'
    const input = page.locator('#bekanntSeit')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates status', async ({ page }) => {
    await page.locator('[data-id=status_100] input').check()
    await page.locator('[data-id=status_200] input').check()
    await expect(page.locator('[data-id=status_200] input')).toHaveValue('200')
  })

  test('updates statusUnklar', async ({ page }) => {
    await page.locator('[data-id=statusUnklar] input').check()
    await page.locator('[data-id=statusUnklar] input').check()
    await expect(page.locator('[data-id=statusUnklar] input')).toBeChecked()
  })

  test('updates statusUnklarBegruendung', async ({ page }) => {
    const typedText = 'test'
    const input = page.locator('#statusUnklarBegruendung')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates wgs84Lat', async ({ page }) => {
    const typedText = '47.2826994360682'
    const input = page.locator('[data-id=wgs84Lat] input')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
