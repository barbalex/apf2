// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'

const popupFromProperties = p =>
  `<div>
    ${Object.entries(p)
      .filter(e => !!e[1])
      .sort()
      .map(
        entry =>
          `<div style="display:flex;justify-content:space-between;">
        <div>${entry[0]}:</div><div>${entry[1]}</div>
      </div>`
      )
      .join('')}
  </div>`
const style = () => ({ fill: false, color: 'red', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const DetailplaeneLayer = ({ store }) => {
  const data = toJS(store.map.detailplaene)
  !data && store.map.fetchDetailplaene()

  return (
    data && <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
  )
}

export default inject('store')(DetailplaeneLayer)
