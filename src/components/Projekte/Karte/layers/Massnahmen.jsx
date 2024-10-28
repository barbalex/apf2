import { WMSTileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'

const version = '1.3.0'
const format = 'image/png'

export const Massnahmen = ({ layer }) => {
  const { apId } = useParams()

  if (!apId) return null

  return (
    <WMSTileLayer
      key={`${apId}/${layer}`}
      url={`//wms.prod.qgiscloud.com/FNS/${apId}`}
      layers={layer}
      opacity={0.5}
      transparent={true}
      version={version}
      format={format}
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
      // Wunsch: Nach Status filtern können
      // https://github.com/barbalex/apf2/issues/619#issuecomment-1472497387
      // https://docs.qgis.org/3.22/en/docs/server_manual/services/wms.html#wms-filter
      // params={{ FILTER: `${layer}:"tpopnr" = '1'` }}
      // params={{ FILTER: `${layer}:"tpopnr" IN ( '1' , '2' , '3' , '4' )` }}
    />
  )
}

// example: //wms.prod.qgiscloud.com/FNS/6c52d173-4f62-11e7-aebe-2bd3a2ea4576
