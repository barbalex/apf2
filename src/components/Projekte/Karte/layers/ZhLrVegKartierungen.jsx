import React from 'react'
import { WMSTileLayer } from 'react-leaflet'

// //wms.zh.ch/FnsLRKZHWMS?SERVICE=WMS&Request=GetCapabilities
// legend: //wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=uebersicht&format=image/png&STYLE=default
const LrVegKartierungenLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsLRKZHWMS"
    layers="uebersicht,trocken03,trocken91,trocken89,moore,feucht-10,feucht-08,feucht08-glatt,feucht-07-10,feucht-06,feucht-01,feucht-91,feucht-86,feucht-76-77,feucht-76,feucht-64,feucht-61,auen-93,label-ts03,label-ts91,label-ts89,label-moor,label-fg10,label-fg08-werri,label-fg08-glatt,label-fg07-10,label-fg06,label-fg01,label-fg91,label-fg86,label-fg76-77,label-fg76,label-fg64,label-fg61,label-auen,bezirkslabels"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

export default LrVegKartierungenLayer
