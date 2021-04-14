/* eslint-disable no-undef */

describe('AP-Bericht form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/AP-Berichte/e6b2cfbe-3e7b-11e8-acca-fffa590cd65f',
    )
  })
  it('has Title AP-Bericht', () => {
    cy.get('[data-id=form-title]').should('contain', 'AP-Bericht')
  })
  it('updates jahr', () => {
    const typedText = '5'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates vergleichVorjahrGesamtziel', () => {
    const typedText = 'test'
    cy.get('#vergleichVorjahrGesamtziel')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Beurteilung', () => {
    cy.get('[data-id=beurteilung_4] input')
      .check()
      .get('[data-id=beurteilung_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates veraenderungZumVorjahr', () => {
    cy.get(`[data-id='veraenderungZumVorjahr_+']`)
      .find('input')
      .check({ force: true })
      .get(`[data-id='veraenderungZumVorjahr_-']`)
      .find('input')
      .check({ force: true })
      .should('have.value', '-')
  })
  it('updates konsequenzenUmsetzung', () => {
    const typedText = 'test'
    cy.get('#konsequenzenUmsetzung')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates konsequenzenErfolgskontrolle', () => {
    const typedText = 'test'
    cy.get('#konsequenzenErfolgskontrolle')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates biotopeNeue', () => {
    const typedText = 'test'
    cy.get('#biotopeNeue')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates biotopeOptimieren', () => {
    const typedText = 'test'
    cy.get('#biotopeOptimieren')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates massnahmenApBearb', () => {
    const typedText = 'test'
    cy.get('#massnahmenApBearb')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates massnahmenPlanungVsAusfuehrung', () => {
    const typedText = 'test'
    cy.get('#massnahmenPlanungVsAusfuehrung')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates massnahmenOptimieren', () => {
    const typedText = 'test'
    cy.get('#massnahmenOptimieren')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates wirkungAufArt', () => {
    const typedText = 'test'
    cy.get('#wirkungAufArt')
      .find('textarea')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates datum', () => {
    const typedText = '01.01.2000'
    cy.get('#datum')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it.skip('updates bearbeiter', () => {
    cy.setSelectOption({
      selector: '#bearbeiter',
      option: 'Adrienne Frei',
      value: 'dbc6b98a-4375-11e8-ab21-63812d703dd9',
    })
  })
})
