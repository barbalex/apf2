/* eslint-disable no-undef */

describe('Teil-Population form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555',
    )
  })
  it('has correct Title', () => {
    cy.get('[data-id=form-title]').should('contain', 'Teil-Population')
  })
  it('updates nr', () => {
    const typedText = '2'
    cy.get('#nr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates flurname', () => {
    const typedText = 'test, bitte nicht löschen'
    cy.get('#flurname')
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
    cy.get('#statusUnklarGrund')
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
    cy.contains('#X-KoordinatenErrorText', 'zulaessige_x_koordinate')
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
    cy.contains('#Y-KoordinatenErrorText', 'zulaessige_y_koordinate')
  })
  it('updates apberRelevant', () => {
    cy.get('[data-id=apberRelevant_2] input')
      .check()
      .get('[data-id=apberRelevant_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates gemeinde', () => {
    cy.clearSelect({
      selector: '[data-id=gemeinde]',
    }).setSelectOption({
      selector: '[data-id=gemeinde]',
      option: 'Einsiedeln',
      value: 'Einsiedeln',
    })
    cy.get('#nr').focus()
  })
  it('updates radius', () => {
    const typedText = '5'
    cy.get('#radius')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates hoehe', () => {
    const typedText = '500'
    cy.get('#hoehe')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates exposition', () => {
    const typedText = 'ost'
    cy.get('#exposition')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates klima', () => {
    const typedText = 'test'
    cy.get('#klima')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates neigung', () => {
    const typedText = 'test'
    cy.get('#neigung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates beschreibung', () => {
    const typedText = 'test'
    cy.get('#beschreibung')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates katasterNr', () => {
    const typedText = 'test'
    cy.get('#katasterNr')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates eigentuemer', () => {
    const typedText = 'test'
    cy.get('#eigentuemer')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates kontakt', () => {
    const typedText = 'test'
    cy.get('#kontakt')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates nutzungszone', () => {
    const typedText = 'test'
    cy.get('#nutzungszone')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bewirtschafter', () => {
    const typedText = 'test'
    cy.get('#bewirtschafter')
      .clear()
      .type(typedText)
      .blur()
      .should('have.value', typedText)
  })
  it('updates bewirtschaftung', () => {
    const typedText = 'test'
    cy.get('#bewirtschaftung')
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
  it('updates kontrollfrequenz', () => {
    cy.get('[data-id=kontrollfrequenz_0] input')
      .check()
      .get('[data-id=kontrollfrequenz_1] input')
      .check()
      .should('have.value', '1')
  })
  it('updates kontrollfrequenzFreiwillige', () => {
    cy.get('[data-id=kontrollfrequenzFreiwillige_0] input')
      .check()
      .get('[data-id=kontrollfrequenzFreiwillige_1] input')
      .check()
      .should('have.value', '1')
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
  it('opens info when info icon is clicked', () => {
    cy.get('[data-id=info-icon]')
      .first()
      .click()
      .get('[data-id=info-icon-popover')
      .should('exist')
    cy.get('#nr').focus()
  })
})
