import React, { useContext } from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

/**
 * TODO: the svg path on production contains "Projekte/1/" !!??
 * Maybe give an absolute path?
 */
import mobxStoreContext from '../../../../../mobxStoreContext'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import popIcon from './pop.svg'
import popIconHighlighted from './popHighlighted.svg'
import uIcon from './u.svg'
import uIconHighlighted from './uHighlighted.svg'
import aIcon from './a.svg'
import aIconHighlighted from './aHighlighted.svg'
import pIcon from './p.svg'
import pIconHighlighted from './pHighlighted.svg'
import qIcon from './q.svg'
import qIconHighlighted from './qHighlighted.svg'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledTooltip = styled(Tooltip)`
  &:before {
    content: none !important;
  }
`

const PopMarker = ({ treeName, pop }: { treeName: string, pop: Object }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const {
    idsFiltered,
    popIcon: popIconName,
    popLabel: popLabelName,
  } = mobxStore[treeName].map

  const nrLabel = pop.nr ? pop.nr.toString() : '(keine Nr)'
  let title = nrLabel
  if (popLabelName === 'name') title = get(pop, 'name', '(kein Name)')
  // beware: leaflet needs title to always be a string
  if (title && title.toString) {
    title = title.toString()
  }
  const isHighlighted = idsFiltered.includes(pop.id)

  let iconUrl = popIcon
  if (isHighlighted) iconUrl = popIconHighlighted
  if (popIconName === 'statusGroup') {
    iconUrl = qIcon
    if (isHighlighted) iconUrl = qIconHighlighted
    if (pop.status === 300) {
      iconUrl = pIcon
      if (isHighlighted) iconUrl = pIconHighlighted
    } else if (pop.status >= 200) {
      iconUrl = aIcon
      if (isHighlighted) iconUrl = aIconHighlighted
    } else if (pop.status >= 100) {
      iconUrl = uIcon
      if (isHighlighted) iconUrl = uIconHighlighted
    }
  }

  const latLng = new window.L.LatLng(...epsg2056to4326(pop.x, pop.y))
  const icon = window.L.icon({
    iconUrl,
    iconSize: [24, 24],
    className: isHighlighted ? 'popIconHighlighted' : 'popIcon',
  })
  const zIndexOffset = -apfloraLayers.findIndex(
    apfloraLayer => apfloraLayer.value === 'pop',
  )
  const artname = get(pop, 'apByApId.aeEigenschaftenByArtId.artname', '')

  return (
    <Marker
      position={latLng}
      icon={icon}
      title={title}
      zIndexOffset={zIndexOffset}
    >
      <Popup>
        <>
          <div>Population</div>
          <StyledH3>
            {`${pop.nr ? `${pop.nr}: ` : '(keine Nummer): '}${
              pop.name ? pop.name : '(kein Name)'
            }`}
          </StyledH3>
          <div>{`Aktionsplan: ${artname}`}</div>
          <div>
            {`Koordinaten: ${pop.x ? pop.x.toLocaleString('de-ch') : ''} / ${
              pop.y ? pop.y.toLocaleString('de-ch') : ''
            }`}
          </div>
          <div>{`Status: ${get(
            pop,
            'popStatusWerteByStatus.text',
            '(kein Status)',
          )}`}</div>
          <a
            href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${
              pop.id
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
        </>
      </Popup>
      <StyledTooltip direction="bottom" opacity={1} permanent>
        <span className="mapTooltip">{title}</span>
      </StyledTooltip>
    </Marker>
  )
}

export default observer(PopMarker)
