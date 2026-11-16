import { test, expect } from '@playwright/test'

// the second tree is an in-app pane (own React root + jotai store +
// MemoryRouter), successor of the former whole-app iframe
// (issues/tree2-second-pane.md)
test.describe('tree2', () => {
  test('opening tree2 renders a second workspace in-app (no iframe)', async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')

    await page.locator('[data-id="nav-tree2"]').click()

    await expect(page.locator('iframe')).toHaveCount(0)
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible()
    await expect(pane2.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    // closing tree2 removes the pane
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('[data-id="tree2-pane"]')).toHaveCount(0)
  })

  test('clicking a node in tree2 navigates the pane, not pane 1', async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')
    await page.locator('[data-id="nav-tree2"]').click()

    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    const urlBefore = page.url()

    // open the project folder inside pane 2
    await pane2.getByText('AP Flora Kt. Zürich').click()
    await expect(pane2.getByText('Arten')).toBeVisible({ timeout: 30_000 })

    // pane 1's url and tree are untouched
    expect(page.url()).toBe(urlBefore)
  })

  test("tree2 opens at pane 1's current node when no explicit target", async ({
    page,
  }) => {
    await page.goto('/Daten/Projekte')
    // navigate pane 1 into the project
    await page.getByText('AP Flora Kt. Zürich').click()
    // await the COMMITTED navigation — 'Arten' alone can appear from open
    // nodes while the route lazy-load is still pending, and clicking on
    // before it lands aborts the navigation (react-router replaces a
    // pending one), leaving the url at the project list
    await expect(page).toHaveURL(/\/Daten\/Projekte\/[0-9a-f-]{36}/, {
      timeout: 30_000,
    })
    await expect(page.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })

    await page.locator('[data-id="nav-tree2"]').click()
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible({ timeout: 30_000 })

    // the pane opened at pane 1's location: the project is expanded there
    await expect(pane2.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })
  })

  test('a QK message opens tree2 at the object to correct, not at pane 1', async ({
    page,
  }) => {
    // QK loads the full message list for the ap — needs more than the
    // default 30s alongside the navigation steps
    test.setTimeout(120_000)
    // regression: after an open/close cycle the pane's navigate outlived
    // the pane, so explicit opens (QK, Karte) navigated the dead memory
    // router and the pane fell back to pane 1's location
    const projId = '017d3474-6b07-7c56-86ef-84b0af1de903'
    await page.goto('/Daten/Projekte')
    await page.getByText('AP Flora Kt. Zürich').click()
    await expect(page).toHaveURL(/\/Daten\/Projekte\/[0-9a-f-]{36}/, {
      timeout: 30_000,
    })

    // open and close tree2 once — this is what leaves the stale navigate
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('[data-id="tree2-pane"]')).toBeVisible({
      timeout: 30_000,
    })
    await page.locator('[data-id="nav-tree2"]').click()
    await expect(page.locator('[data-id="tree2-pane"]')).toHaveCount(0)

    // open the aps folder, then the first art (rows carry their node url)
    await page.getByText('Arten').first().click()
    await expect(page).toHaveURL(/\/Arten(\?|\/|$)/, { timeout: 30_000 })
    // the art rows load with the aps query
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('[data-url]')].some((r) => {
          try {
            const u = JSON.parse(r.dataset.url ?? '[]') as unknown[]
            return Array.isArray(u) && u.length === 4 && u[2] === 'Arten'
          } catch {
            return false
          }
        }),
      { timeout: 30_000 },
    )
    await page.evaluate(() => {
      const rows = [...document.querySelectorAll<HTMLElement>('[data-url]')]
      const artRow = rows.find((r) => {
        try {
          const u = JSON.parse(r.dataset.url ?? '[]') as unknown[]
          return Array.isArray(u) && u.length === 4 && u[2] === 'Arten'
        } catch {
          return false
        }
      })
      ;(artRow?.querySelector('[class*="label"]') ?? artRow)?.click()
    })
    await expect(page).toHaveURL(/Arten\/[0-9a-f-]{36}/, { timeout: 30_000 })
    const apUrl = page.url().split('?')[0]
    await page.goto(
      `${apUrl}/Qualitätskontrollen?projekteTabs=tree&projekteTabs=daten`,
    )
    // reload on the QK page like a returning user, then click
    await page.reload()
    // message rows open tree2 on click
    const messageRow = page.locator('p[class*="styledA"]').first()
    await expect(messageRow).toBeVisible({ timeout: 60_000 })
    await messageRow.click()

    // the pane opens — on the message's node, not on pane 1's QK page:
    // it renders no QK message rows and its active path shows the ap
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible({ timeout: 30_000 })
    await expect(pane2.locator('p[class*="styledA"]')).toHaveCount(0)
    await expect(pane2.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })
    // and its tree is expanded down to the node (the pane's
    // ActiveNodeArraySetter seeds the open nodes on mount)
    await expect
      .poll(async () => pane2.locator('[data-url]').count())
      .toBeGreaterThan(1)
  })

  test('a QK message opens tree2 at its node after warm navigation (no reload)', async ({
    page,
  }) => {
    // regression: between the message click setting the pane path and the
    // tab-opening navigation committing, the router is briefly idle with
    // no tree2 tabs — the reset branch of the derive effect wiped the
    // just-set path in that gap and the pane re-derived pane 1's (QK)
    // location instead of the message's node
    test.setTimeout(120_000)
    // tree rows carry their node url as JSON in data-url; clicking via the
    // label span is immune to the layout shifts of a settling page
    const waitForTreeRow = (pattern: RegExp) =>
      page.waitForFunction(
        (source) => {
          const re = new RegExp(source)
          return [...document.querySelectorAll('[data-url]')].some((r) =>
            re.test(r.dataset.url ?? ''),
          )
        },
        pattern.source,
        { timeout: 30_000 },
      )
    const clickTreeRow = (pattern: RegExp) =>
      page.evaluate((source) => {
        const re = new RegExp(source)
        const rows = [...document.querySelectorAll<HTMLElement>('[data-url]')]
        const row = rows.find((r) => re.test(r.dataset.url ?? ''))
        ;(row?.querySelector('[class*="label"]') ?? row)?.click()
      }, pattern.source)

    await page.goto('/Daten/Projekte')
    await waitForTreeRow(/^\["Projekte","[0-9a-f-]{36}"\]$/)
    await clickTreeRow(/^\["Projekte","[0-9a-f-]{36}"\]$/)
    await expect(page).toHaveURL(/\/Daten\/Projekte\/[0-9a-f-]{36}/, {
      timeout: 30_000,
    })

    // open the project's 'Arten' folder, then its first art
    await waitForTreeRow(/,"Arten"\]$/)
    await clickTreeRow(/,"Arten"\]$/)
    await expect(page).toHaveURL(/\/Arten(\?|\/|$)/, { timeout: 30_000 })
    await waitForTreeRow(/,"Arten","[0-9a-f-]{36}"\]$/)
    await clickTreeRow(/,"Arten","[0-9a-f-]{36}"\]$/)
    await expect(page).toHaveURL(/Arten\/[0-9a-f-]{36}/, { timeout: 30_000 })

    // warm-open the QK page through the tree, like a user browsing there
    await waitForTreeRow(/,"Qualitätskontrollen"\]$/)
    await clickTreeRow(/,"Qualitätskontrollen"\]$/)
    await expect(page).toHaveURL(/Qualit(%C3%A4|ä)tskontrollen/, {
      timeout: 30_000,
    })

    const messageRow = page.locator('p[class*="styledA"]').first()
    await expect(messageRow).toBeVisible({ timeout: 60_000 })

    // give the QK form a marker and a distinctive year: opening the pane
    // switches the workspace into the split layout — the form's DOM and
    // state must survive that switch (regression: it used to remount,
    // resetting state and refetching)
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('#berichtjahr')
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      nativeSetter?.call(input, '1999')
      input?.dispatchEvent(new Event('input', { bubbles: true }))
      input?.closest('div')?.setAttribute('data-marker', 'qk-survives')
    })
    await expect(page.locator('#berichtjahr')).toHaveValue('1999')

    await messageRow.click()

    // the pane opens on the message's node: it renders the target form,
    // not a duplicate of the QK message list
    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2).toBeVisible({ timeout: 30_000 })
    await expect(pane2.locator('p[class*="styledA"]')).toHaveCount(0)
    // and its tree is expanded down to the node — the pane's
    // ActiveNodeArraySetter derives the node from the pane router's
    // pathname on mount, seeding the open nodes (regression: the open
    // action used to pre-set the node, suppressing the seeding)
    await expect
      .poll(async () => pane2.locator('[data-url]').count())
      .toBeGreaterThan(1)
    // pane 1's QK form was not remounted by the layout switch
    await expect(page.locator('[data-marker="qk-survives"]')).toHaveCount(1)
    await expect(page.locator('#berichtjahr')).toHaveValue('1999')
    // the appbar tabs survive the pane opening, and the inactive buttons
    // keep their white text: the pane prepends its emotion styles
    // (StyledEngineProvider injectFirst); without it they were appended
    // after the app's css modules and turned the inactive buttons
    // theme-green — invisible on the green bar
    await expect(page.locator('button[data-id="nav-daten2"]')).toBeVisible()
    await expect
      .poll(async () =>
        page.evaluate(() =>
          getComputedStyle(
            document.querySelector('button[data-id="nav-filter1"]'),
          ).color,
        ),
      )
      .toBe('rgb(255, 255, 255)')
  })

  test('navigating pane 1 does not reload tree2', async ({ page }) => {
    await page.goto('/Daten/Projekte')
    await page.locator('[data-id="nav-tree2"]').click()

    const pane2 = page.locator('[data-id="tree2-pane"]')
    await expect(pane2.getByText('AP Flora Kt. Zürich')).toBeVisible({
      timeout: 30_000,
    })

    // mark the pane's DOM node: the pane is only reloaded if this
    // element disappears (separate React root, no remounts)
    await page.evaluate(() => {
      const pane = document.querySelector('[data-id="tree2-pane"]')
      pane?.setAttribute('data-marker', 'survives')
    })

    // navigate pane 1 by clicking in ITS tree (formerly every pane-1
    // navigation re-set the iframe src and reloaded the whole second app)
    // pane 1's tree is the first of the two in the DOM
    await page.getByText('AP Flora Kt. Zürich').first().click()
    await expect(page.getByText('Arten').first()).toBeVisible({
      timeout: 30_000,
    })

    await expect(
      page.locator('[data-id="tree2-pane"][data-marker="survives"]'),
    ).toBeVisible()
    await expect(
      page.locator('[data-id="tree2-pane"]').getByText('AP Flora Kt. Zürich'),
    ).toBeVisible({ timeout: 30_000 })
  })
})
