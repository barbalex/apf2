/* eslint-disable no-undef */

describe('Idealbiotop form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Idealbiotop',
    ).wait(1500)
  })
  it('has Title Idealbiotop', () => {
    cy.get('[data-id=form-title]').should('contain', 'Idealbiotop')
  })
  it('shows testdata-message', () => {
    cy.get('[data-id=testdata-message]').should('contain', 'Test-Aktionsplan')
  })
  it('updates Erstelldatum', () => {
    const typedText = '01.02.2000'
    cy.get('[data-id=erstelldatum] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Höhenlage', () => {
    const typedText = 'test'
    cy.get('#hoehenlage')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Region', () => {
    const typedText = 'test'
    cy.get('#region')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Exposition', () => {
    const typedText = 'test'
    cy.get('#exposition')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Besonnung', () => {
    const typedText = 'test'
    cy.get('#besonnung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates Hangneigung', () => {
    const typedText = 'test'
    cy.get('#hangneigung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates BodenTyp', () => {
    const typedText = 'test'
    cy.get('#bodenTyp')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates BodenKalkgehalt', () => {
    const typedText = 'test'
    cy.get('#bodenKalkgehalt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenDurchlaessigkeit', () => {
    const typedText = 'test'
    cy.get('#bodenDurchlaessigkeit')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenHumus', () => {
    const typedText = 'test'
    cy.get('#bodenHumus')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenNaehrstoffgehalt', () => {
    const typedText = 'test'
    cy.get('#bodenNaehrstoffgehalt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates wasserhaushalt', () => {
    const typedText = 'test'
    cy.get('#wasserhaushalt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates konkurrenz', () => {
    const typedText = 'test'
    cy.get('#konkurrenz')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates moosschicht', () => {
    const typedText = 'test'
    cy.get('#moosschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates krautschicht', () => {
    const typedText = 'test'
    cy.get('#krautschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates strauchschicht', () => {
    const typedText = 'test'
    cy.get('#strauchschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates baumschicht', () => {
    const typedText = 'test'
    cy.get('#baumschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bemerkungen', () => {
    const typedText = 'test'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
