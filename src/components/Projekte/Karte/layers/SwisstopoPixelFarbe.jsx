import { de } from 'date-fns/locale'
import { memo } from 'react'
import { TileLayer, Pane } from 'react-leaflet'

// https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml

export const SwisstopoPixelFarbe = memo(() => (
  <Pane
    className="SwisstopoPixelFarbe"
    name="SwisstopoPixelFarbe"
    style={{ zIndex: 100 }}
  >
    <TileLayer
      url="//wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
      attribution='&copy; <a href="//swisstopo.ch">Swisstopo</a>'
      maxNativeZoom={19}
      minZoom={0}
      maxZoom={23}
    />
  </Pane>
))

export default SwisstopoPixelFarbe
