// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const LichtwaldLayer = () =>
  <WMSTileLayer
    url="//wms.zh.ch/WaldVKWMS"
    layers="waldgesellschaften,beschriftung-einheit-nach-ek72"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
  />

export default LichtwaldLayer
