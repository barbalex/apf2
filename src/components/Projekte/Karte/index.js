// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import { Map, Marker, Popup, ScaleControl, LayersControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import OsmColorLayer from './layers/OsmColor'
import OsmBwLayer from './layers/OsmBw'
import SwissTopoPixelFarbeLayer from './layers/SwisstopoPixelFarbe'
import BingAerialLayer from './layers/BingAerial'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import epsg4326to21781 from '../../../modules/epsg4326to21781'

const { BaseLayer, Overlay } = LayersControl
const StyledMap = styled(Map)`
  height: 100%;
`

const enhance = compose(
  inject(`store`),
  observer
)

class Karte extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const position = [47.295, 8.58]
    // const bounds = [[45.8300, 5.9700], [47.8100, 10.4900]]
    // const bounds = [[485869.5728, 76443.1884], [837076.5648, 299941.7864]]
    // const position = [685994, 238600]
    // const bounds = [[76443.1884, 485869.5728], [299941.7864, 837076.5648]]
    // const position = [238600, 685994]
    // this does not work
    // see issue on proj4js: https://github.com/proj4js/proj4js/issues/214
    /*
    const crs = new window.L.Proj.CRS(
      `EPSG:21781`,
      `+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs`,
      {
        resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
        bounds,
      }
    )*/

    return (
      <StyledMap
        center={position}
        zoom={11}
        // crs={crs}
        // bounds={bounds}
        onClick={(e) => {
          // epsg4326to21781
          const coord = epsg4326to21781(e.latlng.lng, e.latlng.lat)
          console.log(`Lat, Lon: `, coord)
        }}
      >
        <ScaleControl
          imperial={false}
        />
        <LayersControl>
          <BaseLayer checked name="OpenStreetMap farbig">
            <OsmColorLayer />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap grau">
            <OsmBwLayer />
          </BaseLayer>
          <BaseLayer name="Swisstopo Karte">
            <SwissTopoPixelFarbeLayer />
          </BaseLayer>
          <BaseLayer name="Bing Luftbild">
            <BingAerialLayer />
          </BaseLayer>
          <Overlay name="Marker with popup">
            <Marker position={[51.51, -0.06]}>
              <Popup>
                <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
              </Popup>
            </Marker>
          </Overlay>
        </LayersControl>
      </StyledMap>
    )
  }
}

export default enhance(Karte)
