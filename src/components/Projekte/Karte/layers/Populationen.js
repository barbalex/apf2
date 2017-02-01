// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Marker, Popup } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import floraIconGelb from '../../../../etc/ic_local_florist_orange.svg'

const PopIcon = window.L.icon({
  iconUrl: floraIconGelb,
  iconSize: [32, 32],
})

const enhance = compose(
  inject(`store`),
  observer
)

const Populationen = ({ store, map, ...props }) => {
  console.log(`Populationen: popsForKarte:`, store.popsForKarte)
  console.log(`Populationen: map:`, map)
  return (
    <div>
      {
        store.popsForKarte.map(p =>
          <Marker
            position={p.PopKoordWgs84}
            key={p.PopId}
            icon={PopIcon}
            map={map}
            {...props}
          >
            <Popup>
              <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
            </Popup>
          </Marker>
        )
      }
    </div>
  )
}

export default enhance(Populationen)
