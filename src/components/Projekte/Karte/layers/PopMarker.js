// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'

import floraIconOrange from '../../../../etc/ic_local_florist_orange.svg'
import floraIconGelb from '../../../../etc/ic_local_florist_yellow.svg'

const PopIcon = window.L.icon({
  iconUrl: floraIconOrange,
  iconSize: [24, 24],
})
const PopIconHighlighted = window.L.icon({
  iconUrl: floraIconGelb,
  iconSize: [24, 24],
})

const enhance = compose(
  inject(`store`),
  observer
)

const Populationen = ({ store, map, ...props }) =>
  <div style={{ display: `none` }}>
    {
      store.map.pop.pops.map((p) => {
        const title = p.PopNr ? `${p.PopNr}: ${p.PopName}` : p.PopName
        const icon = (
          store.map.pop.highlightedIds.includes(p.PopId) ?
          PopIconHighlighted :
          PopIcon
        )
        return (
          <Marker
            position={p.PopKoordWgs84}
            key={p.PopId}
            icon={icon}
            map={map}
            {...props}
          >
            <div>
              <Tooltip
                permanent={true}
                direction="bottom"
                className="mapTooltip"
                opacity="1"
                // offset={window.L.point(0, 75)}
              >
                <div>{store.map.pop.labelUsingNr ? p.PopNr : p.PopName}</div>
              </Tooltip>
              <Popup>
                <span>{p.PopNr}<br />{p.PopName}</span>
              </Popup>
            </div>
          </Marker>
        )
      })
    }
  </div>

export default enhance(Populationen)
