import { memo, useContext, useCallback, useMemo } from 'react'
import { Marker as LeafletMarker, Tooltip, Popup } from 'react-leaflet'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router'

import { MobxContext } from '../../../../../mobxContext.js'
import { tpopIcon } from './tpopIcon.js'
import { tpopIconHighlighted } from './tpopIconHighlighted.js'
import { u as uIcon } from './statusGroup/u.js'
import { uHighlighted as uIconHighlighted } from './statusGroup/uHighlighted.js'
import { a as aIcon } from './statusGroup/a.js'
import { aHighlighted as aIconHighlighted } from './statusGroup/aHighlighted.js'
import { p as pIcon } from './statusGroup/p.js'
import { pHighlighted as pIconHighlighted } from './statusGroup/pHighlighted.js'
import { q as qIcon } from './statusGroup/q.js'
import { qHighlighted as qIconHighlighted } from './statusGroup/qHighlighted.js'
import { svg100 } from './statusGroupSymbols/100.js'
import { svg100Highlighted } from './statusGroupSymbols/100Highlighted.js'
import { svg101 } from './statusGroupSymbols/101.js'
import { svg101Highlighted } from './statusGroupSymbols/101Highlighted.js'
import { svg200 } from './statusGroupSymbols/200.js'
import { svg200Highlighted } from './statusGroupSymbols/200Highlighted.js'
import { svg201 } from './statusGroupSymbols/201.js'
import { svg201Highlighted } from './statusGroupSymbols/201Highlighted.js'
import { svg202 } from './statusGroupSymbols/202.js'
import { svg202Highlighted } from './statusGroupSymbols/202Highlighted.js'
import { svg300 } from './statusGroupSymbols/300.js'
import { svg300Highlighted } from './statusGroupSymbols/300Highlighted.js'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.js'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.js'

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

export const Marker = memo(
  observer(({ tpop }) => {
    const { apId, projId, tpopId } = useParams()
    const { search } = useLocation()

    const store = useContext(MobxContext)
    const { openTree2WithActiveNodeArray, map } = store
    const { tpopIcon: tpopIconName, tpopLabel: tpopLabelName } = map

    const popNr = tpop?.popByPopId?.nr ?? '(keine Nr)'
    const tpopNr = tpop?.nr ?? '(keine Nr)'
    const nrLabel = `${popNr}.${tpopNr}`.toString()
    const isHighlighted = tpopId === tpop.id

    const iconHtml = useMemo(() => {
      let html = isHighlighted ? tpopIconHighlighted : tpopIcon
      if (tpopIconName === 'statusGroup') {
        html = isHighlighted ? qIconHighlighted : qIcon
        if (tpop.status === 300) {
          html = isHighlighted ? pIconHighlighted : pIcon
        } else if (tpop.status >= 200) {
          html = isHighlighted ? aIconHighlighted : aIcon
        } else if (tpop.status >= 100) {
          html = isHighlighted ? uIconHighlighted : uIcon
        }
      } else if (tpopIconName === 'statusGroupSymbols') {
        html = isHighlighted ? svg100Highlighted : svg100
        if (tpop.status === 100) {
          html = isHighlighted ? svg100Highlighted : svg100
        } else if (tpop.status === 101) {
          html = isHighlighted ? svg101Highlighted : svg101
        } else if (tpop.status === 200) {
          html = isHighlighted ? svg200Highlighted : svg200
        } else if (tpop.status === 201) {
          html = isHighlighted ? svg201Highlighted : svg201
        } else if (tpop.status === 202) {
          html = isHighlighted ? svg202Highlighted : svg202
        } else if (tpop.status === 300) {
          html = isHighlighted ? svg300Highlighted : svg300
        }
      }
      return html
    }, [isHighlighted, tpop.status, tpopIconName])

    const popId = tpop?.popByPopId?.id ?? ''

    // eslint-disable-next-line
    const [projekteTabs, setProjekteTabs] = useProjekteTabs()
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
    const icon = window.L.divIcon({ html: iconHtml })
    let title = nrLabel
    if (tpopLabelName === 'name') title = tpop.flurname
    if (tpopLabelName === 'none') title = ''
    const artname = tpop?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? ''

    return (
      <LeafletMarker
        position={latLng}
        icon={icon}
        title={title}
      >
        <Popup>
          <>
            <div>Teil-Population</div>
            <StyledH3>
              {`${tpop.nr ?? '(keine Nr)'}: ${
                tpop.flurname ?? '(kein Flurname)'
              }`}
            </StyledH3>
            <Info>
              <div>Art:</div>
              <div>{artname}</div>
              <div>Population:</div>
              <div>
                {`${tpop?.popByPopId?.nr ?? '(keine Nr)'}: ${
                  tpop?.popByPopId?.name ?? '(kein Name)'
                }`}
              </div>
              <div>Koordinaten:</div>
              <div>
                {`${tpop.lv95X?.toLocaleString(
                  'de-ch',
                )} / ${tpop.lv95Y?.toLocaleString('de-ch')}`}
              </div>
              <div>Status:</div>
              <div>{`${
                tpop?.popStatusWerteByStatus?.text ?? '(kein Status)'
              }`}</div>
            </Info>
            <StyledButton
              size="small"
              variant="text"
              color="inherit"
              onClick={openTpopInTab}
              fullWidth
            >
              Formular in neuem Fenster öffnen
            </StyledButton>
            <StyledButton
              size="small"
              variant="text"
              color="inherit"
              onClick={openTpopInTree2}
              fullWidth
            >
              Formular in Navigationsbaum 2 öffnen
            </StyledButton>
          </>
        </Popup>
        <StyledTooltip
          direction="bottom"
          opacity={1}
          permanent
        >
          <span className="mapTooltip">{title}</span>
        </StyledTooltip>
      </LeafletMarker>
    )
  }),
)
