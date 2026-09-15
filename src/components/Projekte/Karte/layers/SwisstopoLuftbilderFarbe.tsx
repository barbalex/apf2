import { Pane, WMSTileLayer } from 'react-leaflet'

// was: https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
// Fabio, 2026.02.12:
// URL: https://wms.geo.admin.ch/
// Quelle: crs=epsg:2056&dpiMode=7&format=image/png&layers=ch.swisstopo.swissimage&styles&url=https://wms.geo.admin.ch/

// QGIS-specific WMS parameter, not typed in leaflet's WMSOptions
// but forwarded to the WMS request by react-leaflet
const qgisWmsParams = {
  dpiMode: 7,
}

export const SwisstopoLuftbilderFarbe = () => (
  <Pane
    className="SwisstopoLuftbilderFarbe"
    name="SwisstopoLuftbilderFarbe"
    style={{ zIndex: 100 }}
  >
    <WMSTileLayer
      url="https://wms.geo.admin.ch/"
      layers="ch.swisstopo.swissimage"
      format="image/png"
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
      // eventHandlers={{
      //   tileerror: onTileErrorDebounced,
      // }}
      {...qgisWmsParams}
    />
  </Pane>
)
