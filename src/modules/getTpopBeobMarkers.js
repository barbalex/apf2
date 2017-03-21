import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'

import beobIcon from '../etc/beob.png'
import beobIconHighlighted from '../etc/beobHighlighted.png'
import BeobPopup from '../components/Projekte/Karte/BeobPopup'

export default (store) => {
  const { beobs, highlightedIds } = store.map.tpopBeob
  const visible = store.map.activeApfloraLayers.includes(`TpopBeob`)

  if (visible) {
    return beobs.map((p) => {
      const title = p.label
      const isHighlighted = highlightedIds.includes(p.BeobId)
      const latLng = new window.L.LatLng(...p.KoordWgs84)
      const icon = window.L.icon({
        iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
        iconSize: [24, 24],
        className: isHighlighted ? `beobIconHighlighted` : `beobIcon`,
      })
      return window.L.marker(latLng, {
        title,
        icon,
        draggable: store.map.beob.assigning,
        zIndexOffset: -store.map.apfloraLayers.findIndex((apfloraLayer) =>
          apfloraLayer.value === `TpopBeob`
        )
      })
        .bindPopup(ReactDOMServer.renderToStaticMarkup(<BeobPopup store={store} beobBereitgestellt={p} />))
        .on('moveend', (event) => {
          console.log(`latlng:`, event.target._latlng)
        })
    })
  }
  return []
}
