/* eslint-disable no-undef */

describe('Population form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd',
    )
  })
  it('has Title Population', () => {
    cy.get('[data-id=form-title]').should('contain', 'Population')
  })
  it('updates nr', () => {
    const typedText = '2'
    cy.get('#nr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates name', () => {
    const typedText = 'test bitte nicht löschen'
    cy.get('#name')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bekanntSeit', () => {
    const typedText = '1000'
    cy.get('#bekanntSeit')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates status', () => {
    cy.get('[data-id=status_100] input')
      .check()
      .get('[data-id=status_200] input')
      .check()
      .should('have.value', '200')
  })
  it('updates statusUnklar', () => {
    cy.get('[data-id=statusUnklar] input')
      .check()
      .get('[data-id=statusUnklar] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates statusUnklarBegruendung', () => {
    const typedText = 'test'
    cy.get('#statusUnklarBegruendung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates x', () => {
    const typedText = '2694876'
    cy.get('#x')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('x only accepts valid values', () => {
    const typedText = '26948'
    cy.get('#x')
      .clear()
      .type(typedText)
      .blur()
    cy.get('#X-KoordinatenErrorText').should(
      'have.text',
      'GraphQL error: neue Zeile für Relation »pop« verletzt Check-Constraint »zulaessige_x_koordinate«',
    )
  })
  it('updates y', () => {
    const typedText = '1237625'
    cy.get('#y')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('y only accepts valid values', () => {
    const typedText = '12376'
    cy.get('#y')
      .clear()
      .type(typedText)
      .blur()
    cy.get('#Y-KoordinatenErrorText').should(
      'have.text',
      'GraphQL error: neue Zeile für Relation »pop« verletzt Check-Constraint »zulaessige_y_koordinate«',
    )
  })
})
