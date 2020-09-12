/* eslint-disable no-undef */

describe('Teil-Population form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555',
    ).wait(1500)
  })
  it('opens EK', () => {
    cy.get('[data-id=ek]').click()
  })
  it('updates ekfrequenz', () => {
    cy.get('[data-id=ekfrequenz_GA] input')
      .check()
      .get('[data-id=ekfrequenz_GB] input')
      .check()
      .should('have.value', 'GB')
  })
  it('updates ekfrequenzAbweichend', () => {
    cy.get('[data-id=ekfrequenzAbweichend] input')
      .check()
      .get('[data-id=ekfrequenzAbweichend] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates ekAbrechnungstyp', () => {
    cy.get('[data-id=ekAbrechnungstyp_a] input')
      .check()
      .get('[data-id=ekAbrechnungstyp_b] input')
      .check()
      .should('have.value', 'b')
  })
})
