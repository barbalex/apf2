// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import LayersControl from './LayersControl'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure.css'
import epsg4326to21781 from '../../../modules/epsg4326to21781'
import getEncompassingBound from '../../../modules/getEncompassingBound'
import PopMarker from './layers/PopMarker'
import TpopMarker from './layers/TpopMarker'
import MeasureControl from './MeasureControl'
import PngControl from './PngControl'
import CoordinatesControl from './CoordinatesControl'

const StyledMap = styled(Map)`
  height: 100%;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Karte = ({ store }) => {
  // if no active projekt, need to fetch pops of all Projekte
  // uhm, let us not do this
  // if no active ap, need to fetch pops of projekt
  // uhm, let us not do this

  // TODO: define projekt-bounds and use here
  const ktZhBounds = [[47.159, 8.354], [47.696, 8.984]]
  const popBounds = store.map.pop.bounds
  const tpopBounds = store.map.tpop.bounds
  const boundsToUse = [ktZhBounds]
  if (store.map.pop.visible) {
    boundsToUse.push(popBounds)
  }
  if (store.map.tpop.visible) {
    boundsToUse.push(tpopBounds)
  }
  const bounds = getEncompassingBound(boundsToUse)
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
      bounds={bounds}
      preferCanvas
      onMouseMove={store.setMapMouseCoord}
    >
      {
        store.map.pop.visible &&
        <PopMarker />
      }
      {
        store.map.tpop.visible &&
        <TpopMarker />
      }
      <ScaleControl
        imperial={false}
      />
      <LayersControl />
      <MeasureControl />
      <PngControl />
      <CoordinatesControl />
    </StyledMap>
  )
}

export default enhance(Karte)
