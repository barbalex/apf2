import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('http://localhost:5173/')
await page.evaluate((items) => { for (const { name, value } of items) localStorage.setItem(name, value) },
  JSON.parse((await import('node:fs')).readFileSync('playwright/.auth/user.json', 'utf8')).origins[0].localStorage)
const t0 = Date.now()
await page.goto('http://localhost:5173/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903/AP-Berichte/019ada83-4303-7b04-80a8-ebed269b8fd5/print', { waitUntil: 'domcontentloaded' })
while (Date.now() - t0 < 90000) {
  const h3 = await page.evaluate(() => document.querySelectorAll('h3').length).catch(() => -1)
  if (h3 > 400) break
  await page.waitForTimeout(1000)
}
await page.waitForTimeout(1000)
// Chrome-like default margins (~1cm), A4
writeFileSync('/tmp/repro.pdf', await page.pdf({ format: 'A4', margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' } }))
console.log('pdf written')
await browser.close()
