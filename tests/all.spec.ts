import { test, expect } from '@playwright/test'
import pjson from '../package.json' assert { type: 'json' }

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

test('Daten link', async ({ page }) => {
  await page.goto(`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13`)
  await expect(page.getByLabel('Name')).toBeInViewport()
})

test('Navigate to Mitteilungen', async ({ page }) => {
  await page.goto(`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13`)
  await page.getByText('Aktuelle Fehler').click()
  await page.getByText('Fehlt hier was?').click()
  await expect(page.getByText('Aktueller Fehler')).toBeInViewport()
})
