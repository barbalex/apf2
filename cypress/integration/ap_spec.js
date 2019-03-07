/* eslint-disable no-undef */

describe('ap form', function() {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640',
    )
    /*
    Example of how to use idb, store or client 
    cy.window()
      .its('__idb__')
      .then(idb => {
        idb.currentUser.clear()
        window.location.reload(false)
      })
    */
  })
  it('updates bearbeitung Aktionsplan', () => {
    cy.get('[data-id=bearbeitung_0] input')
      .check()
      .get('[data-id=bearbeitung_4] input')
      .check()
      .should('have.value', '4')
  })
  it('updates Start im Jahr', () => {
    const typedText = '2005'
    cy.get('[name=startJahr]')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it.only('updates Stand Umsetzung', () => {
    cy.get('[data-id=umsetzung_0] input')
      .check()
      .get('[data-id=umsetzung_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates Bester Beobachtungszeitpunkt für EKF', () => {
    const typedText = 'test'
    cy.get('[name=ekfBeobachtungszeitpunkt]')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates ap Abies alba', function() {
    cy.contains('kein Eintrag').click()
    cy.contains('kein AP').click()
  })
})
