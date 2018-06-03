// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import format from 'date-fns/format'
import styled from 'styled-components'
import get from 'lodash/get'

import beobIcon from '../../../../../etc/beobNichtZuzuordnen.png'
import beobIconHighlighted from '../../../../../etc/beobNichtZuzuordnenHighlighted.png'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({
  beobs,
  tree,
  activeNodes,
  apfloraLayers,
  store,
  data,
}:{
  beobs: Array<Object>,
  tree: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  store: Object,
  data: Object,
}): Array<Object> => {
  const { map } = store
  const { ap, projekt } = activeNodes
  const { highlightedIds } = map.beobNichtZuzuordnen
  const assigning = get(data, 'assigningBeob')

  return beobs.map(beob => {
    const isHighlighted = highlightedIds.includes(beob.id)
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
        apfloraLayer => apfloraLayer.value === 'BeobNichtZuzuordnen'
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
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/nicht-zuzuordnende-Beobachtungen/${beob.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Formular in neuem Tab öffnen
            </a>
          </Fragment>
        )
      )
  })
}
