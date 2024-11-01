import { memo } from 'react'
import { WMSTileLayer } from 'react-leaflet'

export const ZhSvoGrey = memo(() => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsSVOZHWMS"
    layers="zonen-schutzverordnungen-raster,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
))
