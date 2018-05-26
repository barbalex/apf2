// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import format from 'date-fns/format'
import styled from 'styled-components'
import get from 'lodash/get'

import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({
  beobs,
  activeNodes,
  store
}:{
  beobs: Array<Object>,
  activeNodes: Array<Object>,
  store: Object
}): Array<Object> => {
  const { map } = store
  const { ap, projekt } = activeNodes
  const { highlightedIds } = map.beobZugeordnet

  return beobs.map(beob => {
    const isHighlighted = highlightedIds.includes(beob.id)
    const beobLatLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
    const tpopX = get(beob, 'tpopByTpopId.x')
    const tpopY = get(beob, 'tpopByTpopId.y')
    const tpopLatLng = tpopX && tpopY ? new window.L.LatLng(...epsg2056to4326(tpopX, tpopY)) : beobLatLng
    const datum = beob.datum ? format(beob.datum, 'YYYY.MM.DD') : '(kein Datum)'
    const autor = beob.autor || '(kein Autor)'
    const quelle = get(beob, 'beobQuelleWerteByQuelleId.name', '')
    const label = `${datum}: ${autor} (${quelle})`

    return window.L.polyline([beobLatLng, tpopLatLng], {
      color: isHighlighted ? 'yellow' : '#FF00FF',
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
            <div>{`Teil-Population: ${get(beob, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(beob, 'tpopByTpopId.flurname', '(kein Flurname)')}`}</div>
            <a
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${get(beob, 'tpopByTpopId.popId', '')}/Teil-Populationen/${get(beob, 'tpopByTpopId.id', '')}/Beobachtungen/${
                beob.id
              }`}
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
