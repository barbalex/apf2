import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import { observer } from 'mobx-react-lite'

import popupFromProperties from './popupFromProperties'
import fetchMarkierungen from '../../../../modules/fetchMarkierungen'
import storeContext from '../../../../storeContext'

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

const MarkierungenLayer = () => {
  const { markierungen, setMarkierungen, addError } = useContext(storeContext)
  !markierungen && fetchMarkierungen({ setMarkierungen, addError })

  return (
    markierungen && (
      <GeoJSON
        data={markierungen}
        style={style}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
    )
  )
}

export default observer(MarkierungenLayer)
