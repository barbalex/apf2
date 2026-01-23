// TODO: need to debounce
import axios from 'redaxios'

import { xmlToJson } from '../../../../modules/xmlToJson.ts'

import {
  store as jotaiStore,
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const onTileError = async (map, layer, ignore) => {
  // console.log('onTileError', { ignore, map, layer })
  const mapSize = map.getSize()
  const bbox = map.getBounds().toBBoxString()
  const res = await axios({
    method: 'get',
    url: layer.wms_base_url,
    params: {
      service: 'WMS',
      request: 'GetMap',
      version: layer.wms_version,
      layers: layer.wms_layers,
      format: layer.wms_format,
      crs: 'EPSG:4326',
      width: mapSize.x,
      height: mapSize.y,
      bbox,
    },
  })
  // console.log(`onTileError res.data:`, res.data)
  const isXML = res.data.includes('<ServiceException>')
  // console.log(`onTileError isXML:`, isXML)
  if (!isXML) return

  const parser = new window.DOMParser()
  const data = xmlToJson(parser.parseFromString(res.data, 'text/html'))
  // console.log(`onTileError data:`, data)
  const errorMessage =
    data?.HTML?.BODY?.SERVICEEXCEPTIONREPORT?.SERVICEEXCEPTION?.['#text']
  // console.log(`onTileError errorMessage:`, errorMessage)
  addNotification({
    message: errorMessage,
    options: {
      variant: 'error',
    },
  })
}
