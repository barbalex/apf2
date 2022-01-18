import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrthoFcirAktuellLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/OGDOrthoZH"
    layers="ortho_s_fcir_2020"
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default ZhOrthoFcirAktuellLayer
