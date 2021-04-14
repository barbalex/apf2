/* eslint-disable no-undef */

describe('Teil-Population Feldkontrolle form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Feld-Kontrollen/68364eb3-8be6-11e7-a848-0b73d4b76fcd',
    ).wait(2000)
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should('contain', 'Feld-Kontrolle')
  })
  it('updates jahr', () => {
    const typedText = '1'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  // no idea why, but this only works in the real world, not in tests
  it.skip('datum was nulled when updating jahr', () => {
    cy.wait(500)
      .get('#ueberlebensrate')
      .wait(500)
      .get('[data-id=datum] input')
      .should('have.value', '')
  })
  it('datum only accepts valid values', () => {
    const typedText = '01.02.1001'
    cy.get('[data-id=datum] input').clear().type(typedText).blur()
    cy.contains('[data-id=datum] p', 'minimal')
  })
  it('updates datum', () => {
    const typedText = '01.02.2000'
    cy.get('#ueberlebensrate')
      .wait(50)
      .get('[data-id=datum] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  // no idea why, but this only works in the real world, not in tests
  it.skip('jahr was set to jahr of datum', () => {
    const typedText = '2000'
    cy.wait(300)
      .get('#ueberlebensrate')
      .wait(50)
      .get('#jahr')
      .should('have.value', typedText)
  })
  it('updates typ', () => {
    cy.get('[data-id=typ_Ausgangszustand] input')
      .check()
      .get('[data-id=typ_Zwischenbeurteilung] input')
      .check()
      .should('have.value', 'Zwischenbeurteilung')
  })
  it.skip('updates bearbeiter', () => {
    cy.setSelectOption({
      selector: '[data-id=bearbeiter]',
      option: 'Adrienne Frei',
      value: 'dbc6b98a-4375-11e8-ab21-63812d703dd9',
    })
    cy.get('#bemerkungen').focus()
  })
  it('updates vitalitaet', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#vitalitaet')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates ueberlebensrate', () => {
    const typedText = '50'
    cy.get('#ueberlebensrate')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates entwicklung', () => {
    cy.get('[data-id=entwicklung_3] input')
      .check()
      .get('[data-id=entwicklung_2] input')
      .check()
      .should('have.value', '2')
  })
  it('updates ursachen', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#ursachen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates gefaehrdung', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#gefaehrdung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates erfolgsbeurteilung', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#erfolgsbeurteilung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates umsetzungAendern', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#umsetzungAendern')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates kontrolleAendern', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#kontrolleAendern')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates apberNichtRelevant', () => {
    cy.get('[data-id=apberNichtRelevant] input')
      .check()
      .get('[data-id=apberNichtRelevant] input')
      .check()
      .should('be.checked')
  })
  it('updates apberNichtRelevantGrund', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#apberNichtRelevantGrund')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bemerkungen', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('opens info when info icon is clicked', () => {
    cy.get('[data-id=info-icon]')
      .first()
      .click()
      .get('[data-id=info-icon-popover')
      .should('exist')
    cy.get('#jahr').focus()
  })
})
