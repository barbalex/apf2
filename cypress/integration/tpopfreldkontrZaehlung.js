/* eslint-disable no-undef */

describe('Feldkontrolle Zählung form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Feld-Kontrollen/68364eb3-8be6-11e7-a848-0b73d4b76fcd/Zaehlungen/e51efd98-6895-11e8-ab80-f774f9b8aead',
    ).wait(2000)
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should('contain', 'Zählung')
  })
  it.skip('updates einheit', () => {
    cy.setSelectOption({
      selector: '[data-id=einheit]',
      option: 'Keimlinge',
      value: '5',
    })
    cy.get('#anzahl').focus()
  })
  it('updates anzahl', () => {
    const typedText = '5'
    cy.get('#anzahl')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates methode', () => {
    cy.get('[data-id=methode_1] input')
      .check()
      .get('[data-id=methode_2] input')
      .check()
      .should('have.value', '2')
  })
})
