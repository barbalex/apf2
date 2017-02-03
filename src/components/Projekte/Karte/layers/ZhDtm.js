// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const DtmLayer = () =>
  <WMSTileLayer
    url="//maps.zh.ch/wms/DTMBackgroundZH"
    layers="dtm"
    transparent={true}
    version="1.3.0"
    format="image/png"
  />

export default DtmLayer
