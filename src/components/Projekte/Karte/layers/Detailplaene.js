// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'

import popupFromProperties from './popupFromProperties'
import fetchDetailplaene from '../../../../modules/fetchDetailplaene'

const style = () => ({ fill: false, color: 'red', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const DetailplaeneLayer = ({
  detailplaene,
  setDetailplaene,
  errorState,
}:{
  detailplaene: Object,
  setDetailplaene: () => void,
  errorState: Object,
}) => {
  !detailplaene && fetchDetailplaene({ setDetailplaene, errorState })

  return (
    detailplaene &&
    <GeoJSON
      data={detailplaene}
      style={style}
      onEachFeature={onEachFeature}
    />
  )
}

export default DetailplaeneLayer
