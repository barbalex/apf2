// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import format from 'date-fns/format'
import styled from 'styled-components'
import get from 'lodash/get'

import beobIcon from '../../../../../etc/beob.png'
import beobIconHighlighted from '../../../../../etc/beobHighlighted.png'
import getNearestTpopId from '../../../../../modules/getNearestTpopId'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'
import setTreeKeyGql from './setTreeKey.graphql'
import updateBeobByIdGql from './updateBeobById.graphql'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({
  beobs,
  tree,
  activeNodes,
  client,
  store,
  refetchTree
}:{
  beobs: Array<Object>,
  tree: Object,
  activeNodes: Array<Object>,
  client: Object,
  store: Object,
  refetchTree: () => void
}): Array<Object> => {
  const { map, table } = store
  const { ap, projekt } = activeNodes
  const { highlightedIds } = map.beobNichtBeurteilt

  return beobs.map(beob => {
    const isHighlighted = highlightedIds.includes(beob.id)
    const latLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
    const icon = window.L.icon({
      iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
      iconSize: [24, 24],
      className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
    })
    const label = `${beob.datum ? format(beob.datum, 'YYYY.MM.DD') : '(kein Datum)'}: ${beob.autor || '(kein Autor)'} (${get(beob, 'beobQuelleWerteByQuelleId.name', '')})`
    return window.L.marker(latLng, {
      title: label,
      icon,
      draggable: store.map.beob.assigning,
      zIndexOffset: -store.map.apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === 'BeobNichtBeurteilt'
      ),
    })
      .bindPopup(
        ReactDOMServer.renderToStaticMarkup(
          <Fragment>
            <div>{`Beobachtung von ${get(beob, 'aeEigenschaftenByArtId.artname', '')}`}</div>
            <StyledH3>
              {label}
            </StyledH3>
            <div>
              {`Koordinaten: ${beob.x.toLocaleString(
                'de-ch'
              )} / ${beob.y.toLocaleString('de-ch')}`}
            </div>
            <a
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/nicht-beurteilte-Beobachtungen/${beob.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Formular in neuem Tab öffnen
            </a>
          </Fragment>
        )
      )
      .on('moveend', async event => {
        /**
         * assign to nearest tpop
         * point url to moved beob
         * open form of beob?
         */
        const nearestTpopId = getNearestTpopId({ activeNodes, tree, client, latLng: event.target._latlng })
        const popId = table.tpop.get(nearestTpopId).pop_id
        const newActiveNodeArray = [
          'Projekte',
          activeNodes.projekt,
          'Aktionspläne',
          activeNodes.ap,
          'Populationen',
          popId,
          'Teil-Populationen',
          nearestTpopId,
          'Beobachtungen',
          beob.id,
        ]
        await client.mutate({
          mutation: setTreeKeyGql,
          variables: {
            value: newActiveNodeArray,
            tree: tree.name,
            key: 'activeNodeArray'
          }
        })
        await client.mutate({
          mutation: updateBeobByIdGql,
          variables: {
            id: beob.id,
            tpopId: nearestTpopId,
          }
        })
        refetchTree()
      })
  })
}
