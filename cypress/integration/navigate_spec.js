/* eslint-disable no-undef */

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('home directly opens Projekt', () => {
    cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
  })
  it('opens Aktionsplan Abies alba', () => {
    cy.visit('/')
      .url()
      .should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
      .get(
        '[data-url=\'["Projekte","e57f56f4-4376-11e8-ab21-4314b6749d13","Aktionspläne"]\']',
      )
      .click()
      .get(
        '[data-url=\'["Projekte","e57f56f4-4376-11e8-ab21-4314b6749d13","Aktionspläne","6c52d174-4f62-11e7-aebe-67a303eb0640"]\']',
      )
      .click()
      .get('[data-id=form-title]')
      .should('contain', 'Aktionsplan')
  })
  it('toggles Strukturbaum', () => {
    cy.get('[data-id=tree-container]')
      .should('exist')
      .get('[data-id=nav-strukturbaum]')
      .click()
      .get('[data-id=tree-container]')
      .should('not.exist')
      .get('[data-id=nav-strukturbaum]')
      .click()
  })
  it.only('toggles Daten', () => {
    cy.get('[data-id=daten-container]')
      .should('exist')
      .get('[data-id=nav-daten1]')
      .click()
      .get('[data-id=daten-container]')
      .should('not.exist')
      .get('[data-id=nav-daten1]')
      .click()
  })
})
