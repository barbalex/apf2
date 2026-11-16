import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3 })
await page.goto('http://localhost:5173/')
await page.evaluate((items) => { for (const { name, value } of items) localStorage.setItem(name, value) },
  JSON.parse((await import('node:fs')).readFileSync('playwright/.auth/user.json', 'utf8')).origins[0].localStorage)
await page.goto('http://localhost:5173/Daten/Benutzer/00000000-0000-7c49-8996-6298127bac0d/EKF/2026/019d3da7-0edc-7d50-84f0-367b4ff8709e', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('a:has-text("Normal-Ansicht")', { timeout: 60000 })
await page.waitForTimeout(1500)
const m = await page.evaluate(() => {
  const p = document.querySelector('p[class*="jahr"]')
  const cs = getComputedStyle(p)
  const b = p.getBoundingClientRect()
  return { lineHeight: cs.lineHeight, margin: cs.margin, height: +b.height.toFixed(1), top: +b.top.toFixed(1), center: +(b.top + b.height / 2).toFixed(1) }
})
const box = await page.evaluate(() => {
  const j = document.querySelector('p[class*="jahr"]').getBoundingClientRect()
  const n = [...document.querySelectorAll('a.MuiButton-root')].find((a) => a.textContent.includes('Normal'))
  const nb = n.getBoundingClientRect()
  const left = Math.min(j.left, nb.left) - 10, right = Math.max(j.right, nb.right) + 10
  return { x: left, y: 0, width: right - left, height: 45 }
})
const shot = await page.screenshot({ clip: box })
writeFileSync('/tmp/ekfzoom3.png', shot)
console.log(JSON.stringify(m))
await browser.close()
