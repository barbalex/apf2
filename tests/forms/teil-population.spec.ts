import { test, expect } from '@playwright/test'

test.describe('Teil-Population form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555',
    )
    await page.waitForTimeout(1500)
  })

  test('has correct Title', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Teil-Population',
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

  test('updates flurname', async ({ page }) => {
    const typedText = 'test, bitte nicht löschen'
    const input = page.locator('#flurname')
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
    const input = page.locator('#statusUnklarGrund')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates apberRelevantGrund', async ({ page }) => {
    await page.locator('[data-id=apberRelevantGrund_2] input').check()
    await page.locator('[data-id=apberRelevantGrund_3] input').check()
    await expect(
      page.locator('[data-id=apberRelevantGrund_3] input'),
    ).toHaveValue('3')
  })

  test('updates radius', async ({ page }) => {
    const typedText = '5'
    const input = page.locator('#radius')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })
})
