// TODO: need to debounce
import type { Map, TileErrorEvent } from 'leaflet'

import { xmlToJson } from '../../../../modules/xmlToJson.ts'

import type { Notification } from '../../../../store/index.ts'
import { store, addNotificationAtom } from '../../../../store/index.ts'

export interface WmsLayer {
  wms_queryable: number
  wms_version: string
  wms_format: string
  wms_info_format?: string | undefined
  wms_layers: string
  wms_base_url: string
}

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const onTileError = async (
  map: Map,
  layer: WmsLayer,
  _ignore: TileErrorEvent,
) => {
  // console.log('onTileError', { ignore, map, layer })
  const mapSize = map.getSize()
  const bbox = map.getBounds().toBBoxString()
  const query = new URLSearchParams({
    service: 'WMS',
    request: 'GetMap',
    version: layer.wms_version,
    layers: layer.wms_layers,
    format: layer.wms_format,
    crs: 'EPSG:4326',
    width: String(mapSize.x),
    height: String(mapSize.y),
    bbox,
  })
  const res = await fetch(`${layer.wms_base_url}?${query}`)
  const data = await res.text()
  // console.log(`onTileError res.data:`, data)
  const isXML = data.includes('<ServiceException>')
  // console.log(`onTileError isXML:`, isXML)
  if (!isXML) return

  const parser = new window.DOMParser()
  const jsonData = xmlToJson(parser.parseFromString(data, 'text/html'))
  // console.log(`onTileError data:`, jsonData)
  const errorMessage =
    jsonData?.HTML?.BODY?.SERVICEEXCEPTIONREPORT?.SERVICEEXCEPTION?.['#text']
  // console.log(`onTileError errorMessage:`, errorMessage)
  addNotification({
    message: errorMessage,
    options: {
      variant: 'error',
    },
  })
}
