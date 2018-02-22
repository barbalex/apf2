// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import 'leaflet'

import popupFromProperties from './popupFromProperties'

const style = () => ({ fill: false, color: 'orange', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}
const pTLOptions = {
  radius: 3,
  fillColor: '#ff7800',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
}
const pointToLayer = (feature, latlng) => {
  return window.L.circleMarker(latlng, pTLOptions)
}

const MarkierungenLayer = ({ store }) => {
  const data = toJS(store.map.markierungen)
  !data && store.map.fetchMarkierungen()

  return (
    data && (
      <GeoJSON
        data={data}
        style={style}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
    )
  )
}

export default inject('store')(MarkierungenLayer)
