import { defineConfig } from 'vitest/config'

// api tests against the local backend:
//   docker compose -f backend-dev/docker-compose.yml up -d
//   npm run test:api
// deliberately separate from the default `npm test` run: these tests
// need docker + the local backend and must not run in CI.
export default defineConfig({
  test: {
    include: ['api-tests/**/*.test.ts'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
})
