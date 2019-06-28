/* eslint-disable no-undef */

describe('Teil-Population Massnahme form', () => {
  before(() => {
    cy.visit(
      '/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Massnahmen/87379a58-4f62-11e7-aebe-f32f5b153432',
    ).wait(2000)
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should('contain', 'Massnahme')
  })
  it('updates jahr', () => {
    const typedText = '1'
    cy.get('#jahr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('datum was nulled when updating jahr', () => {
    cy.get('[data-id=datum] input').should('have.value', '')
  })
  it('datum only accepts valid values', () => {
    const typedText = '01.02.1001'
    cy.get('[data-id=datum] input')
      .clear()
      .type(typedText)
      .blur()
    cy.contains('[data-id=datum] p', 'minimal')
  })
  it('updates datum', () => {
    const typedText = '01.02.2000'
    cy.get('[data-id=datum] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('jahr was set to jahr of datum', () => {
    const typedText = '2000'
    cy.get('#jahr').should('have.value', typedText)
  })
  it('updates typ', () => {
    cy.get('[data-id=typ_1] input')
      .check()
      .get('[data-id=typ_70] input')
      .check()
      .should('have.value', '70')
  })
  it('updates massnahme', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#beschreibung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it.skip('updates bearbeiter', () => {
    cy.setSelectOption({
      selector: '[data-id=bearbeiter]',
      option: 'Adrienne Frei',
      value: 'dbc6b98a-4375-11e8-ab21-63812d703dd9',
    })
    cy.get('#bemerkungen').focus()
  })
  it('updates bemerkungen', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates planVorhanden', () => {
    cy.get('[data-id=planVorhanden] input')
      .check()
      .get('[data-id=planVorhanden] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates planBezeichnung', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#planBezeichnung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates flaeche', () => {
    const typedText = '5'
    cy.get('#flaeche')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates form', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#form')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates pflanzanordnung', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#pflanzanordnung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates markierung', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#markierung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates anzTriebe', () => {
    const typedText = '5'
    cy.get('#anzTriebe')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates anzPflanzen', () => {
    const typedText = '5'
    cy.get('#anzPflanzen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates anzPflanzstellen', () => {
    const typedText = '1'
    cy.get('#anzPflanzstellen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it.skip('updates wirtspflanze', () => {
    cy.clearSelect({
      selector: '[data-id=wirtspflanze]',
    })
    cy.setSelectOption({
      selector: '[data-id=wirtspflanze]',
      option: 'Abies',
      value: 'Abies alba Mill. (Weiss-Tanne)',
    })
  })
  it('updates herkunftPop', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#herkunftPop')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates sammeldatum', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#sammeldatum')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
})
