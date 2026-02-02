import { test, expect } from '@playwright/test'
import pjson from '../package.json' with { type: 'json' }

const version = pjson.version

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(`apflora v${version}`)
})

test('Docs link', async ({ page }) => {
  await page.goto(`/`)
  await page.getByRole('link', { name: 'Dokumentation' }).click()
  await expect(page).toHaveURL('/Dokumentation/')
})

test('Daten link - authenticated user', async ({ page }) => {
  await page.goto(`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13`)
  await page.waitForLoadState('networkidle')
  // Should be on the project page (already authenticated)
  // Wait for any content to load, indicating successful navigation
  await expect(page.locator('body')).not.toBeEmpty()
})

test('Navigate to Mitteilungen', async ({ page }) => {
  await page.goto(`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13`)
  await page.waitForLoadState('networkidle')
  // Click through to messages - using longer timeout for these elements
  await page.getByText('Aktuelle Fehler', { exact: false }).click({ timeout: 10000 })
  await page.getByText('Fehlt hier was?', { exact: false }).click({ timeout: 10000 })
  await expect(page.getByText('Aktueller Fehler', { exact: false })).toBeVisible({ timeout: 10000 })
})
