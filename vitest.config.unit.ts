import { defineConfig } from 'vitest/config'

// unit tests: pure logic in src (store filter cascade, modules helpers)
//   npm run test:unit
// node environment is enough — browser globals the store touches at module
// scope (localStorage) are stubbed in the setup file below
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('0.0.0-test'),
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['./src/testing/localStorageStub.ts'],
  },
})
