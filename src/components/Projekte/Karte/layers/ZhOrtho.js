// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const ZhOrthoLayer = () =>
  <WMSTileLayer
    url="//agabriel:4zC6MgjM@wms.zh.ch/OrthoZHWMS"
    layers="orthophotos"
    version="1.3.0"
    format="image/png"
  />

export default ZhOrthoLayer
