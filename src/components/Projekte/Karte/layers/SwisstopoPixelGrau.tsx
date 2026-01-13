import { TileLayer, Pane } from 'react-leaflet'

// https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml

export const SwisstopoPixelGrau = () => (
  <Pane
    className="SwisstopoPixelGrau"
    name="SwisstopoPixelGrau"
    style={{ zIndex: 100 }}
  >
    <TileLayer
      url="//wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg"
      attribution='&copy; <a href="//swisstopo.ch">Swisstopo</a>'
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
)
