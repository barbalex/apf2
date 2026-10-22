import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/OrthoZHWMS?SERVICE=WMS&Request=GetCapabilities
// before 2026.10.22 (OGD*ZH services were renamed to *ZHWMS): https://wms.zh.ch/OGDOrthoZH

export const ZhOrthoAktuellIr = () => (
  <Pane
    className="ZhOrthoAktuellIr"
    name="ZhOrthoAktuellIr"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/OrthoZHWMS"
      layers="ortho_s_fcir_2020"
      version="1.3.0"
      format="image/png"
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)
