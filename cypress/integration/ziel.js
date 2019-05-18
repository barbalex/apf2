/* eslint-disable no-undef */

describe('Ziel form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Ziele/1/b41cdf2a-3cf9-11e8-b0c5-fff3a8fbb9e5?feldkontrTab=entwicklung&projekteTabs=tree&projekteTabs=daten',
    )
  })
  it('has Title Ziel', () => {
    cy.get('[data-id=form-title]').should('contain', 'Ziel')
  })
  it('updates jahr', () => {
    const typedText = '1'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates typ', () => {
    cy.get('[data-id=typ_1170775556] input')
      .check()
      .get('[data-id=typ_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates ziel', () => {
    const typedText = 'test'
    cy.get('#bezeichnung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
