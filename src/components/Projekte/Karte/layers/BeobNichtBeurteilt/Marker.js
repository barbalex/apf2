import React, { useContext, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'
import get from 'lodash/get'
import format from 'date-fns/format'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import mobxStoreContext from '../../../../../mobxStoreContext'
import beobIcon from './beob.svg'
import beobIconHighlighted from './beobHighlighted.svg'
import getNearestTpop from '../../../../../modules/getNearestTpop'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'
import updateBeobByIdGql from './updateBeobById'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

const BeobNichtBeurteiltMarker = ({
  treeName,
  beob,
}: {
  treeName: string,
  beob: Object,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const { assigningBeob, setTreeKey, refetch } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered } = mobxStore[treeName].map

  const isHighlighted = idsFiltered.includes(beob.id)
  const latLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
  const icon = window.L.icon({
    iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
    iconSize: [24, 24],
    className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
  })
  const datum = beob.datum ? format(beob.datum, 'YYYY.MM.DD') : '(kein Datum)'
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
      setTreeKey({
        value: newActiveNodeArray,
        tree: treeName,
        key: 'activeNodeArray',
      })
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
            {`Koordinaten: ${beob.x.toLocaleString(
              'de-ch',
            )} / ${beob.y.toLocaleString('de-ch')}`}
          </div>
          <a
            href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/nicht-beurteilte-Beobachtungen/${
              beob.id
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
        </>
      </Popup>
    </Marker>
  )
}

export default observer(BeobNichtBeurteiltMarker)
