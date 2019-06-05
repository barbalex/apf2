import React, { useContext, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'
import get from 'lodash/get'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import Button from '@material-ui/core/Button'

import storeContext from '../../../../../storeContext'
import beobIcon from './beob.svg'
import beobIconHighlighted from './beobHighlighted.svg'
import getNearestTpop from '../../../../../modules/getNearestTpop'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import updateBeobByIdGql from './updateBeobById'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledButton = styled(Button)`
  margin-top: 5px !important;
`

const BeobNichtBeurteiltMarker = ({ treeName, beob }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { assigningBeob, refetch, openTree2WithActiveNodeArray } = store
  const { setActiveNodeArray, map } = store[treeName]
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered } = map

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

  const onMoveend = useCallback(
    async event => {
      /**
       * assign to nearest tpop
       * point url to moved beob
       */
      const nearestTpop = await getNearestTpop({
        activeNodes,
        latLng: event.target._latlng,
        client,
      })
      const newActiveNodeArray = [
        'Projekte',
        activeNodes.projekt,
        'Aktionspläne',
        activeNodes.ap,
        'Populationen',
        nearestTpop.popId,
        'Teil-Populationen',
        nearestTpop.id,
        'Beobachtungen',
        beob.id,
      ]
      setActiveNodeArray(newActiveNodeArray)
      await client.mutate({
        mutation: updateBeobByIdGql,
        variables: {
          id: beob.id,
          tpopId: nearestTpop.id,
        },
      })
      refetch.beobNichtBeurteiltForMap()
      refetch.beobZugeordnetForMap()
      refetch.beobAssignLines()
    },
    [beob.id],
  )
  const openBeobInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray([
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'nicht-beurteilte-Beobachtungen',
      beob.id,
    ])
  }, [beob.id])
  const openBeobInTab = useCallback(() => {
    typeof window !== 'undefined' &&
      window.open(
        `${appBaseUrl()}Daten/Projekte/${projekt}/Aktionspläne/${ap}/nicht-beurteilte-Beobachtungen/${
          beob.id
        }`,
      )
  }, [beob.id])

  return (
    <Marker
      position={latLng}
      icon={icon}
      title={label}
      draggable={assigningBeob}
      onMoveend={onMoveend}
    >
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
          <a
            href={`${appBaseUrl()}Daten/Projekte/${projekt}/Aktionspläne/${ap}/nicht-beurteilte-Beobachtungen/${
              beob.id
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
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

export default observer(BeobNichtBeurteiltMarker)
