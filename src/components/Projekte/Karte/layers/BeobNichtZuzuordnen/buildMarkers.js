// @flow
import React from 'react'
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
  treeName,
  data,
  mobxStore,
}: {
  beobs: Array<Object>,
  treeName: string,
  data: Object,
  mobxStore: Object,
}): Array<Object> => {
  const { apfloraLayers, assigningBeob } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered: mapIdsFiltered } = mobxStore[treeName].map

  return beobs.map(beob => {
    const isHighlighted = mapIdsFiltered.includes(beob.id)
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
      draggable: assigningBeob,
      zIndexOffset: -apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === 'beobNichtZuzuordnen',
      ),
    }).bindPopup(
      ReactDOMServer.renderToStaticMarkup(
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
            href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/nicht-zuzuordnende-Beobachtungen/${
              beob.id
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
        </>,
      ),
    )
  })
}
