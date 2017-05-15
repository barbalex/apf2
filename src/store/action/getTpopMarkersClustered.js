// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'

import tpopIcon from '../../etc/tpop.png'
import tpopIconHighlighted from '../../etc/tpopHighlighted.png'
import TpopPopup from '../../components/Projekte/Karte/TpopPopup'

export default (store: Object): Object => {
  const { tpops, labelUsingNr, highlightedIds } = store.map.tpop
  const visible = store.map.activeApfloraLayers.includes('Tpop')
  const mcgOptions = {
    maxClusterRadius: 66,
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedTpop = some(
        markers,
        m => m.options.icon.options.className === 'tpopIconHighlighted',
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
  if (visible) {
    const pops = Array.from(store.table.pop.values())
    const tpopsWithKoord = tpops.filter(tpop => tpop.TPopKoordWgs84)
    tpopsWithKoord.forEach(tpop => {
      const pop = pops.find(pop => pop.PopId === tpop.PopId)
      const popNr = pop && (pop.PopNr || pop.PopNr === 0) ? pop.PopNr : ''
      const tpopNr = tpop.TPopNr || tpop.TPopNr === 0 ? tpop.TPopNr : ''
      const nrLabel = `${popNr}.${tpopNr}`
      let title = labelUsingNr ? tpop.TPopFlurname : nrLabel
      // beware: leaflet needs title to always be a string
      if (title && title.toString) {
        title = title.toString()
      }
      let tooltipText = store.map.pop.labelUsingNr ? nrLabel : tpop.TPopFlurname
      if (tooltipText && tooltipText.toString) {
        tooltipText = tooltipText.toString()
      }
      const tooltipOptions = {
        permanent: true,
        direction: 'bottom',
        className: 'mapTooltip',
        opacity: 1,
      }
      const isHighlighted = highlightedIds.includes(tpop.TPopId)
      const latLng = new window.L.LatLng(...tpop.TPopKoordWgs84)
      const icon = window.L.icon({
        iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
        iconSize: [24, 24],
        className: isHighlighted ? 'tpopIconHighlighted' : 'tpopIcon',
      })
      const marker = window.L
        .marker(latLng, {
          title,
          icon,
          zIndexOffset: -store.map.apfloraLayers.findIndex(
            apfloraLayer => apfloraLayer.value === 'Tpop',
          ),
        })
        .bindPopup(
          ReactDOMServer.renderToStaticMarkup(
            <TpopPopup store={store} pop={pop} tpop={tpop} />,
          ),
        )
        .bindTooltip(tooltipText, tooltipOptions)
      markers.addLayer(marker)
    })
  }
  return markers
}
