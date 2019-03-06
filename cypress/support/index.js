// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands'

const secrets = require('../../secrets.json')

// Alternatively you can use CommonJS syntax:
// require('./commands')
/*
describe('Navigation', function() {
  it('logs in', function() {
    cy.visit('http://localhost:3000')
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
  })
})*/
