import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'

import tpopIcon from '../etc/tpop.svg'
import tpopIconHighlighted from '../etc/tpopHighlighted.svg'
import TpopPopup from '../components/Projekte/Karte/TpopPopup'

export default (store) => {
  const { tpops, labelUsingNr, highlightedIds, visible } = store.map.tpop
  const mcgOptions = {
    maxClusterRadius: 60,
    iconCreateFunction: function (cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedTpop = some(markers, (m) => m.options.icon.options.className === `tpopIconHighlighted`)
      const className = hasHighlightedTpop ? `tpopClusterHighlighted` : `tpopCluster`
      return window.L.divIcon({ html: markers.length, className, iconSize: window.L.point(40, 40) })
    },
  }
  const markers = window.L.markerClusterGroup(mcgOptions)
  if (visible) {
    const pops = Array.from(store.table.pop.values())
    tpops.forEach((p) => {
      if (p.TPopKoordWgs84) {
        let title = labelUsingNr ? p.TPopNr : p.TPopFlurname
        // beware: leaflet needs title to always be a string
        if (title && title.toString) {
          title = title.toString()
        }
        let tooltipText = store.map.pop.labelUsingNr ? p.TPopNr : p.TPopFlurname
        if (tooltipText && tooltipText.toString) {
          tooltipText = tooltipText.toString()
        }
        const tooltipOptions = {
          permanent: true,
          direction: `bottom`,
          className: `mapTooltip`,
          opacity: 1,
        }
        const isHighlighted = highlightedIds.includes(p.TPopId)
        const latLng = new window.L.LatLng(...p.TPopKoordWgs84)
        const icon = window.L.icon({
          iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
          iconSize: [24, 24],
          // iconAnchor: [12, 12],
          className: isHighlighted ? `tpopIconHighlighted` : `tpopIcon`,
        })
        const pop = pops.find(pop => pop.PopId === p.PopId)
        const marker = window.L.marker(latLng, {
          title,
          icon,
        // }).bindPopup(title)
      }).bindPopup(ReactDOMServer.renderToStaticMarkup(<TpopPopup store={store} pop={pop} tpop={p} />))
          .bindTooltip(tooltipText, tooltipOptions)
        markers.addLayer(marker)
      }
    })
  }
  return markers
}
