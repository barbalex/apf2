// @flow
import React, { PropTypes } from 'react'
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

const TpopPopup = (
  { store, pop, tpop }:
  {store:Object,pop:Object,tpop:Object}
) => {
  const { activeNodes } = store.tree
  const { ap, projekt } = activeNodes
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${tpop.PopId}/Teil-Populationen/${tpop.TPopId}`

  return (
    <div>
      <div>Teil-Population</div>
      <StyledH3>
        {`${tpop.TPopNr ? `${tpop.TPopNr}: ` : ``}${tpop.TPopFlurname}`}
      </StyledH3>
      <div>
        {`Population: ${pop.PopNr ? `${pop.PopNr}: ` : ``}${pop.PopName}`}
      </div>
      <div>
        {`Koordinaten: ${tpop.TPopKoordWgs84 ? `${tpop.TPopXKoord.toLocaleString(`de-ch`)} / ${tpop.TPopYKoord.toLocaleString(`de-ch`)}` : `(keine)`}`}
      </div>
      <a
        href={popUrl}
        target="_blank"
      >
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

TpopPopup.propTypes = {
  store: PropTypes.object.isRequired,
  pop: PropTypes.object.isRequired,
  tpop: PropTypes.object.isRequired,
}

export default TpopPopup
