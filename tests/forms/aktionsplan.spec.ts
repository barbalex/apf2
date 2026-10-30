import { test, expect } from '@playwright/test'

test.describe('Aktionsplan form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903/Arten/017d3472-d75d-735d-8197-b6db29e70db3',
    )
    await page.waitForLoadState('networkidle')
  })

  test('has Title Art', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText('Art')
  })

  // test('shows testdata-message', async ({ page }) => {
  //   await expect(page.locator('[data-id=testdata-message]')).toContainText(
  //     'Test-Aktionsplan',
  //   )
  // })

  // test('updates bearbeitung Aktionsplan', async ({ page }) => {
  //   await page.locator('[data-id=bearbeitung_1] input').check()
  //   await page.locator('[data-id=bearbeitung_4] input').check()
  //   await expect(page.locator('[data-id=bearbeitung_4] input')).toHaveValue(
  //     '4',
  //   )
  // })

  // test('updates Start im Jahr', async ({ page }) => {
  //   const typedText = '2005'
  //   const input = page.locator('#startJahr')
  //   await input.clear()
  //   await input.fill(typedText)
  //   await expect(input).toHaveValue(typedText)
  // })

  // test('updates Stand Umsetzung', async ({ page }) => {
  //   await page.locator('[data-id=umsetzung_0] input').check()
  //   await page.locator('[data-id=umsetzung_1] input').check()
  //   await expect(page.locator('[data-id=umsetzung_1] input')).toHaveValue('1')
  // })

  // test('updates Bester Beobachtungszeitpunkt für EKF', async ({ page }) => {
  //   const typedText = 'test'
  //   const input = page.locator('#ekfBeobachtungszeitpunkt')
  //   await input.clear()
  //   await input.fill(typedText)
  //   await input.blur()
  //   await expect(input).toHaveValue(typedText)
  // })
})
