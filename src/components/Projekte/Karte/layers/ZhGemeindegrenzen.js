// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const GemeindegrenzenLayer = () =>
  <WMSTileLayer
    url="//wms.zh.ch/FnsLWZHWMS"
    layers="gemeindegrenzen"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
  />

export default GemeindegrenzenLayer
