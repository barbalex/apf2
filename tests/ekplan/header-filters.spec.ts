import { test, expect } from '@playwright/test'

// The header filters map column names to filter atoms. ekfrequenz,
// ekfrequenzStartjahr and ekAbrechnungstyp were missing from TextFilter's
// map, so typing in them wrote the ART filter instead (silent fallback).
test.describe('EkPlan header filters', () => {
  test('EK Frequenz filter filters by frequency code, not another column', async ({
    page,
  }) => {
    await page.goto(
      '/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903/EK-Planung',
    )

    // choose an art (fresh browser state has none)
    await page.getByRole('combobox').click()
    await page.getByRole('combobox').fill('Cypripedium')
    await page.getByRole('option', { name: /Cypripedium/ }).click()
    await expect(page.getByText(/Teilpopulationen/)).toBeVisible({
      timeout: 30_000,
    })

    // open the EK Frequenz header menu
    await page.locator('[aria-controls="ekfrequenzHeaderMenu"]').click()
    const input = page.locator('#EkPlanHeaderFilter')
    await expect(input).toBeVisible()
    await input.fill('1')
    await input.press('Enter')

    // the ekfrequenz code '1' matches a subset of the art's tpops
    // (the header count keeps the stale value until the refetch lands)
    const title = page.getByText(/Teilpopulationen/).first()
    const readCount = async () =>
      parseInt(
        ((await title.textContent()) ?? '').match(/^(\d+)/)?.[1] ?? '0',
        10,
      )
    await expect.poll(readCount).toBeLessThan(700)
    await expect.poll(readCount).toBeGreaterThan(0)

    // the Art column must NOT carry a filter (the old bug wrote it there)
    // filtered headers show a filter icon instead of the caret
    const artMenu = page.locator('[aria-controls="apColumnHeaderMenu"]')
    await expect(artMenu.locator('svg.fa-filter')).toHaveCount(0)

    // clear the filter again
    await page.locator('[aria-controls="ekfrequenzHeaderMenu"]').click()
    await page.getByRole('button', { name: 'Filter leeren' }).click()
    await input.press('Enter')
    await expect
      .poll(async () =>
        parseInt(
          ((await title.textContent()) ?? '').match(/^(\d+)/)?.[1] ?? '0',
          10,
        ),
      )
      .toBe(753)
  })
})
