import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrtho2015InfraLayer = () => (
  <Pane className="ZhOrtho2015Ir" name="ZhOrtho2015Ir" style={{ zIndex: 100 }}>
    <WMSTileLayer
      url="//wms.zh.ch/OrthoZHWMS"
      layers="ortho_w_fcir_2015"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default ZhOrtho2015InfraLayer
