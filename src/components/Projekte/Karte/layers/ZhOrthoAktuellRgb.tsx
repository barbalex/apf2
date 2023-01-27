import React from 'react'
import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities
/**
 * neu:
 * - ortho_s_fcir_2020 (Orthofoto ZH Sommer FCIR 2020)
 * - ortho_s_2020 (Orthofoto ZH Sommer 2020)
 * - ortho_w_fcir_2021 (Orthofoto ZH Frühjahr FCIR 2021)
 * - ortho_w_2021 (Orthofoto ZH Frühjahr 2021)
 *
 */

const ZhOrthoAktuellRgbLayer = () => (
  <Pane
    className="ZhOrthoAktuellRgb"
    name="ZhOrthoAktuellRgb"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/OGDOrthoZH"
      layers="ortho_s"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)

export default ZhOrthoAktuellRgbLayer
