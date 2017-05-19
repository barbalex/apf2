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
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${tpop.PopId}/Teil-Populationen/${tpop.TPopId}`

  return (
    <div>
      <div>Teil-Population</div>
      <StyledH3>
        {`${tpop && tpop.TPopNr ? `${tpop.TPopNr}: ` : '(keine Nummer): '}${tpop && tpop.TPopFlurname ? tpop.TPopFlurname : '(kein Name)'}`}
      </StyledH3>
      <div>
        {`Population: ${pop && pop.PopNr ? `${pop.PopNr}: ` : '(keine Nummer): '}${pop && pop.PopName ? pop.PopName : '(kein Name)'}`}
      </div>
      <div>
        {`Koordinaten: ${tpop.TPopKoordWgs84 ? `${tpop.TPopXKoord.toLocaleString('de-ch')} / ${tpop.TPopYKoord.toLocaleString('de-ch')}` : '(keine)'}`}
      </div>
      <a href={popUrl} target="_blank" rel="noopener noreferrer">
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

export default TpopPopup
