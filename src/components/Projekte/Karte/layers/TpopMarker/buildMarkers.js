// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import styled from 'styled-components'
import get from 'lodash/get'

import tpopIcon from '../../../../../etc/tpop.png'
import tpopIconHighlighted from '../../../../../etc/tpopHighlighted.png'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({
  tpops,
  treeName,
  mapIdsFiltered,
  mobxStore,
}: {
  tpops: Array<Object>,
  treeName: string,
  mapIdsFiltered: Array<String>,
  mobxStore: Object,
}): Array<Object> => {
  const { apfloraLayers, tpopLabelUsingNr } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes

  return tpops.map(tpop => {
    const tpopNr = get(tpop, 'nr', '(keine Nr)')
    const nrLabel = `${get(
      tpop,
      'popByPopId.nr',
      '(keine Nr)',
    )}.${tpopNr}`.toString()
    const isHighlighted = mapIdsFiltered.includes(tpop.id)
    const latLng = new window.L.LatLng(...epsg2056to4326(tpop.x, tpop.y))
    const icon = window.L.icon({
      iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
      iconSize: [24, 24],
      className: isHighlighted ? 'tpopIconHighlighted' : 'tpopIcon',
    })
    return window.L.marker(latLng, {
      // beware: leaflet needs title to always be a string
      title: tpopLabelUsingNr ? tpop.flurname : nrLabel,
      icon,
      zIndexOffset: -apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === 'tpop',
      ),
    })
      .bindPopup(
        ReactDOMServer.renderToStaticMarkup(
          <Fragment>
            <div>Teil-Population</div>
            <StyledH3>
              {`${tpop.nr || '(keine Nr)'}: ${tpop.flurname ||
                '(kein Flurname)'}`}
            </StyledH3>
            <div>
              {`Population: ${get(tpop, 'popByPopId.nr', '(keine Nr)')}: ${get(
                tpop,
                'popByPopId.name',
                '(kein Name)',
              )}`}
            </div>
            <div>
              {`Koordinaten: ${tpop.x.toLocaleString(
                'de-ch',
              )} / ${tpop.y.toLocaleString('de-ch')}`}
            </div>
            <a
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${get(
                tpop,
                'popByPopId.id',
                '',
              )}/Teil-Populationen/${tpop.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Formular in neuem Tab öffnen
            </a>
          </Fragment>,
        ),
      )
      .bindTooltip(tpopLabelUsingNr ? nrLabel : tpop.flurname, {
        permanent: true,
        direction: 'bottom',
        className: 'mapTooltip',
        opacity: 1,
      })
  })
}
