/* eslint-disable no-undef */

describe('Teil-Population Feldkontrolle Biotop form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Feld-Kontrollen/68364eb3-8be6-11e7-a848-0b73d4b76fcd',
    ).wait(1000)
  })
  it('opens Biotop', () => {
    cy.get('[data-id=biotop]').click()
  })
  it.skip('updates lrDelarze', () => {
    cy.get('[data-id=lrDelarze]')
      .find('.css-10nd86i input:text')
      .focus()
    cy.setSelectOption({
      selector: '[data-id=lrDelarze]',
      option: '1: Gewässer',
      value: '1: Gewässer',
    })
  })
  it.skip('updates lrUmgebungDelarze', () => {
    cy.setSelectOption({
      selector: '[data-id=lrUmgebungDelarze]',
      option: '1: Gewässer',
      value: '1: Gewässer',
    })
    cy.get('#vegetationstyp').focus()
  })
  it('updates vegetationstyp', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#vegetationstyp')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates konkurrenz', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#konkurrenz')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates moosschicht', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#moosschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates krautschicht', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#krautschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates strauchschicht', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#strauchschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates baumschicht', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#baumschicht')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenTyp', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bodenTyp')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenKalkgehalt', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bodenKalkgehalt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenDurchlaessigkeit', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bodenDurchlaessigkeit')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenHumus', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bodenHumus')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenNaehrstoffgehalt', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bodenNaehrstoffgehalt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bodenAbtrag', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bodenAbtrag')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates wasserhaushalt', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#wasserhaushalt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates handlungsbedarf', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#handlungsbedarf')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates idealbiotopUebereinstimmung', () => {
    cy.get('[data-id=idealbiotopUebereinstimmung_1] input')
      .check()
      .get('[data-id=idealbiotopUebereinstimmung_2] input')
      .check()
      .should('have.value', '2')
  })
})
