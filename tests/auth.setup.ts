import { test as setup, expect } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import loginData from '../playwright/.auth/user.json' with { type: 'json' }

// storageState paths resolve against the process cwd (repo root),
// unlike the import above which is module-relative
const authFile = './playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Perform authentication steps
  await page.goto('/Daten')
  await expect(page.getByLabel('Name')).toBeFocused()
  await page.getByLabel('Name').fill(loginData.name)
  await page.getByLabel('Passwort').fill(loginData.password)
  await page.getByRole('button', { name: 'Anmelden' }).click()

  // the login stores the user (with its token) in localStorage — that is
  // what the storage state is needed for. Waiting for a specific projekt
  // url broke with a restored database whose projekt ids differ.
  await page.waitForFunction(() => !!localStorage.getItem('user'))

  // Verify login was successful
  await expect(
    page.getByRole('heading', { name: 'Anmeldung' }),
  ).not.toBeVisible()

  // Save authentication state — merged with the credentials from this
  // file, because storageState alone would drop them and the next run
  // could not log in any more
  const state = await page.context().storageState()
  writeFileSync(
    authFile,
    JSON.stringify({ ...loginData, ...state }, null, 2),
  )
})
