// @flow
import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import popupFromProperties from './popupFromProperties'
import fetchDetailplaene from '../../../../modules/fetchDetailplaene'
import storeContext from '../../../../storeContext'

const style = () => ({ fill: false, color: 'red', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const DetailplaeneLayer = () => {
  const { detailplaene, setDetailplaene, addError } = useContext(storeContext)
  !detailplaene && fetchDetailplaene({ setDetailplaene, addError })

  return (
    detailplaene && (
      <GeoJSON
        data={detailplaene}
        style={style}
        onEachFeature={onEachFeature}
      />
    )
  )
}

export default observer(DetailplaeneLayer)
