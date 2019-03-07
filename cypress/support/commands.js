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

Cypress.Commands.add('chooseReactSelectOption', (selector, text, option) => {
  //cy.get(`${selector} .react-select__clear-indicator`).click()
  cy.get(`${selector} .react-select__value-container`)
    .click({ force: true })
    //.get(`${selector} .select__menu`)
    .get(`.#react-select-3--option-3`)
    .click()
})
