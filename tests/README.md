# Playwright Test Migration from Cypress

This directory contains tests migrated from Cypress to Playwright.

## Structure

- `auth/` - Authentication and login tests (run without authenticated state)
- `forms/` - Form validation and data entry tests (run with authenticated state)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/forms/population.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium

# Show test report
npm run test-report
```

## Migration Notes

### Key Changes from Cypress

1. **Locators**: Cypress selectors (`cy.get()`) → Playwright locators (`page.locator()`)
2. **Auto-waiting**: Playwright has better auto-waiting built-in
3. **Assertions**: `should()` → `expect()` with `toContainText()`, `toHaveValue()`, etc.
4. **Auth**: Uses Playwright's `storageState` for session persistence
5. **Parallel execution**: Tests run in parallel by default

### Common Patterns

```typescript
// Cypress
cy.get('#input').clear().type('text').blur().should('have.value', 'text')

// Playwright
const input = page.locator('#input')
await input.clear()
await input.fill('text')
await input.blur()
await expect(input).toHaveValue('text')
```

## Test Coverage

Migrated tests cover:
- ✅ User authentication
- ✅ Aktionsplan form
- ✅ Population form
- ✅ Teil-Population form
- ✅ Erfolgs-Kriterium form
- ✅ Feldkontrolle form
- ✅ Massnahme form
- ✅ Idealbiotop form
- ✅ Ziel form
- ✅ Projekt form

## TODO

Additional forms from Cypress that could be migrated:
- AP-Bericht
- Beobachtung
- Freiwilligen-Kontrolle
- Massnahmen-Bericht
- Kontroll-Bericht
- And more...
