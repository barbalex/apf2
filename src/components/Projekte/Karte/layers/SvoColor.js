// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const OsmColorLayer = () =>
  <WMSTileLayer
    url="//wms.zh.ch/FnsSVOZHWMS"
  />

export default OsmColorLayer
