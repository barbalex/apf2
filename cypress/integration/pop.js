/* eslint-disable no-undef */

describe('Population form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd',
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

  it('updates wgs84Lat', () => {
    const typedText = '47.2826994360682'
    cy.get('[data-id=wgs84Lat] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('wgs84Lat only accepts valid values', () => {
    const typedText = '300'
    cy.get('[data-id=wgs84Lat] input')
      .clear()
      .type(typedText)
      .blur()
    cy.contains('[data-id=wgs84LatErrorText]', 'Der Breitengrad')
  })
  it('updates wgs84Long', () => {
    const typedText = '8.69272852121984'
    cy.get('[data-id=wgs84Long] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('wgs84Long only accepts valid values', () => {
    const typedText = '300'
    cy.get('[data-id=wgs84Long] input')
      .clear()
      .type(typedText)
      .blur()
    cy.contains('[data-id=wgs84LongErrorText]', 'Der Längengrad')
  })

  it('updates lv95X', () => {
    const typedText = '2694876'
    cy.get('[data-id=lv95X] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('lv95X only accepts valid values', () => {
    const typedText = '26948'
    cy.get('[data-id=lv95X] input')
      .clear()
      .type(typedText)
      .blur()
    cy.contains('[data-id=lv95XErrorText]', 'Die X-Koordinate')
  })
  it('updates lv95Y', () => {
    const typedText = '1237625'
    cy.get('[data-id=lv95Y] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('lv95Y only accepts valid values', () => {
    const typedText = '12376'
    cy.get('[data-id=lv95Y] input')
      .clear()
      .type(typedText)
      .blur()
    cy.contains('[data-id=lv95YErrorText]', 'Die Y-Koordinate')
  })
  it('opens info when info icon is clicked', () => {
    cy.get('[data-id=info-icon]')
      .first()
      .click()
      .get('[data-id=info-icon-popover')
      .should('exist')
  })
})
