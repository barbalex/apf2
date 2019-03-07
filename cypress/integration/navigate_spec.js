/* eslint-disable no-undef */

describe('Navigation', () => {
  it('home directly opens Projekt', () => {
    cy.visit('/')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
  })
  it('hides Strukturbaum', () => {
    cy.visit('/')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    cy.get('.nav-strukturbaum').click()
  })
  it('opens Aktionsplan Abies alba', () => {
    cy.visit('/')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    cy.contains('Aktionspläne').click()
    cy.contains('Abies alba Mill.').click()
  })
})
