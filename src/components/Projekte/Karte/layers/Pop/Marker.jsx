import React, { useContext, useCallback, useMemo } from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router-dom'

import storeContext from '../../../../../storeContext'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import popIcon from './pop.svg'
import popIconHighlighted from './popHighlighted.svg'
import uIcon from './statusGroup/u.svg'
import uIconHighlighted from './statusGroup/uHighlighted.svg'
import aIcon from './statusGroup/a.svg'
import aIconHighlighted from './statusGroup/aHighlighted.svg'
import pIcon from './statusGroup/p.svg'
import pIconHighlighted from './statusGroup/pHighlighted.svg'
import qIcon from './statusGroup/q.svg'
import qIconHighlighted from './statusGroup/qHighlighted.svg'
import svg100 from './statusGroupSymbols/100.svg'
import svg100Highlighted from './statusGroupSymbols/100_highlighted.svg'
import svg101 from './statusGroupSymbols/101.svg'
import svg101Highlighted from './statusGroupSymbols/101_highlighted.svg'
import svg200 from './statusGroupSymbols/200.svg'
import svg200Highlighted from './statusGroupSymbols/200_highlighted.svg'
import svg201 from './statusGroupSymbols/201.svg'
import svg201Highlighted from './statusGroupSymbols/201_highlighted.svg'
import svg202 from './statusGroupSymbols/202.svg'
import svg202Highlighted from './statusGroupSymbols/202_highlighted.svg'
import svg300 from './statusGroupSymbols/300.svg'
import svg300Highlighted from './statusGroupSymbols/300_highlighted.svg'
import useSearchParamsState from '../../../../../modules/useSearchParamsState'
import isMobilePhone from '../../../../../modules/isMobilePhone'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledTooltip = styled(Tooltip)`
  &:before {
    content: none !important;
  }
`
const StyledButton = styled(Button)`
  text-transform: none;
  justify-content: left;
  padding: 2px 0;
`
const Info = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 5px;
`

const PopMarker = ({ pop }) => {
  const { apId, projId, popId } = useParams()
  const { search } = useLocation()

  const store = useContext(storeContext)
  const { apfloraLayers, openTree2WithActiveNodeArray, map } = store
  const { popIcon: popIconName, popLabel: popLabelName } = map

  const nrLabel = pop?.nr?.toString?.() ?? '(keine Nr)'
  let title = nrLabel
  if (popLabelName === 'name') title = pop?.name ?? '(kein Name)'
  if (popLabelName === 'none') title = ''
  // beware: leaflet needs title to always be a string
  if (title && title.toString) {
    title = title.toString()
  }
  const isHighlighted = popId === pop.id

  const iconUrl = useMemo(() => {
    let iconUrl = isHighlighted ? popIconHighlighted : popIcon
    if (popIconName === 'statusGroup') {
      iconUrl = isHighlighted ? qIconHighlighted : qIcon
      if (pop.status === 300) {
        iconUrl = isHighlighted ? pIconHighlighted : pIcon
      } else if (pop.status >= 200) {
        iconUrl = isHighlighted ? aIconHighlighted : aIcon
      } else if (pop.status >= 100) {
        iconUrl = isHighlighted ? uIconHighlighted : uIcon
      }
    } else if (popIconName === 'statusGroupSymbols') {
      iconUrl = isHighlighted ? svg100Highlighted : svg100
      if (pop.status === 100) {
        iconUrl = isHighlighted ? svg100Highlighted : svg100
      } else if (pop.status === 101) {
        iconUrl = isHighlighted ? svg101Highlighted : svg101
      } else if (pop.status === 200) {
        iconUrl = isHighlighted ? svg200Highlighted : svg200
      } else if (pop.status === 201) {
        iconUrl = isHighlighted ? svg201Highlighted : svg201
      } else if (pop.status === 202) {
        iconUrl = isHighlighted ? svg202Highlighted : svg202
      } else if (pop.status === 300) {
        iconUrl = isHighlighted ? svg300Highlighted : svg300
      }
    }
    return iconUrl
  }, [isHighlighted, pop.status, popIconName])

  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const openPopInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        pop.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })
  }, [
    apId,
    openTree2WithActiveNodeArray,
    pop.id,
    projId,
    projekteTabs,
    search,
    setProjekteTabs,
  ])

  const openPopInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${
      pop.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [apId, pop.id, projId])

  const latLng = new window.L.LatLng(pop.wgs84Lat, pop.wgs84Long)
  const icon = window.L.icon({
    iconUrl,
    iconSize: [24, 24],
  })
  const zIndexOffset = -apfloraLayers.findIndex(
    (apfloraLayer) => apfloraLayer.value === 'pop',
  )
  const artname = pop?.apByApId?.aeTaxonomyByArtId?.artname ?? ''

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
            {`${pop.nr ?? '(keine Nummer)'}: ${pop.name ?? '(kein Name)'}`}
          </StyledH3>
          <Info>
            <div>Art:</div>
            <div>{artname}</div>
            <div>Koordinaten:</div>
            <div>
              {`${pop.lv95X ? pop.lv95X?.toLocaleString('de-ch') : ''} / ${
                pop.lv95Y ? pop.lv95Y?.toLocaleString('de-ch') : ''
              }`}
            </div>
            <div>Status:</div>
            <div>{`${
              pop?.popStatusWerteByStatus?.text ?? '(kein Status)'
            }`}</div>
          </Info>
          <StyledButton
            size="small"
            variant="text"
            color="inherit"
            onClick={openPopInTab}
            fullWidth
          >
            Formular in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="text"
            color="inherit"
            onClick={openPopInTree2}
            fullWidth
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
