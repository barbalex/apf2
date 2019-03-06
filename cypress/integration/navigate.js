/* eslint-disable no-undef */

describe('Navigation', function() {
  it('home opens Projekt', function() {
    cy.visit('http://localhost:3000')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
  })
  it('hides Strukturbaum', function() {
    cy.visit('http://localhost:3000')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    cy.get('.nav-strukturbaum').click()
  })
  it('shows Strukturbaum', function() {
    cy.visit('http://localhost:3000')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    cy.get('.nav-strukturbaum').click()
  })
  it('opens Aktionspläne', function() {
    cy.visit('http://localhost:3000')
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    cy.contains('Aktionspläne').click()
    cy.contains('Abies alba Mill.').click()
  })
})
