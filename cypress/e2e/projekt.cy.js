/* eslint-disable no-undef */

describe('Projekt form', () => {
  before(() => {
    cy.visit('/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13').wait(1500)
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
  it('has Title Projekt', () => {
    cy.get('[data-id=form-title]').should('contain', 'Projekt')
  })
  it('updates Projekt', () => {
    const typedText = 'AP Flora Kt. ZH'
    cy.get('#name').clear().type(typedText).should('have.value', typedText)
  })
})
