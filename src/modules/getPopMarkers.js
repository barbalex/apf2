import React from 'react'
import 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'

import popIcon from '../etc/pop.svg'
import popIconHighlighted from '../etc/popHighlighted.svg'

export default (store) => {
  const { pops, labelUsingNr, highlightedIds, visible } = store.map.pop
  const mcgOptions = {
    maxClusterRadius: 60,
    iconCreateFunction: function (cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedPop = some(markers, (m) => m.options.icon.options.className === `popIconHighlighted`)
      const className = hasHighlightedPop ? `popClusterHighlighted` : `popCluster`
      return window.L.divIcon({ html: markers.length, className, iconSize: window.L.point(40, 40) })
    },
  }
  const markers = window.L.markerClusterGroup(mcgOptions)
  pops.forEach((p) => {
    if (p.PopKoordWgs84) {
      let title = labelUsingNr ? p.PopNr : p.PopName
      // beware: leaflet needs title to always be a string
      if (title && title.toString) {
        title = title.toString()
      }
      let tooltipText = store.map.pop.labelUsingNr ? p.PopNr : p.PopName
      if (tooltipText && tooltipText.toString) {
        tooltipText = tooltipText.toString()
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
      }).bindPopup(title)
        .bindTooltip(tooltipText, tooltipOptions)
      markers.addLayer(marker)
    }
  })
  return markers
}
