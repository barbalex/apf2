import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities
// was: https://wms.zh.ch/OrthoZHWMS?SERVICE=WMS&Request=GetCapabilities
// 2026.02.12, Fabio:
// Orthofoto ZH Sommer 2024/25 aus QGIS mit folgendem WMS-Link:
// URL: https://wms.zh.ch/OrthoZHWMS
// Quelle: crs=EPSG:2056&dpiMode=7&featureCount=10&format=image/png&layers=ortho_s_2024&styles&tilePixelRatio=0&url=https://wms.zh.ch/OrthoZHWMS

export const ZhOrthoAktuellRgb = () => (
  <Pane
    className="ZhOrthoAktuellRgb"
    name="ZhOrthoAktuellRgb"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/OrthoZHWMS"
      // layers="OGDOrthoZH"
      // above layer adds tiling which is not desired here
      // WARNING: when updating, also update layer name here:
      // ../LayersControl/BaseLayers/index.tsx
      layers="ortho_s"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
      dpiMode={7}
      tilePixelRatio={0}
    />
  </Pane>
)
