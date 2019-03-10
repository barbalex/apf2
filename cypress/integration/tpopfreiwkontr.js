/* eslint-disable no-undef */

describe('Teil-Population Freiwilligen-Kontrolle form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Freiwilligen-Kontrollen/d5af417f-ad1e-11e8-ae87-07d9a3b28c64',
    )
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should('contain', 'Freiwilligen-Kontrolle')
  })
  it('updates bearbeiter', () => {
    cy.setSelectOption({
      selector: '[data-id=bearbeiter]',
      option: 'Test Tester',
      value: 'd40729c0-a6a9-11e8-b9bc-eba63e5fd6c7',
    })
    cy.get('#bemerkungen').focus()
  })
  it('has filter icon', () => {
    cy.get('[data-id=daten-filtern]').should('exist')
  })
  it('opens filter form', () => {
    cy.get('[data-id=daten-filtern]')
      .click()
      .get('[data-id=form-title]')
      .should('contain', 'Filter')
  })
  it('closes filter form', () => {
    cy.get('[data-id=daten-anzeigen]')
      .click()
      .get('[data-id=form-title]')
      .should('not.contain', 'Filter')
  })
})
