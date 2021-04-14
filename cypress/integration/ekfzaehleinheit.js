/* eslint-disable no-undef */

describe('EK-Zähleinheit form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/EK-Zähleinheiten/bf940388-b28d-11e8-ae88-73ea713f4a92',
    ).wait(1500)
  })
  it('has Title EK-Zähleinheit', () => {
    cy.get('[data-id=form-title]').should('contain', 'EK-Zähleinheit')
  })
  it('shows testdata-message', () => {
    cy.get('[data-id=testdata-message]').should('contain', 'Test-Aktionsplan')
  })
  it.skip('updates Zähleinheit', () => {
    cy.setSelectOption({
      selector: '[name=zaehleinheitId]',
      option: 'Blätter',
      value: 'ddf9e94b-3dc8-11e8-acca-23ae4dc9b8b9',
    })
    cy.get('#bemerkungen').focus()
  })
  it('updates zielrelevant', () => {
    cy.get('[data-id=zielrelevant] input')
      .check()
      .get('[data-id=zielrelevant] input')
      .check()
      .should('be.checked')
  })
  it('updates sort', () => {
    const typedText = '2'
    cy.get('#sort')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Bemerkungen', () => {
    const typedText = 'test bemerkungen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
})
