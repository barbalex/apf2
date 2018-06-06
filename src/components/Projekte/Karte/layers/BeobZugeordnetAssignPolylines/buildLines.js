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
  mapBeobZugeordnetIdsFiltered,
}:{
  beobs: Array<Object>,
  activeNodes: Array<Object>,
  mapBeobZugeordnetIdsFiltered: Array<String>,
}): Array<Object> => {
  const { ap, projekt } = activeNodes

  return beobs.map(beob => {
    const isHighlighted = mapBeobZugeordnetIdsFiltered.includes(beob.id)
    const beobLatLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
    const tpopX = get(beob, 'tpopByTpopId.x')
    const tpopY = get(beob, 'tpopByTpopId.y')
    const tpopLatLng = tpopX && tpopY ? new window.L.LatLng(...epsg2056to4326(tpopX, tpopY)) : beobLatLng
    const datum = beob.datum ? format(beob.datum, 'YYYY.MM.DD') : '(kein Datum)'
    const autor = beob.autor || '(kein Autor)'
    const quelle = get(beob, 'beobQuelleWerteByQuelleId.name', '')

    return window.L.polyline([beobLatLng, tpopLatLng], {
      color: isHighlighted ? 'yellow' : '#FF00FF',
    })
      .bindPopup(
        ReactDOMServer.renderToStaticMarkup(
          <Fragment>
            <StyledH3>Zuordnung</StyledH3>
            <div>einer Beobachtung</div>
            <div>{`von ${get(beob, 'aeEigenschaftenByArtId.artname', '')}`}</div>
            <div>{`am ${datum}`}</div>
            <div>{`durch ${autor}`}</div>
            <div>
              {`bei: ${beob.x.toLocaleString('de-ch')} / ${beob.y.toLocaleString('de-ch')}`}
            </div>
            <div>{`zur Teil-Population: ${get(beob, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(beob, 'tpopByTpopId.flurname', '(kein Flurname)')}`}</div>
            <div>{`Quelle: ${quelle}`}</div>
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
