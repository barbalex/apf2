import React, { useContext } from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import get from 'lodash/get'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../../../../mobxStoreContext'
import tpopIcon from './tpop.svg'
import tpopIconHighlighted from './tpopHighlighted.svg'
import uIcon from './u.svg'
import uIconHighlighted from './uHighlighted.svg'
import aIcon from './a.svg'
import aIconHighlighted from './aHighlighted.svg'
import pIcon from './p.svg'
import pIconHighlighted from './pHighlighted.svg'
import qIcon from './q.svg'
import qIconHighlighted from './qHighlighted.svg'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'
import appBaseUrl from '../../../../../modules/appBaseUrl'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledTooltip = styled(Tooltip)`
  &:before {
    content: none !important;
  }
`

const TpopMarker = ({ treeName, tpop }: { treeName: string, tpop: Object }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { tpopLabelUsingNr } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered, tpopIcon: tpopIconName } = mobxStore[treeName].map

  const tpopNr = get(tpop, 'nr', '(keine Nr)')
  const nrLabel = `${get(
    tpop,
    'popByPopId.nr',
    '(keine Nr)',
  )}.${tpopNr}`.toString()
  const isHighlighted = idsFiltered.includes(tpop.id)

  let iconUrl = tpopIcon
  if (isHighlighted) iconUrl = tpopIconHighlighted
  if (tpopIconName === 'statusGroup') {
    iconUrl = qIcon
    if (isHighlighted) iconUrl = qIconHighlighted
    if (tpop.status === 300) {
      iconUrl = pIcon
      if (isHighlighted) iconUrl = pIconHighlighted
    } else if (tpop.status >= 200) {
      iconUrl = aIcon
      if (isHighlighted) iconUrl = aIconHighlighted
    } else if (tpop.status >= 100) {
      iconUrl = uIcon
      if (isHighlighted) iconUrl = uIconHighlighted
    }
  }

  const latLng = new window.L.LatLng(...epsg2056to4326(tpop.x, tpop.y))
  const icon = window.L.icon({
    iconUrl,
    iconSize: [24, 24],
  })
  const title = tpopLabelUsingNr ? tpop.flurname : nrLabel
  const artname = get(
    tpop,
    'popByPopId.apByApId.aeEigenschaftenByArtId.artname',
    '',
  )

  return (
    <Marker position={latLng} icon={icon} title={title}>
      <Popup>
        <>
          <div>Teil-Population</div>
          <StyledH3>
            {`${tpop.nr || '(keine Nr)'}: ${tpop.flurname ||
              '(kein Flurname)'}`}
          </StyledH3>
          <div>{`Aktionsplan: ${artname}`}</div>
          <div>
            {`Population: ${get(tpop, 'popByPopId.nr', '(keine Nr)')}: ${get(
              tpop,
              'popByPopId.name',
              '(kein Name)',
            )}`}
          </div>
          <div>
            {`Koordinaten: ${tpop.x.toLocaleString(
              'de-ch',
            )} / ${tpop.y.toLocaleString('de-ch')}`}
          </div>
          <div>{`Status: ${get(
            tpop,
            'popStatusWerteByStatus.text',
            '(kein Status)',
          )}`}</div>
          <a
            href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${get(
              tpop,
              'popByPopId.id',
              '',
            )}/Teil-Populationen/${tpop.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
        </>
      </Popup>
      <StyledTooltip direction="bottom" opacity={1} permanent>
        <span className="mapTooltip">
          {tpopLabelUsingNr ? nrLabel : tpop.flurname}
        </span>
      </StyledTooltip>
    </Marker>
  )
}

export default observer(TpopMarker)
