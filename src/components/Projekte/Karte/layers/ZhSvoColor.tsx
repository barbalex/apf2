import { WMSTileLayer } from 'react-leaflet'

// https://wms.zh.ch/FnsSchutzanordnungenZH?SERVICE=WMS&Request=GetCapabilities
export const ZhSvoColor = () => (
  <WMSTileLayer
    // url="//wms.zh.ch/FnsSVOZHWMS"
    // layers="zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr"
    url="//wms.zh.ch/FnsSchutzanordnungenZH"
    layers="objekt-umriss,schutzzonen-farbig,zonen-nach-schutzkategorien,ueberlagernde-schutzzonen-naturschutz,schutztyp-naturschutz,ueberlagernde-schutzzonen,schutzzonen-labels" // altrechtliche-schutzverordnungen-a,altrechtliche-schutzverordnungen-c,
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)
