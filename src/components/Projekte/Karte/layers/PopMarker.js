// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'

import popIcon from '../../../../etc/pop.svg'
import popIconHighlighted from '../../../../etc/popHighlighted.svg'

const PopIcon = window.L.icon({
  iconUrl: popIcon,
  iconSize: [24, 24],
})
const PopIconHighlighted = window.L.icon({
  iconUrl: popIconHighlighted,
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
