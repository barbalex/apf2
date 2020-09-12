/* eslint-disable no-undef */

describe('unchecking ap-filter', () => {
  before(() => {
    cy.visit('/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13').wait(1000)
  })
  it('ap-filter is unchecked', () => {
    cy.get('[data-id=ap-filter]')
      .find('input')
      .uncheck()
      .should('not.be.checked')
  })
  // TODO:
  // should test if filter works
})
