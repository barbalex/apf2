// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/* eslint-disable no-undef */

Cypress.Commands.add('setSelectOption', ({ selector, option, value }) => {
  cy.get(selector)
    .find('.css-10nd86i input')
    .eq(1)
    .focus()
    .type(value, { force: true })
  //cy.contains(option).click({ force: true })
  cy.get(selector)
    .find('.css-10nd86i')
    .find('input')
    .eq(1)
    .should('have.value', value)
})
Cypress.Commands.add('setSelectOption2', ({ selector, option, value }) => {
  cy.get(selector)
    .find('.css-10nd86i')
    .click()
    .find('input')
    .eq(1)
    .focus()
    .debug()
  /*.find('.react-select__menu')
    .contains(option)
    .click({ force: true })*/
  /*cy.get(selector)
    .find('.css-10nd86i')
    .find('input')
    .eq(1)
    .should('have.value', value)*/
})
Cypress.Commands.add('clearSelect', ({ selector }) => {
  cy.get(selector)
    .find('.css-10nd86i')
    .find('.react-select__clear-indicator')
    .click()
  cy.get(selector)
    .find('.css-10nd86i')
    .find('input')
    .eq(1)
    .should('have.value', '')
})
