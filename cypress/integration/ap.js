/* eslint-disable no-undef */

describe('Aktionsplan form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640',
    ).wait(1500)
    // TODO: should create new dataset
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
  it('has Title Aktionsplan', () => {
    cy.get('[data-id=form-title]').should('contain', 'Aktionsplan')
  })
  it('shows testdata-message', () => {
    cy.get('[data-id=testdata-message]').should('contain', 'Test-Aktionsplan')
  })
  it('updates Art', () => {
    cy.setSelectOption({
      selector: '#artId',
      option: 'Abies a',
      value: '1ab6bbb1-979a-4232-a5d8-62efb5cb984a',
    })
  })
  it('updates bearbeitung Aktionsplan', () => {
    cy.get('[data-id=bearbeitung_1] input')
      .check()
      .get('[data-id=bearbeitung_4] input')
      .check()
      .should('have.value', '4')
  })
  it('updates Start im Jahr', () => {
    const typedText = '2005'
    cy.get('#startJahr').clear().type(typedText).should('have.value', typedText)
  })
  it('updates Stand Umsetzung', () => {
    cy.get('[data-id=umsetzung_0] input')
      .check()
      .get('[data-id=umsetzung_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates Verantwortlich', () => {
    cy.setSelectOption({
      selector: '#bearbeiter',
      option: 'Adrienne Frei',
      value: 'dbc6b98a-4375-11e8-ab21-63812d703dd9',
    })
    cy.get('#ekfBeobachtungszeitpunkt').focus()
  })
  it('updates Bester Beobachtungszeitpunkt für EKF', () => {
    const typedText = 'test'
    cy.get('#ekfBeobachtungszeitpunkt')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('opens info when icon is clicked', () => {
    cy.get('[data-id=bearbeitung-info-icon]').click({ force: true })
    cy.get('[data-id=info-icon-popover]').should('exist')
  })
})
