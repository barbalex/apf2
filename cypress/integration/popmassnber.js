/* eslint-disable no-undef */

describe('Massnahmen-Bericht Population form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Massnahmen-Berichte/e7829ffa-3e7b-11e8-acca-73a0531b7aa4',
    )
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should(
      'contain',
      'Massnahmen-Bericht Population',
    )
  })
  it('updates jahr', () => {
    const typedText = '1'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates entwicklung', () => {
    cy.get('[data-id=beurteilung_3] input')
      .check()
      .get('[data-id=beurteilung_2] input')
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
