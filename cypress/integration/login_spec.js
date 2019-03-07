/* eslint-disable no-undef */
const secrets = require('../../secrets.json')

describe('Login', function() {
  beforeEach(() => {
    cy.visit('/')
    indexedDB.deleteDatabase('apflora')
    //cy.url().should('include', '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13')
    //cy.get('.appbar-more').click()
    //cy.get('.appbar-more-logout').click()
  })
  it('greets with Anmeldung', function() {
    cy.contains('h2', 'Anmeldung')
  })
  it('has Anmelden button', function() {
    cy.contains('button', 'anmelden')
  })
  it('requires name on submit', function() {
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('p#nameHelper').should('contain', 'Name oder Passwort nicht bekannt')
  })
  it('requires password on submit', function() {
    cy.get('#name').type(secrets.user)
    cy.contains('anmelden').click()
    cy.get('p#passwortHelper').should(
      'contain',
      'Name oder Passwort nicht bekannt',
    )
  })
  it('requires password on Enter in password field', function() {
    cy.get('#passwort').type('{enter}')
    cy.get('p#passwortHelper').should('contain', 'Bitte Passwort eingeben')
  })
  it('barks when submitting wrong name', function() {
    cy.get('#name').type('wrong name')
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('p#passwortHelper').should(
      'contain',
      'Name oder Passwort nicht bekannt',
    )
  })
  it('barks when submitting wrong password', function() {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type('wrong password')
    cy.contains('anmelden').click()
    cy.get('p#nameHelper').should('contain', 'Name oder Passwort nicht bekannt')
  })
  it('logs in correctly', function() {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('#name').should('not.exist')
  })
  it('logs out correctly', function() {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.visit('/')
    cy.get('.appbar-more').click()
    cy.get('.appbar-more-logout').click()
    cy.get('#name').should('exist')
  })
  it('logs back in correctly', function() {
    cy.get('#name').type(secrets.user)
    cy.get('#passwort').type(secrets.pass)
    cy.contains('anmelden').click()
    cy.get('#name').should('not.exist')
  })
})
