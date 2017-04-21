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

const BeobPopup = ({
  store,
  beobBereitgestellt
}: {
  store: Object,
  beobBereitgestellt: Object
}) => {
  const { activeNodes } = store.tree
  const { ap, projekt } = activeNodes

  // build url to open beob form
  let url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-beurteilte-Beobachtungen/${beobBereitgestellt.id}`
  if (beobBereitgestellt.beobzuordnung) {
    if (beobBereitgestellt.beobzuordnung.BeobNichtZuordnen) {
      url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-zuzuordnende-Beobachtungen/${beobBereitgestellt.id}`
    } else {
      const tpopId = beobBereitgestellt.beobzuordnung.TPopId
      const tpop = store.table.tpop.get(tpopId)
      const popId = tpop ? tpop.PopId : ``
      url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${beobBereitgestellt.id}`
    }
  }

  const xKoord = beobBereitgestellt.X
  const yKoord = beobBereitgestellt.Y

  return (
    <div>
      <div>Beobachtung</div>
      <StyledH3>
        {beobBereitgestellt.label}
      </StyledH3>
      <div>
        {`Koordinaten: ${xKoord.toLocaleString(`de-ch`)} / ${yKoord.toLocaleString(`de-ch`)}`}
      </div>
      <a href={url} target="_blank">
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

export default BeobPopup
