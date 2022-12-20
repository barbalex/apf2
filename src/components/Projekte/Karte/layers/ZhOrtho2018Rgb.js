import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrtho2018RgbLayer = () => (
  <Pane
    className="ZhOrtho2018Rgb"
    name="ZhOrtho2018Rgb"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/OrthoZHWMS"
      layers="ortho_s_18"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default ZhOrtho2018RgbLayer
