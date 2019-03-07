/* eslint-disable no-undef */

describe('Beobachtung form', () => {
  before(() => {
    cy.visit(
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/nicht-beurteilte-Beobachtungen/b56a65e7-434e-11e8-ab21-4f56ad411a90',
    )
  })
  it('has Title Beobachtung', () => {
    cy.get('[data-id=form-title]').should('contain', 'Beobachtung')
  })
  it('updates Art', () => {
    cy.setReactSelectOption({
      selector: '[data-id=artId]',
      option: 'Abies alba Mill. (Weiss-Tanne)',
      value: '1ab6bbb1-979a-4232-a5d8-62efb5cb984a',
    })
  })
  it.only('updates nicht zuordnen', () => {
    cy.get('[data-id=nichtZuordnen] input')
      .check()
      .should('be.checked')
    /*cy.url().should(
      'include',
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/nicht-zuzuordnende-Beobachtungen/b56a65e7-434e-11e8-ab21-4f56ad411a90',
    )*/
    cy.wait(10000)
      .get('[data-id=nichtZuordnen] input')
      .check()
      .should('not.be.checked')
    //.wait(5000)
    /*cy.url().should(
      'include',
      '/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d174-4f62-11e7-aebe-67a303eb0640/nicht-beurteilte-Beobachtungen/b56a65e7-434e-11e8-ab21-4f56ad411a90',
    )*/
  })
  // TODO: test updating tpop
  it('updates Bemerkungen', () => {
    const typedText = 'das ist ein Test'
    cy.get('#bemerkungen')
      .clear()
      .type(typedText)
      .should('have.value', typedText)
  })
})
