import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:5173/')
await page.evaluate((items) => { for (const { name, value } of items) localStorage.setItem(name, value) },
  JSON.parse((await import('node:fs')).readFileSync('playwright/.auth/user.json', 'utf8')).origins[0].localStorage)
await page.goto('http://localhost:5173/Daten/Benutzer/00000000-0000-7c49-8996-6298127bac0d/EKF/2026/019d3da7-0edc-7d50-84f0-367b4ff8709e', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('a:has-text("Normal-Ansicht")', { timeout: 60000 })
await page.waitForTimeout(1500)
await page.evaluate(() => {
  const p = document.querySelector('p[class*="jahr"]')
  p.style.cssText = 'margin:0;color:white;font-size:14px;line-height:1.1875;'  // MUI button text metrics
})
await page.waitForTimeout(300)
const shot = await page.screenshot({ clip: { x: 880, y: 0, width: 400, height: 90 } })
writeFileSync('/tmp/final_align.png', shot)
console.log('shot saved')
await browser.close()
