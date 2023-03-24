import { test, expect } from '@playwright/test'
import pjson from '../package.json' assert { type: 'json' }

const version = pjson.version

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(`apflora v${version}`)
})
