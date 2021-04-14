/* eslint-disable no-undef */

describe('Adresse form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/AP-Berichte/15e116db-3cb0-11e8-b0c5-fb9823ff7051',
    )
  })
  it('has Title AP-Bericht', () => {
    cy.get('[data-id=form-title]').should(
      'contain',
      'AP-Bericht Jahresübersicht',
    )
  })
  it('updates Bemerkungen', () => {
    const typedText = `Zusammenfassende Beurteilung
    Im Jahr 2006 wurden...`
    cy.get('#bemerkungen')
      .find('textarea')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
})
