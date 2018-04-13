// @flow
import React from 'react'
import styled from 'styled-components'

import appBaseUrl from '../../../modules/appBaseUrl'
const StyledH3 = styled.h3`
  margin: 7px 0;
`

/**
 * This is rendered to static markup
 * So not possible to add store via context
 * or to observe
 */

const PopPopup = ({ store, pop }: { store: Object, pop: Object }) => {
  const { activeNodes } = store.tree
  const { ap, projekt } = activeNodes
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${
    pop.id
  }`

  return (
    <div>
      <div>Population</div>
      <StyledH3>
        {`${pop.nr ? `${pop.nr}: ` : '(keine Nummer): '}${
          pop.name ? pop.name : '(kein Name)'
        }`}
      </StyledH3>
      <div>
        {`Koordinaten: ${
          pop.PopKoordWgs84
            ? `${pop.PopXKoord.toLocaleString(
                'de-ch'
              )} / ${pop.PopYKoord.toLocaleString('de-ch')}`
            : '(keine)'
        }`}
      </div>
      <a href={popUrl} target="_blank" rel="noopener noreferrer">
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

export default PopPopup
