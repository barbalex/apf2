// NOT IN USE
import { memo } from 'react'
import * as ReactDOMServer from 'react-dom/server'

import { Popup } from './Popup.jsx'
// alternative: renderToString
// see: https://gis.stackexchange.com/a/356513/13491
export const PopupFromProperties = memo(
  ({ properties, layerName, mapSize }) => {
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
  },
)
