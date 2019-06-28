/* eslint-disable no-undef */

describe('Kontroll-Bericht Population form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Kontroll-Berichte/e72b6e29-3e7b-11e8-acca-abd5ccebb432',
    ).wait(2000)
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should(
      'contain',
      'Kontroll-Bericht Population',
    )
  })
  it('updates jahr', () => {
    const typedText = '2000'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates entwicklung', () => {
    cy.get('[data-id=entwicklung_3] input')
      .check()
      .get('[data-id=entwicklung_2] input')
      .check()
      .should('have.value', '2')
  })
  it('updates bemerkungen', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
