import { WMSTileLayer, Pane } from 'react-leaflet'

// https://wms.zh.ch/WaldEGZH?SERVICE=WMS&Request=GetCapabilities

export const ZhForstreviereWms = () => (
  <Pane
    className="ZhForstreviereWms"
    name="ZhForstreviereWTF"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="//wms.zh.ch/WaldEGZH"
      layers="forstreviere"
      opacity={0.5}
      transparent={true}
      version="1.3.0"
      format="image/png"
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={22}
    />
  </Pane>
)
