/* eslint-disable no-undef */

describe('Erfolgs-Kriterien form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Erfolgskriterien/124b46ae-3cc3-11e8-b0c5-8b5949b25bb7',
    ).wait(1000)
  })
  it('has Title Erfolgs-Kriterium', () => {
    cy.wait(3000)
      .get('[data-id=form-title]')
      .should('contain', 'Erfolgs-Kriterium')
  })
  it('updates Beurteilung', () => {
    cy.get('[data-id=erfolg_4] input')
      .check()
      .get('[data-id=erfolg_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates kriterien', () => {
    const typedText = 'test'
    cy.get('#kriterien')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
