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

// TODO: setting selects is a total mess
// should become better in next cypress updates
Cypress.Commands.add('setSelectOption', ({ selector, option, value }) => {
  cy.get(selector)
    .find('.css-10nd86i input:text')
    .focus()
    .type(option, { force: true })
    .type('{enter}', { force: true })
  cy.get(selector)
    .find('.css-10nd86i')
    .find('input')
    .eq(1)
    .should('have.value', value)
})
Cypress.Commands.add('setSelectOptionSlowly', ({ selector, option, value }) => {
  cy.get(selector)
    .find('.css-10nd86i input:text')
    .focus()
    .type(option, { force: true, delay: 600, timeout: 330000 })
    .type('{enter}', { force: true })
  cy.get(selector)
    .find('.css-10nd86i')
    .find('input')
    .eq(1)
    .should('have.value', value)
})
Cypress.Commands.add('setSelectTopOption', ({ selector }) => {
  cy.get(selector)
    .find('.css-10nd86i input:text')
    .focus()
    .type('{downarrow}', { force: true })
    .type('{enter}', { force: true })
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
