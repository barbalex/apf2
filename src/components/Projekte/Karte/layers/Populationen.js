// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Marker, Popup } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import floraIconOrange from '../../../../etc/ic_local_florist_orange.svg'
import floraIconGelb from '../../../../etc/ic_local_florist_yellow.svg'

const PopIcon = window.L.icon({
  iconUrl: floraIconOrange,
  iconSize: [32, 32],
})
const PopIconFiltered = window.L.icon({
  iconUrl: floraIconGelb,
  iconSize: [32, 32],
})

const enhance = compose(
  inject(`store`),
  observer
)

const Populationen = ({ store, map, ...props }) =>
  <div style={{ display: `none` }}>
    {
      store.popsForKarte.map(p =>
        <Marker
          position={p.PopKoordWgs84}
          key={p.PopId}
          icon={p.filtered ? PopIconFiltered : PopIcon}
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

export default enhance(Populationen)
