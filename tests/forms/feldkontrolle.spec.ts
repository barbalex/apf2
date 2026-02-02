import { test, expect } from '@playwright/test'

test.describe('Teil-Population Feldkontrolle form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Feld-Kontrollen/68364eb3-8be6-11e7-a848-0b73d4b76fcd',
    )
    await page.waitForTimeout(2000)
  })

  test('has correct Title', async ({ page }) => {
    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Feld-Kontrolle',
    )
  })

  test('updates jahr', async ({ page }) => {
    const typedText = '1'
    const input = page.locator('#jahr')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('datum only accepts valid values', async ({ page }) => {
    const typedText = '01.02.1001'
    const input = page.locator('[data-id=datum] input')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(page.locator('[data-id=datum] p')).toContainText('minimal')
  })

  test('updates datum', async ({ page }) => {
    const typedText = '01.02.2000'
    await page.locator('#ueberlebensrate').waitFor()
    await page.waitForTimeout(50)
    const input = page.locator('[data-id=datum] input')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates typ', async ({ page }) => {
    await page.locator('[data-id=typ_Ausgangszustand] input').check()
    await page.locator('[data-id=typ_Zwischenbeurteilung] input').check()
    await expect(
      page.locator('[data-id=typ_Zwischenbeurteilung] input'),
    ).toHaveValue('Zwischenbeurteilung')
  })

  test('updates ueberlebensrate', async ({ page }) => {
    const typedText = '5'
    const input = page.locator('#ueberlebensrate')
    await input.clear()
    await input.fill(typedText)
    await input.blur()
    await expect(input).toHaveValue(typedText)
  })

  test('updates entwicklung', async ({ page }) => {
    await page.locator('[data-id=entwicklung_1] input').check()
    await page.locator('[data-id=entwicklung_8] input').check()
    await expect(page.locator('[data-id=entwicklung_8] input')).toHaveValue(
      '8',
    )
  })
})
