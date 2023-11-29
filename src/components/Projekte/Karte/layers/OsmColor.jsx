import React, { useEffect } from 'react'
import { TileLayer, Pane, useMap } from 'react-leaflet'

const OsmColorLayer = ({ mapContainerRef }) => {
  const map = useMap()

  // need this to prevent map from greying out on resize
  // https://github.com/PaulLeCam/react-leaflet/issues/1074
  useEffect(() => {
    const container = mapContainerRef?.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        console.log('OsmColorLayer, resizeObserver resizing map')
        map.invalidateSize()
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.unobserve(container)
    }
  }, [map, mapContainerRef])

  return (
    <Pane className="OsmColor" name="OsmColor" style={{ zIndex: 100 }}>
      <TileLayer
        url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // only loads sporadic, 2018.06.06. Reinstated 2019.09.14 because supports cors
        //url="//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"  // did not work
        //url="//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"  // did not work
        //url="//tiles.wmflabs.org/osm/{z}/{x}/{y}.png"
        attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
        maxNativeZoom={19}
        minZoom={0}
        maxZoom={23}
      />
    </Pane>
  )
}

export default OsmColorLayer
