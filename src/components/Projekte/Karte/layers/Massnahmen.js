// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useLeaflet } from 'react-leaflet'
import 'leaflet'

import popupFromProperties from './popupFromProperties'

const style = () => ({ fill: false, color: 'red', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const DetailplaeneLayer = () => {
  const { map } = useLeaflet()
  useEffect(() => {
    if (typeof window === 'undefined') return
    new window.L.WFS({
      url: 'http://maps.zh.ch/wfs/FnsAPFloraWFS',
      typeNS: 'topp',
      typeName: 'ms:massnahmenflaechen',
      crs: window.L.CRS.EPSG2056,
      user: 'barbalex',
      style: {
        color: 'blue',
        weight: 2,
      },
    }).addTo(map)
  }, [map])

  return <div style={{ display: 'none' }} />
}

export default observer(DetailplaeneLayer)
