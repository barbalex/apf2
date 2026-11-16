import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
await page.goto('http://localhost:5173/')
await page.evaluate((items) => { for (const { name, value } of items) localStorage.setItem(name, value) },
  JSON.parse((await import('node:fs')).readFileSync('playwright/.auth/user.json', 'utf8')).origins[0].localStorage)
await page.goto('http://localhost:5173/Daten/Benutzer/00000000-0000-7c49-8996-6298127bac0d/EKF/2026/019d3da7-0edc-7d50-84f0-367b4ff8709e', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('a:has-text("Normal-Ansicht")', { timeout: 60000 })
await page.waitForTimeout(2000)
const regions = await page.evaluate(() => {
  const r = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.left), w: Math.round(b.width) } }
  const n = [...document.querySelectorAll('a.MuiButton-root')].find((a) => a.textContent.includes('Normal'))
  return {
    label: r(document.querySelector('p[class*="jahr"]')),
    input: r(document.querySelector('input[type="number"]')),
    button: r(n),
  }
})
const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1280, height: 45 } })
writeFileSync('/tmp/ekfbarpix.png', shot)
console.log(JSON.stringify(regions))
await browser.close()
