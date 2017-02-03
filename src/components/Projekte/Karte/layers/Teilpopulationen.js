// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Marker, Popup } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'

import floraIconGreen from '../../../../etc/ic_local_florist_green.svg'
import floraIconGelb from '../../../../etc/ic_local_florist_yellow.svg'

const icon = window.L.icon({
  iconUrl: floraIconGreen,
  iconSize: [28, 28],
})
const iconHighlighted = window.L.icon({
  iconUrl: floraIconGelb,
  iconSize: [28, 28],
})

const enhance = compose(
  inject(`store`),
  observer
)

const Teilpopulationen = ({ store, map, ...props }) =>
  <div style={{ display: `none` }}>
    {
      store.map.layer.tpop.tpops.map((p) => {
        const title = p.TPopNr ? `${p.TPopNr}: ${p.TPopFlurname}` : p.TPopFlurname
        const myIcon = (
          (
            store.map.layer.tpop.highlightedIds.includes(p.TPopId) ||
            store.map.layer.tpop.highlightedPopIds.includes(p.PopId)
          ) ?
          iconHighlighted :
          icon
        )
        return (
          <Marker
            position={p.TPopKoordWgs84}
            key={p.TPopId}
            icon={myIcon}
            map={map}
            title={title}
            {...props}
          >
            <Popup>
              <span>{p.TPopNr}<br />{p.TPopFlurname}</span>
            </Popup>
          </Marker>
        )
      })
    }
  </div>

export default enhance(Teilpopulationen)
