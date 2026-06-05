import { WMSTileLayer } from 'react-leaflet'

export const ZhWaelderVegetation = () => (
  <WMSTileLayer
    url="//wms.zh.ch/WaldVKZH"
    layers="waldgesellschaften,beschriftung-einheit-nach-ek72"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)
