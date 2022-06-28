import React from 'react'
import * as ReactDOMServer from 'react-dom/server'

import Popup from './Popup'
// alternative: renderToString
// see: https://gis.stackexchange.com/a/356513/13491
const PopupFromProperties = ({ properties, layerName, mapSize }) => {
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

export default PopupFromProperties
