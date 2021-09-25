import React, { useContext, useCallback } from 'react'
import { Polyline, Popup } from 'react-leaflet'
import get from 'lodash/get'
import styled from 'styled-components'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'

import storeContext from '../../../../../storeContext'
import appBaseUrl from '../../../../../modules/appBaseUrl'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledButton = styled(Button)`
  margin-top: 5px !important;
`

const Line = ({ treeName, beob }) => {
  const store = useContext(storeContext)
  const { openTree2WithActiveNodeArray } = store
  const { projIdInActiveNodeArray, apIdInActiveNodeArray } = store[treeName]
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const { idsFiltered } = store[treeName].map

  const isHighlighted = idsFiltered.includes(beob.id)
  const beobLatLng =
    typeof window !== 'undefined'
      ? new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
      : []
  const tpopLong = get(beob, 'tpopByTpopId.wgs84Long')
  const tpopLat = get(beob, 'tpopByTpopId.wgs84Lat')
  const tpopLatLng =
    tpopLong && tpopLat
      ? typeof window !== 'undefined'
        ? new window.L.LatLng(tpopLat, tpopLong)
        : []
      : beobLatLng
  // some dates are not valid
  // need to account for that
  let datum = '(kein Datum)'
  if (!isValid(new Date(beob.datum))) {
    datum = '(ungültiges Datum)'
  } else if (!!beob.datum) {
    datum = format(new Date(beob.datum), 'yyyy.MM.dd')
  }
  const autor = beob.autor || '(kein Autor)'
  const quelle = get(beob, 'quelle', '')

  const popId = get(beob, 'tpopByTpopId.popId', '')
  const tpopId = get(beob, 'tpopByTpopId.id', '')
  const openBeobInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray([
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Beobachtungen',
      beob.id,
    ])
  }, [apId, beob.id, openTree2WithActiveNodeArray, popId, projId, tpopId])
  const openBeobInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Aktionspläne/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${
      beob.id
    }`
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }
  }, [apId, beob.id, popId, projId, tpopId])

  const openTpopInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray([
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
    ])
  }, [apId, openTree2WithActiveNodeArray, popId, projId, tpopId])
  const openTpopInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Aktionspläne/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }
  }, [apId, popId, projId, tpopId])

  return (
    <Polyline
      positions={[beobLatLng, tpopLatLng]}
      color={isHighlighted ? 'yellow' : '#FF00FF'}
    >
      <Popup>
        <>
          <StyledH3>Zuordnung</StyledH3>
          <div>einer Beobachtung</div>
          <div>{`von ${get(beob, 'aeTaxonomyByArtId.artname', '')}`}</div>
          <div>{`am ${datum}`}</div>
          <div>{`durch ${autor}`}</div>
          <div>
            {`bei: ${beob.lv95X.toLocaleString(
              'de-ch',
            )} / ${beob.lv95Y.toLocaleString('de-ch')}`}
          </div>
          <div>{`zur Teil-Population: ${get(
            beob,
            'tpopByTpopId.nr',
            '(keine Nr)',
          )}: ${get(beob, 'tpopByTpopId.flurname', '(kein Flurname)')}`}</div>
          <div>{`Quelle: ${quelle}`}</div>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openBeobInTab}
          >
            Beob. in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openBeobInTree2}
          >
            Beob. in Strukturbaum 2 öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openTpopInTab}
          >
            TPop. in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openTpopInTree2}
          >
            TPop. in Strukturbaum 2 öffnen
          </StyledButton>
        </>
      </Popup>
    </Polyline>
  )
}

export default observer(Line)
