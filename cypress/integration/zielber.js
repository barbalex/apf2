/* eslint-disable no-undef */

describe('Ziel-Bericht form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Ziele/1/609d6760-14db-11e9-97a0-1f2adbd510e6/Berichte/64acf1ea-14db-11e9-97a0-8fed09952fd8',
    )
  })
  it('has Title Ziel-Bericht', () => {
    cy.get('[data-id=form-title]').should('contain', 'Ziel-Bericht')
  })
  it('updates jahr', () => {
    const typedText = '1'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates erreichung', () => {
    const typedText = 'test'
    cy.get('#erreichung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bemerkungen', () => {
    const typedText = 'test'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
