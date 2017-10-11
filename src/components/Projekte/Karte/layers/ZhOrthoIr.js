// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const ZhOrthoFcirLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/OrthoZHWMS"
    layers="ortho_fcir"
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default ZhOrthoFcirLayer
