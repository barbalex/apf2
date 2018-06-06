// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import format from 'date-fns/format'
import styled from 'styled-components'
import get from 'lodash/get'
import app from 'ampersand-app'

import beobIcon from '../../../../../etc/beob.png'
import beobIconHighlighted from '../../../../../etc/beobHighlighted.png'
import getNearestTpop from '../../../../../modules/getNearestTpop'
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
  apfloraLayers,
  data,
  refetchTree,
  mapBeobNichtBeurteiltIdsFiltered,
}:{
  beobs: Array<Object>,
  tree: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  data: Object,
  refetchTree: () => void,
  mapBeobNichtBeurteiltIdsFiltered: Array<String>,
}): Array<Object> => {
  const { ap, projekt } = activeNodes
  const assigning = get(data, 'assigningBeob')
  const { client } = app

  return beobs.map(beob => {
    const isHighlighted = mapBeobNichtBeurteiltIdsFiltered.includes(beob.id)
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
    return window.L.marker(latLng, {
      title: label,
      icon,
      draggable: assigning,
      zIndexOffset: -apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === 'beobNichtBeurteilt'
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
        const nearestTpop = getNearestTpop({
          activeNodes,
          tree,
          client,
          latLng: event.target._latlng
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
            tpopId: nearestTpop.id,
          }
        })
        refetchTree()
      })
  })
}
