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
  const { apfloraLayers, popLabelUsingNr } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { popIdsFiltered } = mobxStore[treeName].map

  let title = popLabelUsingNr ? pop.nr : pop.name
  // beware: leaflet needs title to always be a string
  if (title && title.toString) {
    title = title.toString()
  }
  const isHighlighted = popIdsFiltered.includes(pop.id)
  const latLng = new window.L.LatLng(...epsg2056to4326(pop.x, pop.y))
  const icon = window.L.icon({
    iconUrl: isHighlighted ? popIconHighlighted : popIcon,
    iconSize: [24, 24],
    className: isHighlighted ? 'popIconHighlighted' : 'popIcon',
  })
  const zIndexOffset = -apfloraLayers.findIndex(
    apfloraLayer => apfloraLayer.value === 'pop',
  )
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
