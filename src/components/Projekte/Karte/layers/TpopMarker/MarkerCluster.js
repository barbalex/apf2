import React, { useEffect } from 'react'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const style = { display: 'none' }

const TpopMarkerCluster = ({
  markers,
  leaflet,
}: {
  markers: Object,
  leaflet: Object,
}) => {
  useEffect(() => {
    leaflet.map.addLayer(markers)
    return () => {
      leaflet.map.removeLayer(markers)
    }
  }, [])

  return <div style={style} />
}

export default withLeaflet(TpopMarkerCluster)
