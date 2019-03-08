/* eslint-disable no-undef */

describe('assoziierte Art form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/assoziierte-Arten/72c7d9a5-3cf8-11e8-b0c5-4ffc78512aac',
    )
  })
  it('has Title assoziierte Art', () => {
    cy.get('[data-id=form-title]').should('contain', 'assoziierte Art')
  })
  it('updates Art 1', () => {
    cy.setSelectTopOption({
      selector: '[data-id=assozart] [data-id=aeId]',
      option: 'Abies a',
      value: '1ab6bbb1-979a-4232-a5d8-62efb5cb984a',
    })
  })
  it('updates Bemerkungen', () => {
    const typedText = 'test bemerkungen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
})
