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

const PopPopup = (
  { store, pop }:
  {store:Object,pop:Object}
) => {
  const { activeNodes } = store
  const { ap, projekt } = activeNodes
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${pop.PopId}`

  return (
    <div>
      <div>Population</div>
      <StyledH3>
        {`${pop.PopNr ? `${pop.PopNr}: ` : ``}${pop.PopName}`}
      </StyledH3>
      <div>
        {`Koordinaten: ${pop.PopKoordWgs84 ? `${pop.PopXKoord.toLocaleString(`de-ch`)} / ${pop.PopYKoord.toLocaleString(`de-ch`)}` : `(keine)`}`}
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

PopPopup.propTypes = {
  store: PropTypes.object.isRequired,
  pop: PropTypes.object.isRequired,
}

export default PopPopup
