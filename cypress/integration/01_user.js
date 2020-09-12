/* eslint-disable no-undef */
const secrets = require('../../secrets.json')

describe('User login', () => {
  beforeEach(() => {
    cy.visit('/Daten/')
    /*
    Example of how to use idb, store or client 
    cy.window()
      .its('__idb__')
      .then(idb => {
        idb.currentUser.clear()
        window.location.reload(false)
      })
    */
    indexedDB.deleteDatabase('apflora')
    cy.wait(1000)
  })
  it('greets with Anmeldung', () => {
    cy.contains('#dialog-title', 'Anmeldung')
  })
  it('has Anmelden button', () => {
    cy.contains('button', 'anmelden')
  })
  it('focuses name on load', () => {
    cy.focused().should('have.id', 'name')
  })
  it('requires name on submit', () => {
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('p#nameHelper').should('contain', 'Name oder Passwort nicht bekannt')
  })
  it('requires password on submit', () => {
    cy.get('#name').type(secrets.user)
    cy.contains('anmelden').click()
    cy.get('p#passwortHelper').should(
      'contain',
      'Name oder Passwort nicht bekannt',
    )
  })
  it('requires password on Enter in password field', () => {
    cy.get('#passwort').type('{enter}')
    cy.get('p#passwortHelper').should('contain', 'Bitte Passwort eingeben')
  })
  it('barks when submitting wrong name', () => {
    cy.get('#name').type('wrong name')
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('p#passwortHelper').should(
      'contain',
      'Name oder Passwort nicht bekannt',
    )
  })
  it('barks when submitting wrong password', () => {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type('wrong password')
    cy.contains('anmelden').click()
    cy.get('p#nameHelper').should('contain', 'Name oder Passwort nicht bekannt')
  })
  it('logs in correctly', () => {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('#name').should('not.exist')
  })
})
