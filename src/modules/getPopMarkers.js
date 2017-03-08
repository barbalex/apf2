import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'

import popIcon from '../etc/pop.svg'
import popIconHighlighted from '../etc/popHighlighted.svg'
import PopPopup from '../components/Projekte/Karte/PopPopup'

export default (store) => {
  const { pops, labelUsingNr, highlightedIds, visible } = store.map.pop
  const mcgOptions = {
    maxClusterRadius: 66,
    iconCreateFunction: function (cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedPop = some(markers, (m) => m.options.icon.options.className === `popIconHighlighted`)
      const className = hasHighlightedPop ? `popClusterHighlighted` : `popCluster`
      return window.L.divIcon({ html: markers.length, className, iconSize: window.L.point(40, 40) })
    },
  }
  const markers = window.L.markerClusterGroup(mcgOptions)
  if (visible) {
    pops.forEach((p) => {
      if (p.PopKoordWgs84) {
        let title = labelUsingNr ? p.PopNr : p.PopName
        // beware: leaflet needs title to always be a string
        if (title && title.toString) {
          title = title.toString()
        }
        const tooltipOptions = {
          permanent: true,
          direction: `bottom`,
          className: `mapTooltip`,
          opacity: 1,
        }
        const isHighlighted = highlightedIds.includes(p.PopId)
        const latLng = new window.L.LatLng(...p.PopKoordWgs84)
        const icon = window.L.icon({
          iconUrl: isHighlighted ? popIconHighlighted : popIcon,
          iconSize: [24, 24],
          className: isHighlighted ? `popIconHighlighted` : `popIcon`,
        })
        const marker = window.L.marker(latLng, {
          title,
          icon,
        }).bindPopup(ReactDOMServer.renderToStaticMarkup(<PopPopup pop={p} />))
          .bindTooltip(title, tooltipOptions)
        markers.addLayer(marker)
      }
    })
  }
  return markers
}
