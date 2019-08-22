import React, { useContext, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'
import get from 'lodash/get'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Button from '@material-ui/core/Button'

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
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered } = store[treeName].map

  const isHighlighted = idsFiltered.includes(beob.id)
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
  } else if (!!beob.datum) {
    datum = format(new Date(beob.datum), 'yyyy.MM.dd')
  }
  const autor = beob.autor || '(kein Autor)'
  const quelle = get(beob, 'beobQuelleWerteByQuelleId.name', '')
  const label = `${datum}: ${autor} (${quelle})`
  const openBeobInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray([
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'nicht-zuzuordnende-Beobachtungen',
      beob.id,
    ])
  }, [ap, beob.id, openTree2WithActiveNodeArray, projekt])
  const openBeobInTab = useCallback(() => {
    typeof window !== 'undefined' &&
      window.open(
        `${appBaseUrl()}Daten/Projekte/${projekt}/Aktionspläne/${ap}/nicht-zuzuordnende-Beobachtungen/${
          beob.id
        }`,
      )
  }, [ap, beob.id, projekt])

  return (
    <Marker position={latLng} icon={icon} title={label}>
      <Popup>
        <>
          <div>{`Beobachtung von ${get(
            beob,
            'aeEigenschaftenByArtId.artname',
            '',
          )}`}</div>
          <StyledH3>{label}</StyledH3>
          <div>
            {`Koordinaten: ${beob.lv95X.toLocaleString(
              'de-ch',
            )} / ${beob.lv95Y.toLocaleString('de-ch')}`}
          </div>
          <StyledButton size="small" variant="outlined" onClick={openBeobInTab}>
            Formular in neuem Tab öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            onClick={openBeobInTree2}
          >
            Formular in Strukturbaum 2 öffnen
          </StyledButton>
        </>
      </Popup>
    </Marker>
  )
}

export default observer(BeobNichtZuzuordnenMarker)
