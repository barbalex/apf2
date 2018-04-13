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

const TpopPopup = ({
  store,
  pop,
  tpop,
}: {
  store: Object,
  pop: ?Object,
  tpop: Object,
}) => {
  const { activeNodes } = store.tree
  const { ap, projekt } = activeNodes
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${
    tpop.pop_id
  }/Teil-Populationen/${tpop.id}`

  return (
    <div>
      <div>Teil-Population</div>
      <StyledH3>
        {`${tpop && tpop.nr ? `${tpop.nr}: ` : '(keine Nummer): '}${
          tpop && tpop.flurname ? tpop.flurname : '(kein Name)'
        }`}
      </StyledH3>
      <div>
        {`Population: ${pop && pop.nr ? `${pop.nr}: ` : '(keine Nummer): '}${
          pop && pop.PopName ? pop.PopName : '(kein Name)'
        }`}
      </div>
      <div>
        {`Koordinaten: ${
          tpop.TPopKoordWgs84
            ? `${tpop.x.toLocaleString('de-ch')} / ${tpop.y.toLocaleString(
                'de-ch'
              )}`
            : '(keine)'
        }`}
      </div>
      <a href={popUrl} target="_blank" rel="noopener noreferrer">
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

export default TpopPopup
