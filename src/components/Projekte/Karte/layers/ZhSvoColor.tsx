import { WMSTileLayer } from 'react-leaflet'

export const ZhSvoColor = () => (
  <WMSTileLayer
    // url="//wms.zh.ch/FnsSVOZHWMS"
    // layers="zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr"
    url="//wms.zh.ch/FnsSchutzanordnungenZH"
    layers="perimeter-schutzanordnungen,objekt-umriss,schutzzonen-farbig,zonen-nach-schutzkategorien,ueberlagernde-schutzzonen-naturschutz,schutztyp-naturschutz,ueberlagernde-schutzzonen,altrechtliche-schutzverordnungen-a,altrechtliche-schutzverordnungen-c,schutzzonen-labels"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)
