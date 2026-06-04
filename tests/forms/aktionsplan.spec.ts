import { test, expect } from '@playwright/test'

test.describe('Aktionsplan form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640',
    )
    await page.waitForLoadState('networkidle')
  })

  test('has Title Aktionsplan', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Aktionsplan',
    )
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
