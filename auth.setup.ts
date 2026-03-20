import { test as setup, expect } from '@playwright/test'
import loginData from './playwright/.auth/user.json' with { type: 'json' }

const authFile = './playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Perform authentication steps
  await page.goto('/Daten')
  await expect(page.getByLabel('Name')).toBeFocused()
  await page.getByLabel('Name').fill(loginData.name)
  await page.getByLabel('Passwort').fill(loginData.password)
  await page.getByRole('button', { name: 'Anmelden' }).click()

  // Wait until the page receives the cookies and navigates
  await page.waitForURL('/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')

  // Verify login was successful
  await expect(
    page.getByRole('heading', { name: 'Anmeldung' }),
  ).not.toBeVisible()

  // Save authentication state
  await page.context().storageState({ path: authFile })
})
