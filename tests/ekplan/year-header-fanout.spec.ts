import { test, expect } from '@playwright/test'

// Each year column of the EkPlan header used to fire its own
// query_tpopkontr / query_tpopmassn / query_tpop POST (~26 columns × 3
// plus a per-year ekplan GET). On production this ~100-request fan-out
// exhausted the PostgREST pool and killed connections (#830).
// The header now shares ONE query for all year columns.
test.describe('EkPlan year header', () => {
  test('loads with a single batched query instead of per-year requests', async ({
    page,
  }) => {
    const rpcCalls: Record<string, number> = {}
    // a ~30 kB URL (every tpop id in `in.(...)`) kills the whole http/2
    // connection on production — no request may come close (#830)
    let longestUrl = 0
    let longestUrlPath = ''
    page.on('request', (request) => {
      const url = request.url()
      if (url.length > longestUrl) {
        longestUrl = url.length
        longestUrlPath = url.slice(0, 80)
      }
      if (request.method() !== 'POST') return
      // the header's batched queries (tpop_id + jahr in one response)
      for (const fn of [
        'rpc/query_tpopkontr?select=tpop_id,jahr',
        'rpc/query_tpopmassn?select=tpop_id,jahr',
        'rpc/query_tpop?select=id',
      ]) {
        if (url.includes(fn)) rpcCalls[fn] = (rpcCalls[fn] ?? 0) + 1
      }
      // the old per-year header shape (select=tpop_id, no jahr) must be gone
      for (const fn of [
        'rpc/query_tpopkontr?select=tpop_id',
        'rpc/query_tpopmassn?select=tpop_id',
      ]) {
        if (url.includes(fn) && !url.includes(',jahr')) {
          rpcCalls[`${fn} (per-year)`] = (rpcCalls[`${fn} (per-year)`] ?? 0) + 1
        }
      }
    })

    await page.goto(
      '/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903/EK-Planung',
    )
    await page.getByRole('combobox').click()
    await page.getByRole('combobox').fill('Cypripedium')
    await page.getByRole('option', { name: /Cypripedium/ }).click()
    await expect(page.getByText(/Teilpopulationen/)).toBeVisible({
      timeout: 30_000,
    })
    // give the shared year-counts query (and a possible retry) time to land
    await page.waitForTimeout(2_000)

    // one kontr/massn batch for all year columns, query_tpop for the batch
    // plus the table's own tpop list (rows use different selects and are
    // not counted here)
    expect(rpcCalls['rpc/query_tpopkontr?select=tpop_id,jahr']).toBeLessThanOrEqual(2)
    expect(rpcCalls['rpc/query_tpopmassn?select=tpop_id,jahr']).toBeLessThanOrEqual(2)
    expect(rpcCalls['rpc/query_tpop?select=id']).toBeLessThanOrEqual(4)
    expect(rpcCalls['rpc/query_tpopkontr?select=tpop_id (per-year)'] ?? 0).toBe(0)
    expect(rpcCalls['rpc/query_tpopmassn?select=tpop_id (per-year)'] ?? 0).toBe(0)
    expect(longestUrl).toBeLessThan(8_000)

    // the counts must reach the menus: at least one year between 2015 and
    // the current year offers an enabled Kontrollen filter
    const currentYear = new Date().getFullYear()
    let found = false
    for (let year = currentYear; year >= 2015 && !found; year--) {
      await page.locator('[aria-controls="yearHeaderMenu"]', {
        hasText: String(year),
      }).first().click()
      const item = page.getByRole('menuitem', {
        name: `TPop mit Kontrollen in ${year} filtern`,
      })
      if (await item.isEnabled()) found = true
      await page.keyboard.press('Escape')
    }
    expect(found).toBe(true)
  })
})
