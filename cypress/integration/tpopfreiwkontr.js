/* eslint-disable no-undef */

describe('Teil-Population Freiwilligen-Kontrolle form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Freiwilligen-Kontrollen/d5af417f-ad1e-11e8-ae87-07d9a3b28c64',
    )
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should('contain', 'Freiwilligen-Kontrolle')
  })
  it('updates bearbeiter', () => {
    cy.setSelectOption({
      selector: '[data-id=bearbeiter]',
      option: 'Test Tester',
      value: 'd40729c0-a6a9-11e8-b9bc-eba63e5fd6c7',
    })
    cy.get('#bemerkungen').focus()
  })
  it('updates datum', () => {
    const typedText = '01.02.2000'
    cy.get('[data-id=datum] input')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates planVorhanden', () => {
    cy.get('[data-id=planVorhanden_true] input')
      .check()
      .get('[data-id=planVorhanden_false] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates einheit', () => {
    cy.setSelectOption({
      selector: '[data-id=count1] [data-id=einheit]',
      option: 'Pflanzen',
      value: '1',
    })
    cy.get('#bemerkungen').focus()
  })
  it('updates anzahl2', () => {
    const typedText = '5'
    cy.get('[data-id=count1]')
      .find('#anzahl2')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates anzahl1', () => {
    const typedText = '5'
    cy.get('[data-id=count1]')
      .find('#anzahl1')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates deckungApArt', () => {
    const typedText = '5'
    cy.get('#deckungApArt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates deckungNackterBoden', () => {
    const typedText = '5'
    cy.get('#deckungNackterBoden')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates flaecheUeberprueft', () => {
    const typedText = '5'
    cy.get('#flaecheUeberprueft')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates jungpflanzenVorhanden', () => {
    cy.get('[data-id=jungpflanzenVorhanden_true] input')
      .check()
      .get('[data-id=jungpflanzenVorhanden_false] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates vegetationshoeheMaximum', () => {
    const typedText = '5'
    cy.get('#vegetationshoeheMaximum')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates vegetationshoeheMittel', () => {
    const typedText = '5'
    cy.get('#vegetationshoeheMittel')
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
  it('updates bemerkungen', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates ekfVerifiziert', () => {
    cy.get('[data-id=ekfVerifiziert] input')
      .check()
      .get('[data-id=ekfVerifiziert] input')
      .check()
      .should('have.value', 'true')
  })
  it('updates ekfBemerkungen', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#ekfBemerkungen')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })

  it('has filter icon', () => {
    cy.get('[data-id=daten-filtern]').should('exist')
  })
  it('opens filter form', () => {
    cy.get('[data-id=daten-filtern]')
      .click()
      .get('[data-id=form-title]')
      .should('contain', 'Filter')
  })
  it('closes filter form', () => {
    cy.get('[data-id=daten-anzeigen]')
      .click()
      .get('[data-id=form-title]')
      .should('not.contain', 'Filter')
  })
})
