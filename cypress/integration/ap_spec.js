/* eslint-disable no-undef */

describe('ap form', () => {
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
  it('has Title Aktionsplan', () => {
    cy.get('[data-id=form-title]').should('contain', 'Aktionsplan')
  })
  it('shows testdata-message', () => {
    cy.get('[data-id=testdata-message]').should('contain', 'Test-Aktionsplan')
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
  it('updates Stand Umsetzung', () => {
    cy.get('[data-id=umsetzung_0] input')
      .check()
      .get('[data-id=umsetzung_1] input')
      .check()
      .should('have.value', '1')
  })
  /*
  it('updates Verantwortlich', () => {
    const typedText = '6c52d174-4f62-11e7-aebe-67a303eb0640'
    cy.get('[name=bearbeiter]')
      .clear({ force: true })
      .type(typedText, { force: true })
      .should('have.value', typedText)
  })
  it.only('updates Verantwortlich 2', () => {
    const typedText = '6c52d174-4f62-11e7-aebe-67a303eb0640'
    cy.get('[name=bearbeiter]')
      .chooseReactSelectOption('#bearbeiter', 'Adrienne Frei', 'Adrienne Frei')
      .should('have.value', typedText)
  })
  */
  it('updates Bester Beobachtungszeitpunkt für EKF', () => {
    const typedText = 'test'
    cy.get('[name=ekfBeobachtungszeitpunkt]')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('has filter icon', () => {
    cy.get('[data-id=daten-filtern]').should('exist')
  })
  it('opens filter form', () => {
    cy.get('[data-id=daten-filtern]')
      .click()
      .get('[data-id=form-title]')
      .should('contain', 'Filter')
  })
  it('closes filter form', () => {
    cy.get('[data-id=daten-anzeigen]')
      .click()
      .get('[data-id=form-title]')
      .should('not.contain', 'Filter')
  })
  it('opens info when info icon is clicked', () => {
    cy.get('[data-id=info-icon]')
      .first()
      .click()
      .get('[data-id=info-icon-popover')
      .should('exist')
  })
})
