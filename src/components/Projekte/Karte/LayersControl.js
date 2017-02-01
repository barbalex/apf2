// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { LayersControl } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import OsmColorLayer from './layers/OsmColor'
import OsmBwLayer from './layers/OsmBw'
import SwissTopoPixelFarbeLayer from './layers/SwisstopoPixelFarbe'
import BingAerialLayer from './layers/BingAerial'

const { BaseLayer } = LayersControl

const enhance = compose(
  inject(`store`),
  observer
)

const MyLayersControl = ({ store }) =>
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
  </LayersControl>

export default enhance(MyLayersControl)
