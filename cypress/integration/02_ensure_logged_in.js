/* eslint-disable no-undef */
const secrets = require('../../secrets.json')

describe('ensure logged in', () => {
  it('log in', () => {
    cy.visit('/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    cy.get('body').then((body) => {
      if (body.find('#dialog-title').length > 0) {
        cy.get('#name').type(secrets.user)
        cy.get('#passwort').type(secrets.pass)
        cy.contains('anmelden').click()
      }
      cy.get('body').should('not.contain', '#dialog-title')
    })
  })
})
