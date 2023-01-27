import React, { useContext, useCallback, useMemo } from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router-dom'

import storeContext from '../../../../../storeContext'
import tpopIcon from './tpop.svg'
import tpopIconHighlighted from './tpopHighlighted.svg'
import uIcon from './statusGroup/u.svg'
import uIconHighlighted from './statusGroup/uHighlighted.svg'
import aIcon from './statusGroup/a.svg'
import aIconHighlighted from './statusGroup/aHighlighted.svg'
import pIcon from './statusGroup/p.svg'
import pIconHighlighted from './statusGroup/pHighlighted.svg'
import qIcon from './statusGroup/q.svg'
import qIconHighlighted from './statusGroup/qHighlighted.svg'
import appBaseUrl from '../../../../../modules/appBaseUrl'
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
  margin-top: 5px !important;
`

const TpopMarker = ({ tpop }) => {
  const { apId, projId, tpopId } = useParams()
  const { search } = useLocation()

  const store = useContext(storeContext)
  const { openTree2WithActiveNodeArray, map } = store
  const { tpopIcon: tpopIconName, tpopLabel: tpopLabelName } = map

  const popNr = tpop?.popByPopId?.nr ?? '(keine Nr)'
  const tpopNr = tpop?.nr ?? '(keine Nr)'
  const nrLabel = `${popNr}.${tpopNr}`.toString()
  const isHighlighted = tpopId === tpop.id

  const iconUrl = useMemo(() => {
    let iconUrl = isHighlighted ? tpopIconHighlighted : tpopIcon
    if (tpopIconName === 'statusGroup') {
      iconUrl = isHighlighted ? qIconHighlighted : qIcon
      if (tpop.status === 300) {
        iconUrl = isHighlighted ? pIconHighlighted : pIcon
      } else if (tpop.status >= 200) {
        iconUrl = isHighlighted ? aIconHighlighted : aIcon
      } else if (tpop.status >= 100) {
        iconUrl = isHighlighted ? uIconHighlighted : uIcon
      }
    } else if (tpopIconName === 'statusGroupSymbols') {
      iconUrl = isHighlighted ? svg100Highlighted : svg100
      if (tpop.status === 100) {
        iconUrl = isHighlighted ? svg100Highlighted : svg100
      } else if (tpop.status === 101) {
        iconUrl = isHighlighted ? svg101Highlighted : svg101
      } else if (tpop.status === 200) {
        iconUrl = isHighlighted ? svg200Highlighted : svg200
      } else if (tpop.status === 201) {
        iconUrl = isHighlighted ? svg201Highlighted : svg201
      } else if (tpop.status === 202) {
        iconUrl = isHighlighted ? svg202Highlighted : svg202
      } else if (tpop.status === 300) {
        iconUrl = isHighlighted ? svg300Highlighted : svg300
      }
    }
    return iconUrl
  }, [isHighlighted, tpop.status, tpopIconName])

  const popId = tpop?.popByPopId?.id ?? ''

  // eslint-disable-next-line
  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const openTpopInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpop.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })
  }, [
    apId,
    openTree2WithActiveNodeArray,
    popId,
    projId,
    projekteTabs,
    search,
    setProjekteTabs,
    tpop.id,
  ])

  const openTpopInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${
      tpop.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [apId, popId, projId, tpop.id])

  const latLng = new window.L.LatLng(tpop.wgs84Lat, tpop.wgs84Long)
  const icon = window.L.icon({
    iconUrl,
    iconSize: [24, 24],
    isHighlighted,
  })
  let title = nrLabel
  if (tpopLabelName === 'name') title = tpop.flurname
  if (tpopLabelName === 'none') title = ''
  const artname = tpop?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? ''

  return (
    <Marker position={latLng} icon={icon} title={title}>
      <Popup>
        <>
          <div>Teil-Population</div>
          <StyledH3>
            {`${tpop.nr ?? '(keine Nr)'}: ${
              tpop.flurname ?? '(kein Flurname)'
            }`}
          </StyledH3>
          <div>{`Art: ${artname}`}</div>
          <div>
            {`Population: ${tpop?.popByPopId?.nr ?? '(keine Nr)'}: ${
              tpop?.popByPopId?.name ?? '(kein Name)'
            }`}
          </div>
          <div>
            {`Koordinaten: ${tpop.lv95X?.toLocaleString(
              'de-ch',
            )} / ${tpop.lv95Y?.toLocaleString('de-ch')}`}
          </div>
          <div>{`Status: ${
            tpop?.popStatusWerteByStatus?.text ?? '(kein Status)'
          }`}</div>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openTpopInTab}
          >
            Formular in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openTpopInTree2}
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

export default observer(TpopMarker)
