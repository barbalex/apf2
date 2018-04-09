// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'

import beobIcon from '../../etc/beob.png'
import beobIconHighlighted from '../../etc/beobHighlighted.png'
import BeobPopup from '../../components/Projekte/Karte/BeobPopup'
import getNearestTpopId from '../../modules/getNearestTpopId'

export default (store: Object): Array<Object> => {
  const { beobs, highlightedIds } = store.map.beobNichtBeurteilt
  const visible = store.map.activeApfloraLayers.includes('BeobNichtBeurteilt')
  if (visible) {
    return beobs.map(beob => {
      const isHighlighted = highlightedIds.includes(beob.id)
      const latLng = new window.L.LatLng(...beob.KoordWgs84)
      const icon = window.L.icon({
        iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
        iconSize: [24, 24],
        className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
      })
      return window.L.marker(latLng, {
        title: beob.label,
        icon,
        draggable: store.map.beob.assigning,
        zIndexOffset: -store.map.apfloraLayers.findIndex(
          apfloraLayer => apfloraLayer.value === 'BeobNichtBeurteilt'
        ),
      })
        .bindPopup(
          ReactDOMServer.renderToStaticMarkup(
            <BeobPopup store={store} beob={beob} />
          )
        )
        .on('moveend', event => {
          /**
           * assign to nearest tpop
           * point url to moved beob
           * open form of beob?
           */
          const { tree, insertBeobzuordnung } = store
          const { activeNodes } = tree
          const nearestTpopId = getNearestTpopId(store, event.target._latlng)
          const newActiveNodeArray = [
            'Projekte',
            activeNodes.projekt,
            'Arten',
            activeNodes.ap,
            'nicht-beurteilte-Beobachtungen',
            beob.id,
          ]
          tree.setActiveNodeArray(newActiveNodeArray)
          insertBeobzuordnung(tree, beob, 'TPopId', nearestTpopId)
        })
    })
  }
  return []
}
