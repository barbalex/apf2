/* eslint-disable no-undef */
const secrets = require('../../secrets.json')

describe('AppBar', () => {
  beforeEach(() => {
    cy.visit('/Daten/')
    /*
    Example of how to use idb, store or client 
    cy.window()
      .its('__idb__')
      .then(idb => {
        idb.currentUser.clear()
        window.location.reload(false)
      })
    */
  })
  it('logs out correctly', () => {
    cy.get('[data-id=appbar-more]').click()
    cy.get('[data-id=appbar-more-logout]').click()
    cy.get('#name').should('exist')
  })
  it('logs back in correctly', () => {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('#name').should('not.exist')
  })
})
