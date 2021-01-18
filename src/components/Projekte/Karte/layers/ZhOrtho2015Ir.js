import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const ZhOrtho2015InfraLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/OrthoZHWMS"
    layers="ortho_w_fcir_2015"
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default ZhOrtho2015InfraLayer
