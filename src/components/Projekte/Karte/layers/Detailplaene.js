import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { observer } from 'mobx-react-lite'

import popupFromProperties from './popupFromProperties'
import fetchDetailplaene from '../../../../modules/fetchDetailplaene'
import storeContext from '../../../../storeContext'

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'red',
  weight: 1,
  opacity: 1,
})

const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const DetailplaeneLayer = () => {
  const store = useContext(storeContext)
  const { detailplaene, setDetailplaene } = store
  !detailplaene && fetchDetailplaene({ setDetailplaene, store })

  if (!detailplaene) return null
  return (
    <GeoJSON data={detailplaene} style={style} onEachFeature={onEachFeature} />
  )
}

export default observer(DetailplaeneLayer)
