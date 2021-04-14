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

const { cy } = require('date-fns/locale')

// TODO: setting selects is a total mess
// should become better in next cypress updates
// Cypress.Commands.add('setSelectOption', ({ selector, option, value }) => {
//   cy.get(selector).then((thing) => {
//     if (thing.find('.react-select__clear-indicator').length > 0) {
//       thing.find('.react-select__clear-indicator').click()
//     }
//   })
//   cy.get(selector)
//     .find('.react-select__input')
//     .find('input')
//     .type(option, { force: true })
//     .blur()
//   cy.get(selector).find('.react-select__single-value').should('contain', option)
// })
Cypress.Commands.add('setSelectOption', ({ selector, option, value }) => {
  cy.get(selector).then((thing) => {
    if (thing.find('.react-select__clear-indicator').length > 0) {
      thing.find('.react-select__clear-indicator').click()
    }
  })
  cy.get(selector)
    .find('.react-select__input')
    .find('input')
    .type(option, { force: true })
    .blur()
  cy.get(selector).find('.react-select__single-value').should('contain', option)
})
// Cypress.Commands.add('setSelectTopOption', ({ selector }) => {
//   cy.get(selector)
//     .find('.react-select__input')
//     .find('input')
//     .focus()
//     .type('{downarrow}', { force: true })
//     .type('{enter}', { force: true })
// })
Cypress.Commands.add('setSelectTopOption', ({ selector }) => {
  cy.get(selector)
    .find('.react-select__control') // find react-select component
    .click() // click to open dropdown
    .get('.react-select__menu') // find opened dropdown
    .find('.react-select__option') // find all options
    .first()
    .click() // click on first option
})
Cypress.Commands.add('clearSelect', ({ selector }) => {
  cy.get(selector).then((thing) => {
    if (thing.find('.react-select__clear-indicator').length > 0) {
      thing.find('.react-select__clear-indicator').click()
    }
  })
  // the value of the container is ALWAYS ''
  // Dont know how to get the real value
  cy.get(selector).find('.react-select__single-value').should('contain', '')
})
