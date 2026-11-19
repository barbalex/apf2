import { test, expect } from '@playwright/test'

// Issue 847: Ziel-Einheit: Anzahl von Anpflanzungen wird automatisch gesetzt —
// durch den DB-Trigger tpopmassn_set_zieleinheit. Das Formular holt das
// Ergebnis nach dem Speichern der steuernden Felder ab.
// Massnahme 01a1ca5c-de83-7639-9a37-d6e95af465e2 ist eine Anpflanzung
// (Typ 2) mit Ziel-Einheit «Triebe total» (Korrespondenz anz_triebe),
// ohne anz_triebe und ohne anzahl.

const massnUrl =
  '/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903/Arten/017d3472-d75d-7157-8735-aa46b1793455/Populationen/017da465-b407-7c70-8fc4-a2697ecc8743/Teil-Populationen/01a1ca4d-db4d-7622-93f1-bbccc25321d5/Massnahmen/01a1ca5c-de83-7639-9a37-d6e95af465e2/Massnahme'

test.describe('Massnahme form', () => {
  test('sets Ziel-Einheit: Anzahl automatically for Anpflanzungen (#847)', async ({
    page,
  }) => {
    await page.goto(massnUrl)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('[data-id=form-title]')).toContainText(
      'Massnahme',
    )
    await expect(page.locator('[data-id=typ_2] input')).toBeChecked()
    // Ziel-Einheit fields are shown, Anzahl is empty
    await expect(page.locator('#zieleinheitAnzahl')).toHaveValue('')

    // Anzahl Triebe speichern -> Anzahl follows via trigger + refetch
    const anzTriebe = page.locator('#anzTriebe')
    await anzTriebe.fill('5')
    await anzTriebe.blur()
    await expect(page.locator('#zieleinheitAnzahl')).toHaveValue('5')

    // cleanup: clear again -> Anzahl follows back to empty
    await anzTriebe.fill('')
    await anzTriebe.blur()
    await expect(page.locator('#zieleinheitAnzahl')).toHaveValue('')
  })
})
