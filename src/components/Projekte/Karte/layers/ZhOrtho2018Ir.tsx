import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrthoFcir2018Layer = () => (
  <Pane className="ZhOrtho2018Ir" name="ZhOrtho2018Ir" style={{ zIndex: 100 }}>
    <WMSTileLayer
      url="//wms.zh.ch/OrthoZHWMS"
      layers="ortho_s_fcir_2018"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default ZhOrthoFcir2018Layer
