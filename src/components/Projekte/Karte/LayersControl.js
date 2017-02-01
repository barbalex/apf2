// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Marker, Popup, LayersControl } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import OsmColorLayer from './layers/OsmColor'
import OsmBwLayer from './layers/OsmBw'
import SwissTopoPixelFarbeLayer from './layers/SwisstopoPixelFarbe'
import BingAerialLayer from './layers/BingAerial'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import floraIconGelb from '../../../etc/ic_local_florist_orange.svg'

const { BaseLayer, Overlay } = LayersControl

const enhance = compose(
  inject(`store`),
  observer
)

const PopIcon = window.L.icon({
  iconUrl: floraIconGelb,
  iconSize: [32, 32],
})

const popMarkers = (populationen) => {
  if (populationen.length > 0) {
    return populationen.map(p =>
      <Marker
        position={p.PopKoordWgs84}
        key={p.PopId}
        icon={PopIcon}
        opacity={0.5}
      >
        <Popup>
          <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
        </Popup>
      </Marker>
    )
  }
  return (
    <Marker
      position={[47.295, 8.58]}
      icon={PopIcon}
    >
      <Popup>
        <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
      </Popup>
    </Marker>
  )
}

const MyLayersControl = ({ store }) => {
  const populationen = store.popsForKarte
  return (
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
      <Overlay name="Populationen">
        {
          popMarkers(populationen)
        }
      </Overlay>
      <Overlay name="Marker with popup">
        <Marker position={[51.51, -0.06]}>
          <Popup>
            <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
          </Popup>
        </Marker>
      </Overlay>
    </LayersControl>
  )
}

export default enhance(MyLayersControl)
