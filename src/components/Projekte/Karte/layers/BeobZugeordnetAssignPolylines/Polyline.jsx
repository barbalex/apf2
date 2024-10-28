import { useContext, useCallback } from 'react'
import { Polyline as LeafletPolyline, Popup } from 'react-leaflet'
import styled from '@emotion/styled'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router-dom'

import { StoreContext } from '../../../../../storeContext.js'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.js'
import { useSearchParamsState } from '../../../../../modules/useSearchParamsState.js'
import { isMobilePhone } from '../../../../../modules/isMobilePhone.js'
import { Data } from '../BeobData/index.jsx'

const StyledH3 = styled.h3`
  margin: 7px 0;
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

export const Polyline = observer(({ beob }) => {
  const { apId, projId, beobId } = useParams()
  const { search } = useLocation()

  const store = useContext(StoreContext)
  const { openTree2WithActiveNodeArray } = store

  const isHighlighted = beobId === beob.id
  const beobLatLng = new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
  const tpopLong = beob?.tpopByTpopId?.wgs84Long
  const tpopLat = beob?.tpopByTpopId?.wgs84Lat
  const tpopLatLng =
    tpopLong && tpopLat ? new window.L.LatLng(tpopLat, tpopLong) : beobLatLng
  // some dates are not valid
  // need to account for that
  let datum = '(kein Datum)'
  if (!isValid(new Date(beob.datum))) {
    datum = '(ungültiges Datum)'
  } else if (beob.datum) {
    datum = format(new Date(beob.datum), 'yyyy.MM.dd')
  }
  const autor = beob.autor ?? '(kein Autor)'
  const quelle = beob?.quelle ?? ''

  const popId = beob?.tpopByTpopId?.popId ?? ''
  const tpopId = beob?.tpopByTpopId?.id ?? ''

  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const openBeobInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Beobachtungen',
        beob.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })
  }, [
    apId,
    beob.id,
    openTree2WithActiveNodeArray,
    popId,
    projId,
    projekteTabs,
    search,
    setProjekteTabs,
    tpopId,
  ])
  const openBeobInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${
      beob.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [apId, beob.id, popId, projId, tpopId])

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
        tpopId,
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
    tpopId,
  ])

  const openTpopInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [apId, popId, projId, tpopId])

  return (
    <LeafletPolyline
      positions={[beobLatLng, tpopLatLng]}
      color={isHighlighted ? 'yellow' : '#FF00FF'}
    >
      <Popup>
        <>
          <StyledH3>Zuordnung</StyledH3>
          <div>einer Beobachtung</div>
          <Info>
            <div>von:</div>
            <div>{beob?.aeTaxonomyByArtId?.artname ?? ''}</div>
            <div>am:</div>
            <div>{datum}</div>
            <div>durch:</div>
            <div>{autor}</div>
            <div>bei:</div>
            <div>
              {`${beob.lv95X?.toLocaleString(
                'de-ch',
              )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
            </div>
            <div>zur T-Pop:</div>
            <div>{`${beob?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
              beob?.tpopByTpopId?.flurname ?? '(kein Flurname)'
            }`}</div>
            <div>Quelle:</div>
            <div>{quelle}</div>
          </Info>
          <StyledButton
            size="small"
            variant="text"
            color="inherit"
            onClick={openBeobInTab}
            fullWidth
          >
            Beob. in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="text"
            color="inherit"
            onClick={openBeobInTree2}
            fullWidth
          >
            Beob. in Strukturbaum 2 öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="text"
            color="inherit"
            onClick={openTpopInTab}
            fullWidth
          >
            TPop. in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="text"
            color="inherit"
            onClick={openTpopInTree2}
            fullWidth
          >
            TPop. in Strukturbaum 2 öffnen
          </StyledButton>
          <Data id={beob.id} />
        </>
      </Popup>
    </LeafletPolyline>
  )
})
