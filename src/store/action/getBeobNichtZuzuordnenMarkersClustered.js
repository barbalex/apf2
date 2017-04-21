// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'

import beobIcon from '../../etc/beobNichtZuzuordnen.png'
import beobIconHighlighted from '../../etc/beobNichtZuzuordnenHighlighted.png'
import BeobPopup from '../../components/Projekte/Karte/BeobPopup'

export default (store: Object): Object => {
  const { beobs, highlightedIds } = store.map.beobNichtZuzuordnen
  const visible = store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
  const mcgOptions = {
    maxClusterRadius: 66,
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedTpop = some(
        markers,
        m => m.options.icon.options.className === `beobIconHighlighted`
      )
      const className = hasHighlightedTpop
        ? `beobNichtZuzuordnenClusterHighlighted`
        : `beobNichtZuzuordnenCluster`
      return window.L.divIcon({
        html: markers.length,
        className,
        iconSize: window.L.point(40, 40)
      })
    }
  }
  const markers = window.L.markerClusterGroup(mcgOptions)
  if (visible) {
    beobs.forEach(p => {
      const isHighlighted = highlightedIds.includes(p.id)
      const latLng = new window.L.LatLng(...p.KoordWgs84)
      const icon = window.L.icon({
        iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
        iconSize: [24, 24],
        className: isHighlighted ? `beobIconHighlighted` : `beobIcon`
      })
      const marker = window.L
        .marker(latLng, {
          title: p.label,
          icon,
          zIndexOffset: -store.map.apfloraLayers.findIndex(
            apfloraLayer => apfloraLayer.value === `BeobNichtZuzuordnen`
          )
        })
        .bindPopup(
          ReactDOMServer.renderToStaticMarkup(
            <BeobPopup store={store} beobBereitgestellt={p} />
          )
        )
      markers.addLayer(marker)
    })
  }
  return markers
}
