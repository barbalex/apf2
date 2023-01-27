import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

const SvoColorLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsSVOZHWMS"
    layers="zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default SvoColorLayer
