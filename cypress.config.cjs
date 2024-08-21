const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl2: 'https://apflora.ch',
  numTestsKeptInMemory: 20,
  viewportHeight: 1200,
  viewportWidth: 1600,
  retries: 2,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8000',
  },
})
