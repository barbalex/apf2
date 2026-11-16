// Verification for the docs mobile-friendliness fix.
// Run: node scripts/verify-docs-responsive.mjs
import { chromium } from 'playwright'

const base = 'http://localhost:5173'
const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}

const browser = await chromium.launch({
  executablePath:
    '/home/alex/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',
})

// ---------------------------------------------------------------------------
// 1. wide screen: sidebar + content
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1150, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${base}/Dokumentation/was-kann-man-mit-apflora-machen/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('h1')
  const sidebarVisible = await page
    .getByRole('button', { name: 'Technische Voraussetzungen' })
    .first()
    .isVisible()
  check('wide (1150px): sidebar menu visible', sidebarVisible)
  const headerVisible = await page
    .locator('a[aria-label="zur Listenansicht"]')
    .isVisible()
  check('wide (1150px): mobile header hidden', !headerVisible)
  await ctx.close()
}

// ---------------------------------------------------------------------------
// 2. narrow screen (906px, inside the old hysteresis band): no sidebar,
//    header with back link, content full width — regardless of stored mode
// ---------------------------------------------------------------------------
{
  for (const stored of ['true', 'false']) {
    const ctx = await browser.newContext({ viewport: { width: 906, height: 1613 } })
    await ctx.addInitScript((v) => localStorage.setItem('isDesktopView', v), stored)
    const page = await ctx.newPage()
    await page.goto(`${base}/Dokumentation/was-kann-man-mit-apflora-machen/`, { waitUntil: 'networkidle' })
    await page.waitForSelector('h1')
    const sidebarVisible = await page
      .getByRole('button', { name: 'Technische Voraussetzungen' })
      .first()
      .isVisible()
    check(`narrow 906px (stored isDesktopView=${stored}): sidebar hidden`, !sidebarVisible)
    const backLink = page.locator('a[aria-label="zur Listenansicht"]')
    check(
      `narrow 906px (stored isDesktopView=${stored}): back-to-list header visible`,
      await backLink.isVisible(),
    )
    // content must not be clipped: heading box within viewport width
    const h1Box = await page.locator('h1').boundingBox()
    check(
      `narrow 906px (stored isDesktopView=${stored}): heading fits viewport`,
      h1Box.x + h1Box.width <= 906 + 1,
      `right edge ${Math.round(h1Box.x + h1Box.width)}px`,
    )
    // back link leads to the menu list
    await backLink.click()
    await page.waitForURL('**/Dokumentation/')
    const menuItem = page.getByText('Technische Voraussetzungen').first()
    await menuItem.waitFor({ state: 'visible', timeout: 5000 })
    check(`narrow 906px (stored isDesktopView=${stored}): back link opens menu list`, true)
    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// 3. resize across the breakpoints repeatedly: no blank flash
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1150, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${base}/Dokumentation/was-kann-man-mit-apflora-machen/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('h1')

  // mark the content node; it must survive all resizes without remount
  await page.evaluate(() => {
    document.querySelector('h1').setAttribute('data-marker', 'survivor')
  })

  const widths = [850, 1150, 890, 1200, 400, 1150, 906, 1099, 899, 1100]
  let headingAbsentFrames = 0
  let markerLost = false
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 })
    // sample the DOM at high frequency right through the resize transition
    for (let i = 0; i < 12; i++) {
      const present = await page.evaluate(() => {
        const h1 = document.querySelector('h1')
        return Boolean(h1 && h1.textContent.includes('apflora'))
      })
      if (!present) headingAbsentFrames++
      const marked = await page.evaluate(
        () => document.querySelector('h1')?.getAttribute('data-marker') === 'survivor',
      )
      if (!marked) markerLost = true
      await page.waitForTimeout(25)
    }
  }
  check('resize across breakpoints: doc content never disappears', headingAbsentFrames === 0, `${headingAbsentFrames} blank samples`)
  check('resize across breakpoints: content node never remounts', !markerLost)

  // after all the resizing the layout must still be correct for the final width (1100)
  const sidebarVisible = await page
    .getByRole('button', { name: 'Technische Voraussetzungen' })
    .first()
    .isVisible()
  check('after resizes, wide (1100px): sidebar visible again', sidebarVisible)
  await ctx.close()
}

// ---------------------------------------------------------------------------
// 4. true mobile: index renders the list, tapping an item opens the doc
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await page.goto(`${base}/Dokumentation/`, { waitUntil: 'networkidle' })
  const item = page.getByText('Technische Voraussetzungen').first()
  await item.waitFor({ state: 'visible', timeout: 5000 })
  check('mobile 390px: index shows menu list', true)
  await item.click()
  await page.waitForURL('**/Dokumentation/technische-voraussetzungen')
  await page.waitForSelector('h1')
  const backVisible = await page
    .locator('a[aria-label="zur Listenansicht"]')
    .isVisible()
  check('mobile 390px: doc page shows back-to-list header', backVisible)
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
