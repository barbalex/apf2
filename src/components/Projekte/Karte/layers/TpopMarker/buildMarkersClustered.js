// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'
import get from 'lodash/get'
import styled from 'styled-components'

import tpopIcon from '../../../../../etc/tpop.png'
import tpopIconHighlighted from '../../../../../etc/tpopHighlighted.png'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({ tpops, store }:{ tpops: Array<Object>, store: Object }): Object => {
  const { tree, map } = store
  const { activeNodes } = tree
  const { ap, projekt } = activeNodes
  const { labelUsingNr, highlightedIds } = map.tpop
  
  const mcgOptions = {
    maxClusterRadius: 66,
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedTpop = some(
        markers,
        m => m.options.icon.options.className === 'tpopIconHighlighted'
      )
      const className = hasHighlightedTpop
        ? 'tpopClusterHighlighted'
        : 'tpopCluster'
      return window.L.divIcon({
        html: markers.length,
        className,
        iconSize: window.L.point(40, 40),
      })
    },
  }
  const markers = window.L.markerClusterGroup(mcgOptions)

  tpops.forEach(tpop => {
    const tpopNr = get(tpop, 'nr', '(keine Nr)')
    const nrLabel = `${get(tpop, 'popByPopId.nr', '(keine Nr)')}.${tpopNr}`
    let title = labelUsingNr ? tpop.flurname : nrLabel
    // beware: leaflet needs title to always be a string
    if (title && title.toString) {
      title = title.toString()
    }
    let tooltipText = labelUsingNr ? nrLabel : tpop.flurname
    if (tooltipText && tooltipText.toString) {
      tooltipText = tooltipText.toString()
    }
    const tooltipOptions = {
      permanent: true,
      direction: 'bottom',
      className: 'mapTooltip',
      opacity: 1,
    }
    const isHighlighted = highlightedIds.includes(tpop.id)
    const latLng = new window.L.LatLng(...epsg2056to4326(tpop.x, tpop.y))
    const icon = window.L.icon({
      iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
      iconSize: [24, 24],
      className: isHighlighted ? 'tpopIconHighlighted' : 'tpopIcon',
    })
    const marker = window.L.marker(latLng, {
      title,
      icon,
      zIndexOffset: -store.map.apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === 'Tpop'
      ),
    })
      .bindPopup(
        ReactDOMServer.renderToStaticMarkup(
          <Fragment>
            <div>Teil-Population</div>
            <StyledH3>
              {`${tpop.nr || '(keine Nr)'}: ${tpop.flurname || '(kein Flurname)'}`}
            </StyledH3>
            <div>
              {`Population: ${get(tpop, 'popByPopId.nr', '(keine Nr)')}: ${get(tpop, 'popByPopId.name', '(kein Name)')}`}
            </div>
            <div>
              {`Koordinaten: ${tpop.x.toLocaleString('de-ch')} / ${tpop.y.toLocaleString('de-ch')}`}
            </div>
            <a
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${get(tpop, 'popByPopId.id', '')}/Teil-Populationen/${tpop.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Formular in neuem Tab öffnen
            </a>
          </Fragment>
        )
      )
      .bindTooltip(tooltipText, tooltipOptions)
    markers.addLayer(marker)
  })
  return markers
}
