import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrthoFcir2018Layer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/OrthoZHWMS"
    layers="ortho_s_fcir_2018"
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default ZhOrthoFcir2018Layer
