/* eslint-disable no-undef */

describe('EKF-Zähleinheit form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/EKF-Zähleinheiten/bf940388-b28d-11e8-ae88-73ea713f4a92',
    )
  })
  it('has Title EKF-Zähleinheit', () => {
    cy.get('[data-id=form-title]').should('contain', 'EKF-Zähleinheit')
  })
  it('shows testdata-message', () => {
    cy.get('[data-id=testdata-message]').should('contain', 'Test-Aktionsplan')
  })
  it('updates Zähleinheit', () => {
    cy.setSelectOption({
      selector: '[data-id=zaehleinheitId]',
      option: 'Blätter',
      value: 'ddf9e94b-3dc8-11e8-acca-23ae4dc9b8b9',
    })
    cy.get('#bemerkungen').focus()
  })
  it('updates Bemerkungen', () => {
    const typedText = 'test bemerkungen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
})
