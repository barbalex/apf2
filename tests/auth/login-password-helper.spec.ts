import { test, expect, type Page } from '@playwright/test'
import loginData from '../../playwright/.auth/user.json' with { type: 'json' }

// Regression test for #823: a password helper fills the inputs
// without focus or change events. The login must use the values
// in the fields, not stale React state.

// Run without authenticated state
test.use({ storageState: { cookies: [], origins: [] } })

async function openLoginPage(page: Page) {
  await page.goto('/Daten/')
  await page.evaluate(() => {
    localStorage.clear()
    indexedDB.deleteDatabase('apflora')
  })
  await page.reload()
  await expect(page.locator('#dialog-title')).toBeVisible()
}

test.describe('User login with password helper', () => {
  test('logs in when a password helper set the values without blur', async ({
    page,
  }) => {
    await openLoginPage(page)

    // an outdated password was typed and blurred: React state holds it
    await page.getByLabel('Name').fill(loginData.name)
    await page.getByLabel('Passwort').fill('outdated password')
    await page.getByLabel('Passwort').blur()
    await page.getByLabel('Name').blur()

    // the password helper overwrites both fields directly in the dom,
    // without focus, change or blur events
    await page.evaluate(([name, password]) => {
      const setValue = (el: HTMLInputElement, value: string) => {
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        )!.set!
        setter.call(el, value)
      }
      setValue(
        document.querySelector('#name') as HTMLInputElement,
        name as string,
      )
      setValue(
        document.querySelector('#passwort') as HTMLInputElement,
        password as string,
      )
    }, [loginData.name, loginData.password])

    // clicking anmelden blurs fields - only the button click may log in
    await page.getByRole('button', { name: /anmelden/i }).click()

    await expect(page.locator('#dialog-title')).not.toBeVisible()
  })
})
