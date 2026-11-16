import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
await page.goto('http://localhost:5173/')
await page.evaluate((items) => { for (const { name, value } of items) localStorage.setItem(name, value) },
  JSON.parse((await import('node:fs')).readFileSync('playwright/.auth/user.json', 'utf8')).origins[0].localStorage)
await page.goto('http://localhost:5173/Daten/Benutzer/00000000-0000-7c49-8996-6298127bac0d/EKF/2026/019d3da7-0edc-7d50-84f0-367b4ff8709e', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('a:has-text("Normal-Ansicht")', { timeout: 60000 })
await page.waitForTimeout(1500)

const label = page.locator('p[class*="jahr"]')
const variants = [
  { name: 'as-served', css: '' },
  { name: 'nudge-2', css: 'position:relative;top:-2px;' },
  { name: 'nudge-3', css: 'position:relative;top:-3px;' },
  { name: 'nudge-4', css: 'position:relative;top:-4px;' },
  { name: 'nudge-5', css: 'position:relative;top:-5px;' },
]
for (const v of variants) {
  await label.evaluate((el, css) => { el.style.cssText = 'margin:0;color:white;' + css }, v.css)
  await page.waitForTimeout(300)
  const r = await page.evaluate(() => {
    const rl = document.querySelector('p[class*="jahr"]').getBoundingClientRect()
    const ri = document.querySelector('input[type="number"]').getBoundingClientRect()
    return { lx: Math.round(rl.left), lw: Math.round(rl.width), ix: Math.round(ri.left), iw: Math.round(ri.width) }
  })
  const shot = await page.screenshot({ clip: { x: r.lx - 5, y: 0, width: r.ix + r.iw - r.lx + 10, height: 45 } })
  const fn = `/tmp/cal_${v.name}.png`
  writeFileSync(fn, shot)
  console.log(JSON.stringify({ variant: v.name, ...r, file: fn }))
}
await browser.close()
