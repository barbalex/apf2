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
├── auth/login.spec.ts           # 8 tests: login, validation
├── forms/
│   ├── aktionsplan.spec.ts      # 6 tests
│   ├── population.spec.ts       # 8 tests
│   ├── teil-population.spec.ts  # 9 tests
│   └── ...                      # 7 more form suites
└── all.spec.ts                  # Original navigation tests
```

## Troubleshooting

**❌ "Cannot find module './playwright/.auth/user.json'"**
→ Create the file: `cp playwright/.auth/user.json.example playwright/.auth/user.json`

**❌ Tests timeout**
→ Make sure `npm run dev` is running in another terminal

**❌ Authentication fails**
→ Check credentials in `playwright/.auth/user.json`

**❌ Need to see what's happening**
→ Use `npm run test:headed` or `npm run test:ui`

## Next Steps

✅ Tests migrated from Cypress to Playwright  
✅ Core forms covered (10 test suites)  
✅ Authentication setup  

**You can now:**
- Delete Cypress: `rm -rf cypress/ cypress.config.cjs`
- Add more tests as needed
- Integrate with CI/CD

See [MIGRATION.md](MIGRATION.md) for full details.
