/* eslint-disable no-undef */

describe('setting ap-filter', () => {
  before(() => {
    cy.visit('/Daten//Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13').wait(1000)
  })
  it('sets ap-filter back', () => {
    cy.get('[data-id=ap-filter]').click()
  })
})
