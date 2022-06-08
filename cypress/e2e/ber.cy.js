/* eslint-disable no-undef */

describe('Bericht form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Berichte/2e5d097b-3cbe-11e8-b0c5-3feaa0b4b947',
    ).wait(2000)
  })
  it('has Title Bericht', () => {
    cy.get('[data-id=form-title]').should('contain', 'Bericht')
  })
  it('shows testdata-message', () => {
    cy.get('[data-id=testdata-message]').should('contain', 'Test-Aktionsplan')
  })
  it('updates autor', () => {
    const typedText = 'test'
    cy.get('#autor')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates jahr', () => {
    const typedText = '2000'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates titel', () => {
    const typedText = 'test'
    cy.get('#titel')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates url', () => {
    const typedText = 'https://apflora.ch'
    cy.get('#url')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
