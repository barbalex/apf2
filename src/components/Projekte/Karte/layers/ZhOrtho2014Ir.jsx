import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrthoFcirLayer = () => (
  <Pane className="ZhOrtho2014Ir" name="ZhOrtho2014Ir" style={{ zIndex: 100 }}>
    <WMSTileLayer
      url="//wms.zh.ch/OrthoZHWMS"
      layers="ortho_fcir_2014"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default ZhOrthoFcirLayer
