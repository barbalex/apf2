# 🚀 Quick Start - Playwright Tests

## Setup (One-time)

1. **Create auth credentials file:**

   ```bash
   cp playwright/.auth/user.json.example playwright/.auth/user.json
   ```

2. **Edit with your credentials:**

   ```bash
   nano playwright/.auth/user.json
   ```

   ```json
   {
     "name": "your-username",
     "password": "your-password"
   }
   ```

3. **Ensure dev server is running** (in another terminal):
   ```bash
   npm run dev
   ```

## Run Tests

```bash
# All tests
npm test

# Interactive UI mode (recommended!)
npm run test:ui

# See browser while testing
npm run test:headed

# Specific test file
npx playwright test tests/forms/population.spec.ts

# View last report
npm run test-report
```

## Common Commands

```bash
# Debug mode with pause
npx playwright test --debug

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run tests matching pattern
npx playwright test population

# Update snapshots (if using visual tests)
npx playwright test --update-snapshots
```

## Test Structure

```
tests/
├── auth/                         # login, password helper, dead-session logout
├── ekplan/                       # EkPlan header filters
├── forms/aktionsplan.spec.ts     # form validation
├── prefetch/                     # route data prefetch
├── tree2/                        # second-tree pane
└── auth.setup.ts                 # login → storageState
```

API-level role/permission tests live in [api-tests/](api-tests/) — run with
`npm run test:api` (needs the local backend: `docker compose -f backend-dev/docker-compose.yml up -d`).

## Troubleshooting

**❌ "Cannot find module './playwright/.auth/user.json'"**
→ Create the file: `cp playwright/.auth/user.json.example playwright/.auth/user.json`

**❌ Tests timeout**
→ Make sure `npm run dev` is running in another terminal

**❌ Authentication fails**
→ Check credentials in `playwright/.auth/user.json` (must be a user of the local dev db)

**❌ Tests suddenly meet the Anmeldung dialog**
→ The auth token expired (24 h): `node scripts/refresh-auth-state.mjs` (needs the local backend on :3000)

**❌ Need to see what's happening**
→ Use `npm run test:headed` or `npm run test:ui`

## CI

E2E does not run in CI (`.github/workflows/playwright.yml` is disabled on
purpose — it would need the backend stack and real credentials). CI runs lint,
typecheck, unit tests and selects freshness.

See [MIGRATION.md](MIGRATION.md) for the Cypress → Playwright migration details.
