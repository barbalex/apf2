import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OGDOrthoZH?SERVICE=WMS&Request=GetCapabilities

export const ZhOrthoAktuellRgb = () => (
  <Pane
    className="ZhOrthoAktuellRgb"
    name="ZhOrthoAktuellRgb"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/OGDOrthoZH"
      // layers="OGDOrthoZH"
      // above layer adds tiling which is not desired here
      // WARNING: when updating, also update layer name here:
      // ../LayersControl/BaseLayers/index.tsx
      layers="ortho_s_2024"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)
