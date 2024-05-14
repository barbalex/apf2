import React, { useContext, useCallback, useMemo } from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router-dom'

import storeContext from '../../../../../storeContext.js'
import appBaseUrl from '../../../../../modules/appBaseUrl.js'
import { popIconString } from './popIconString'
import { popHighlightedIconString } from './popHighlightedIconString'
import { u as uIcon } from './statusGroup/u'
import { uHighlighted as uIconHighlighted } from './statusGroup/uHighlighted'
import { a as aIcon } from './statusGroup/a'
import { aHighlighted as aIconHighlighted } from './statusGroup/aHighlighted'
import { p as pIcon } from './statusGroup/p'
import { pHighlighted as pIconHighlighted } from './statusGroup/pHighlighted'
import { q as qIcon } from './statusGroup/q'
import { qHighlighted as qIconHighlighted } from './statusGroup/qHighlighted'
import { svg100 } from './statusGroupSymbols/100'
import { svg100Highlighted } from './statusGroupSymbols/100Highlighted'
import { svg101 } from './statusGroupSymbols/101'
import { svg101Highlighted } from './statusGroupSymbols/101Highlighted'
import { svg200 } from './statusGroupSymbols/200'
import { svg200Highlighted } from './statusGroupSymbols/200Highlighted'
import { svg201 } from './statusGroupSymbols/201'
import { svg201Highlighted } from './statusGroupSymbols/201Highlighted'
import { svg202 } from './statusGroupSymbols/202'
import { svg202Highlighted } from './statusGroupSymbols/202Highlighted'
import { svg300 } from './statusGroupSymbols/300'
import { svg300Highlighted } from './statusGroupSymbols/300Highlighted'
import useSearchParamsState from '../../../../../modules/useSearchParamsState.js'
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

  const iconHtml = useMemo(() => {
    let iconHtml = isHighlighted ? popHighlightedIconString : popIconString
    if (popIconName === 'statusGroup') {
      iconHtml = isHighlighted ? qIconHighlighted : qIcon
      if (pop.status === 300) {
        iconHtml = isHighlighted ? pIconHighlighted : pIcon
      } else if (pop.status >= 200) {
        iconHtml = isHighlighted ? aIconHighlighted : aIcon
      } else if (pop.status >= 100) {
        iconHtml = isHighlighted ? uIconHighlighted : uIcon
      }
    } else if (popIconName === 'statusGroupSymbols') {
      iconHtml = isHighlighted ? svg100Highlighted : svg100
      if (pop.status === 100) {
        iconHtml = isHighlighted ? svg100Highlighted : svg100
      } else if (pop.status === 101) {
        iconHtml = isHighlighted ? svg101Highlighted : svg101
      } else if (pop.status === 200) {
        iconHtml = isHighlighted ? svg200Highlighted : svg200
      } else if (pop.status === 201) {
        iconHtml = isHighlighted ? svg201Highlighted : svg201
      } else if (pop.status === 202) {
        iconHtml = isHighlighted ? svg202Highlighted : svg202
      } else if (pop.status === 300) {
        iconHtml = isHighlighted ? svg300Highlighted : svg300
      }
    }
    return iconHtml
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
  const icon = window.L.divIcon({ html: iconHtml })
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
