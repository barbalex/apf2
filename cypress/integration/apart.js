/* eslint-disable no-undef */

describe('AP-Art form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Arten/5a352ce4-434a-11e8-ab21-77b63628c0b5',
    ).wait(1500)
  })
  it('has Title Aktionsplan-Art', () => {
    cy.get('[data-id=form-title]').should('contain', 'Aktionsplan-Art')
  })
  it('updates Art', () => {
    cy.setSelectOption({
      selector: '[data-id=artId]',
      option: 'Abi',
      value: '1ab6bbb1-979a-4232-a5d8-62efb5cb984a',
    })
  })
})
