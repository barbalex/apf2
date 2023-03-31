import { test as setup } from '@playwright/test'
import loginData from './playwright/.auth/user.json'

const authFile = './playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/Daten')
  await expect(page.getByLabel('Name')).toBeFocused()
  await page.getByLabel('Name').fill(loginData.name)
  await page.getByLabel('Passwort').fill(loginData.password)
  await page.getByRole('button', { name: 'Anmelden' }).click()
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('heading', { name: 'Anmeldung' }))
    .toBeVisible()
    .not()

  // End of authentication steps.
  await page.context().storageState({ path: authFile })
})
