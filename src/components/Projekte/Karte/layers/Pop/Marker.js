import React, { useContext, useCallback } from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import Button from '@material-ui/core/Button'

import storeContext from '../../../../../storeContext'
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
const StyledButton = styled(Button)`
  margin-top: 5px !important;
`

const PopMarker = ({ treeName, pop }) => {
  const store = useContext(storeContext)
  const { apfloraLayers, openTree2WithActiveNodeArray } = store
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered, popIcon: popIconName, popLabel: popLabelName } = store[
    treeName
  ].map

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
  const openPopInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray([
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop.id,
    ])
  }, [ap, openTree2WithActiveNodeArray, pop.id, projekt])
  const openPopInTab = useCallback(() => {
    typeof window !== 'undefined' &&
      window.open(
        `${appBaseUrl()}Daten/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${
          pop.id
        }`,
      )
  }, [ap, pop.id, projekt])

  if (typeof window === 'undefined') return null
  const latLng = new window.L.LatLng(pop.wgs84Lat, pop.wgs84Long)
  const icon = window.L.icon({
    iconUrl,
    iconSize: [24, 24],
    className: isHighlighted ? 'popIconHighlighted' : 'popIcon',
  })
  const zIndexOffset = -apfloraLayers.findIndex(
    apfloraLayer => apfloraLayer.value === 'pop',
  )
  const artname = get(pop, 'apByApId.aeTaxonomyByArtId.artname', '')

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
            {`Koordinaten: ${
              pop.lv95X ? pop.lv95X.toLocaleString('de-ch') : ''
            } / ${pop.lv95Y ? pop.lv95Y.toLocaleString('de-ch') : ''}`}
          </div>
          <div>{`Status: ${get(
            pop,
            'popStatusWerteByStatus.text',
            '(kein Status)',
          )}`}</div>
          <StyledButton size="small" variant="outlined" onClick={openPopInTab}>
            Formular in neuem Tab öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            onClick={openPopInTree2}
          >
            Formular in Strukturbaum 2 öffnen
          </StyledButton>
        </>
      </Popup>
      <StyledTooltip direction="bottom" opacity={1} permanent>
        <span className="mapTooltip">{title}</span>
      </StyledTooltip>
    </Marker>
  )
}

export default observer(PopMarker)
