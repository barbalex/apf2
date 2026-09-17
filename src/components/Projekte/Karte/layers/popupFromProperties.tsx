// NOT IN USE
import * as ReactDOMServer from 'react-dom/server'

import { Popup } from './Popup.tsx'

interface PopupFromPropertiesProps {
  properties: Record<string, unknown> | undefined
  layerName: string
  mapSize?: { x: number; y: number } | undefined
}

// alternative: renderToString
// see: https://gis.stackexchange.com/a/356513/13491
export const PopupFromProperties = ({
  properties,
  layerName,
  mapSize,
}: PopupFromPropertiesProps) => {
  const layersData = [
    {
      label: layerName,
      properties: Object.entries(properties ?? {}),
    },
  ]
  const popupContent = ReactDOMServer.renderToString(
    <Popup
      layersData={layersData}
      mapSize={mapSize}
    />,
  )
  return popupContent
}
