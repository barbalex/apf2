// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import some from 'lodash/some'

/**
 * TODO: the svg path on production contains "Projekte/1/" !!??
 * Maybe give an absolute path?
 */
import popIcon from '../../etc/pop.png'
import popIconHighlighted from '../../etc/popHighlighted.png'
import PopPopup from '../../components/Projekte/Karte/PopPopup'

export default (store: Object): Object => {
  const { pops, labelUsingNr, highlightedIds } = store.map.pop
  const visible = store.map.activeApfloraLayers.includes('Pop')
  const mcgOptions = {
    maxClusterRadius: 66,
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedPop = some(
        markers,
        m => m.options.icon.options.className === 'popIconHighlighted'
      )
      const className = hasHighlightedPop
        ? 'popClusterHighlighted'
        : 'popCluster'
      return window.L.divIcon({
        html: markers.length,
        className,
        iconSize: window.L.point(40, 40),
      })
    },
  }
  const markers = window.L.markerClusterGroup(mcgOptions)
  if (visible) {
    pops.forEach(p => {
      if (p.PopKoordWgs84) {
        let title = labelUsingNr ? p.nr : p.name
        // beware: leaflet needs title to always be a string
        if (title && title.toString) {
          title = title.toString()
        }
        const tooltipOptions = {
          permanent: true,
          direction: 'bottom',
          className: 'mapTooltip',
          opacity: 1,
        }
        const isHighlighted = highlightedIds.includes(p.id)
        const latLng = new window.L.LatLng(...p.PopKoordWgs84)
        const icon = window.L.icon({
          iconUrl: isHighlighted ? popIconHighlighted : popIcon,
          iconSize: [24, 24],
          className: isHighlighted ? 'popIconHighlighted' : 'popIcon',
        })
        const marker = window.L.marker(latLng, {
          title,
          icon,
          zIndexOffset: -store.map.apfloraLayers.findIndex(
            apfloraLayer => apfloraLayer.value === 'Pop'
          ),
        })
          .bindPopup(
            ReactDOMServer.renderToStaticMarkup(
              <PopPopup store={store} pop={p} />
            )
          )
          .bindTooltip(title, tooltipOptions)
        markers.addLayer(marker)
      }
    })
  }
  return markers
}
