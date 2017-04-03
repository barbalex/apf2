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

const BeobPopup = (
  { store, beobBereitgestellt }:
  {store:Object,beobBereitgestellt:Object}
) => {
  const { activeNodes } = store.tree
  const { ap, projekt } = activeNodes

  // build url to open beob form
  let url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-beurteilte-Beobachtungen/${beobBereitgestellt.BeobId}`
  if (beobBereitgestellt.beobzuordnung) {
    if (beobBereitgestellt.beobzuordnung.BeobNichtZuordnen) {
      url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-zuzuordnende-Beobachtungen/${beobBereitgestellt.BeobId}`
    } else {
      const tpopId = beobBereitgestellt.beobzuordnung.TPopId
      const tpop = store.table.tpop.get(tpopId)
      const popId = tpop ? tpop.PopId : ``
      url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${beobBereitgestellt.BeobId}`
    }
  }

  const xKoord = (
    beobBereitgestellt.QuelleId === 1 ?
    beobBereitgestellt.beob.COORDONNEE_FED_E :
    beobBereitgestellt.beob.FNS_XGIS
  )
  const yKoord = (
    beobBereitgestellt.QuelleId === 1 ?
    beobBereitgestellt.beob.COORDONNEE_FED_N :
    beobBereitgestellt.beob.FNS_YGIS
  )

  return (
    <div>
      <div>Beobachtung</div>
      <StyledH3>
        {beobBereitgestellt.label}
      </StyledH3>
      <div>
        {`Koordinaten: ${xKoord.toLocaleString(`de-ch`)} / ${yKoord.toLocaleString(`de-ch`)}`}
      </div>
      <a
        href={url}
        target="_blank"
      >
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

BeobPopup.propTypes = {
  store: PropTypes.object.isRequired,
  beobBereitgestellt: PropTypes.object.isRequired,
}

export default BeobPopup
