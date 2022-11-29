import React, { useContext, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'

import storeContext from '../../../../../storeContext'
import beobIcon from './beob.svg'
import beobIconHighlighted from './beobHighlighted.svg'
import appBaseUrl from '../../../../../modules/appBaseUrl'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledButton = styled(Button)`
  margin-top: 5px !important;
`

const BeobNichtZuzuordnenMarker = ({ treeName, beob }) => {
  const store = useContext(storeContext)
  const { openTree2WithActiveNodeArray } = store
  const { projIdInActiveNodeArray, apIdInActiveNodeArray, activeNodeArray } =
    store[treeName]
  const projId =
    projIdInActiveNodeArray ?? '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray ?? '99999999-9999-9999-9999-999999999999'

  const isHighlighted = activeNodeArray[activeNodeArray.length - 1] === beob.id
  const latLng =
    typeof window !== 'undefined'
      ? new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
      : {}
  const icon =
    typeof window !== 'undefined'
      ? window.L.icon({
          iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
          iconSize: [24, 24],
          className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
        })
      : {}
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
  const openBeobInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray([
      'Projekte',
      projId,
      'Arten',
      apId,
      'nicht-zuzuordnende-Beobachtungen',
      beob.id,
    ])
  }, [apId, beob.id, openTree2WithActiveNodeArray, projId])
  const openBeobInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/nicht-zuzuordnende-Beobachtungen/${
      beob.id
    }`
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }
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
            variant="outlined"
            onClick={openBeobInTab}
            color="inherit"
          >
            Formular in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            onClick={openBeobInTree2}
            color="inherit"
          >
            Formular in Strukturbaum 2 öffnen
          </StyledButton>
        </>
      </Popup>
    </Marker>
  )
}

export default observer(BeobNichtZuzuordnenMarker)
