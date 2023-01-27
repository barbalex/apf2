import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

const UepLayer = () => (
  <Pane className="ZhUep" name="ZhUep" style={{ zIndex: 100 }}>
    <WMSTileLayer
      url="//wms.zh.ch/upwms"
      layers="Uebersichtsplan"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default UepLayer
