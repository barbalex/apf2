// @flow
import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const SvoGreyLayer = () =>
  <WMSTileLayer
    url="//wms.zh.ch/FnsSVOZHWMS"
    layers="zonen-schutzverordnungen-raster,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
  />

export default SvoGreyLayer
