import React, { useContext, useCallback } from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { Marker, Popup } from 'react-leaflet'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router-dom'

import storeContext from '../../../../../storeContext'
import { beobIconString } from './beobIconString.js'
import { beobIconHighlightedString } from './beobIconHighlightedString.js'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import useSearchParamsState from '../../../../../modules/useSearchParamsState'
import isMobilePhone from '../../../../../modules/isMobilePhone'
import Data from '../BeobData'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledButton = styled(Button)`
  text-transform: none;
  justify-content: left;
  padding: 2px 0;
`

const BeobNichtZuzuordnenMarker = ({ beob }) => {
  const { apId, projId, beobId } = useParams()
  const { search } = useLocation()

  const store = useContext(storeContext)
  const { openTree2WithActiveNodeArray } = store

  const isHighlighted = beobId === beob.id
  const latLng = new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
  // use divIcon instead? https://leafletjs.com/reference.html#divicon
  const icon = window.L.divIcon({
    html: isHighlighted ? beobIconHighlightedString : beobIconString,
    className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
  })
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
  const label = `${datum}: ${autor} (${quelle})`

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
        'nicht-zuzuordnende-Beobachtungen',
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
    projId,
    projekteTabs,
    search,
    setProjekteTabs,
  ])
  const openBeobInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/nicht-zuzuordnende-Beobachtungen/${
      beob.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [apId, beob.id, projId])

  return (
    <Marker position={latLng} icon={icon} title={label}>
      <Popup>
        <>
          <div>{`Beobachtung von ${
            beob?.aeTaxonomyByArtId?.artname ?? ''
          }`}</div>
          <StyledH3>{label}</StyledH3>
          <div>
            {`Koordinaten: ${beob.lv95X?.toLocaleString(
              'de-ch',
            )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
          </div>
          <StyledButton
            size="small"
            variant="text"
            onClick={openBeobInTab}
            color="inherit"
            fullWidth
          >
            Formular in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="text"
            onClick={openBeobInTree2}
            color="inherit"
            fullWidth
          >
            Formular in Strukturbaum 2 öffnen
          </StyledButton>
          <Data id={beob.id} />
        </>
      </Popup>
    </Marker>
  )
}

export default observer(BeobNichtZuzuordnenMarker)
