const { test, expect } = require('@playwright/test')

import getAppBaseUrl from '../modules/appBaseUrl.js'

const appBaseUrl = getAppBaseUrl()

test('basic test', async ({ page }) => {
  console.log('appBaseUrl:', appBaseUrl)
  await page.goto(appBaseUrl)
  const title = page.locator('h6')
  console.log('title:', title)
  await expect(title).toHaveText('Bedrohte Pflanzenarten fördern')
})
