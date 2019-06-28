/* eslint-disable no-undef */

describe('Adresse form', () => {
  before(() => {
    cy.visit('/Daten/Werte-Listen/Adressen/dbc6b9c4-4375-11e8-ab21-27d2a4db8ba6').wait(1000)
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
  it('has Title Adresse', () => {
    cy.get('[data-id=form-title]').should('contain', 'Adresse')
  })
  it('updates Name', () => {
    const typedText = 'Alexander Gabriel'
    cy.get('#name')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates Adresse', () => {
    const typedText = 'Wiesenstrasse 22, 8800 Thalwil'
    cy.get('#adresse')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates Telefon', () => {
    const typedText = '079 372 51 64'
    cy.get('#telefon')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates Email', () => {
    const typedText = 'alex@gabriel-software.ch'
    cy.get('#email')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates Freiw. Erfko', () => {
    cy.get('[data-id=freiwErfko] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates EvAB Vorname', () => {
    const typedText = 'Alexander'
    cy.get('#evabVorname')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates EvAB Nachname', () => {
    const typedText = 'Gabriel'
    cy.get('#evabNachname')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
  it('updates EvAB Ort', () => {
    const typedText = 'Thalwil'
    cy.get('#evabOrt')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
})
