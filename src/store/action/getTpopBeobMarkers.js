import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import queryString from 'query-string'

import beobIcon from '../../etc/beobZugeordnet.png'
import beobIconHighlighted from '../../etc/beobZugeordnetHighlighted.png'
import BeobPopup from '../../components/Projekte/Karte/BeobPopup'
import getNearestTpopId from '../../modules/getNearestTpopId'

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
        .bindPopup(ReactDOMServer.renderToStaticMarkup(
          <BeobPopup store={store} beobBereitgestellt={p} />
        ))
        .on('moveend', (event) => {
          /**
           * assign to nearest tpop
           * point url to moved beob
           * open form of beob?
           */
          const { activeNodes, history, table, updatePropertyInDb } = store
          const nearestTpopId = getNearestTpopId(store, event.target._latlng)
          const popId = table.tpop.get(nearestTpopId).PopId
          const query = `${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
          const newUrl = `/Projekte/${activeNodes.projekt}/Arten/${activeNodes.ap}/Populationen/${popId}/Teil-Populationen/${nearestTpopId}/Beobachtungen/${p.BeobId}${query}`
          history.push(newUrl)
          updatePropertyInDb(`TPopId`, nearestTpopId)
        })
    })
  }
  return []
}
