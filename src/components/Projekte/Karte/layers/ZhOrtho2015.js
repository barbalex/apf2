// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const ZhOrtho2015Layer = () =>
  <WMSTileLayer
    url="//wms.zh.ch/OrthoZHWMS"
    layers="ortho_sp"
    version="1.3.0"
    format="image/png"
  />

export default ZhOrtho2015Layer
