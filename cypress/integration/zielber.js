/* eslint-disable no-undef */

describe('Ziel-Bericht form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Ziele/1/b41cdf2a-3cf9-11e8-b0c5-fff3a8fbb9e5/Berichte/55281b5e-3d19-11e8-acca-a33b745c6fd1?feldkontrTab=entwicklung&projekteTabs=tree&projekteTabs=daten',
    ).wait(1000)
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
