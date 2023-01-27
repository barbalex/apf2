import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

const ZhOrthoFcirAktuellLayer = () => (
  <Pane
    className="ZhOrthoAktuellIr"
    name="ZhOrthoAktuellIr"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/OGDOrthoZH"
      layers="ortho_s_fcir_2020"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default ZhOrthoFcirAktuellLayer
