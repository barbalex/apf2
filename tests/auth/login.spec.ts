import { test, expect } from '@playwright/test'
import loginData from '../../playwright/.auth/user.json' with { type: 'json' }

// Run tests without authenticated state
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('User login', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear IndexedDB before each test
    await context.clearCookies()
    await page.goto('/Daten/')
    await page.evaluate(() => indexedDB.deleteDatabase('apflora'))
  })

  test('greets with Anmeldung', async ({ page }) => {
    await expect(page.locator('#dialog-title')).toContainText('Anmeldung')
  })

  test('has Anmelden button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /anmelden/i })).toBeVisible()
  })

  test('focuses name on load', async ({ page }) => {
    await expect(page.getByLabel('Name')).toBeFocused()
  })

  test('requires name on submit', async ({ page }) => {
    await page.getByLabel('Passwort').fill(loginData.password)
    await page.getByRole('button', { name: /anmelden/i }).click()
    await expect(page.locator('#nameHelper')).toContainText(
      'Name oder Passwort nicht bekannt',
    )
  })

  test('requires password on submit', async ({ page }) => {
    await page.getByLabel('Name').fill(loginData.name)
    await page.getByRole('button', { name: /anmelden/i }).click()
    await expect(page.locator('#passwortHelper')).toContainText(
      'Name oder Passwort nicht bekannt',
    )
  })

  test('requires password on Enter in password field', async ({ page }) => {
    await page.getByLabel('Passwort').press('Enter')
    await expect(page.locator('#passwortHelper')).toContainText(
      'Bitte Passwort eingeben',
    )
  })

  test('barks when submitting wrong name', async ({ page }) => {
    await page.getByLabel('Name').fill('wrong name')
    await page.getByLabel('Passwort').fill(loginData.password)
    await page.getByRole('button', { name: /anmelden/i }).click()
    await expect(page.locator('#passwortHelper')).toContainText(
      'Name oder Passwort nicht bekannt',
    )
  })

  test('barks when submitting wrong password', async ({ page }) => {
    await page.getByLabel('Name').fill(loginData.name)
    await page.getByLabel('Passwort').fill('wrong password')
    await page.getByRole('button', { name: /anmelden/i }).click()
    await expect(page.locator('#nameHelper')).toContainText(
      'Name oder Passwort nicht bekannt',
    )
  })

  test('logs in correctly', async ({ page }) => {
    await page.getByLabel('Name').fill(loginData.name)
    await page.getByLabel('Passwort').fill(loginData.password)
    await page.getByRole('button', { name: /anmelden/i }).click()
    await page.waitForURL(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13',
    )
    await expect(page.locator('#dialog-title')).not.toBeVisible()
  })
})
