import { test, expect } from '@playwright/test'

test.describe('Projekt form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    await page.waitForTimeout(1500)
  })

  test('has Title Projekt', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText('Projekt')
  })

  test('updates name', async ({ page }) => {
    const typedText = 'Flora des Kantons Zürich'
    const input = page.locator('#name')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
