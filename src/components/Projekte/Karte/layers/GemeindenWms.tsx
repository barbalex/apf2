// Tried to integrate gemeinden WMS
// but: querying did not work
// and covers background
// so: not used
import { useMap, WMSTileLayer } from 'react-leaflet'
import styled from '@emotion/styled'
import { useMapEvent } from 'react-leaflet'
import * as ReactDOMServer from 'react-dom/server'
import { useDebouncedCallback } from 'use-debounce'
import type { Content, LeafletMouseEvent } from 'leaflet'

import { xmlToLayersData } from '../../../../modules/xmlToLayersData.ts'
import { Popup } from './Popup.tsx'
import { onTileError } from './onTileError.ts'
import type { WmsLayer } from './onTileError.ts'

const StyledPopupContent = styled.div`
  white-space: pre;
`
const PopupContainer = styled.div<{ maxheight?: number }>`
  overflow: auto;
  scrollbar-width: thin;
  max-height: ${(props) => `${props.maxheight}px`};
  span {
    font-size: x-small !important;
  }
`

const layer: WmsLayer = {
  wms_queryable: 1,
  wms_version: '1.3.0',
  wms_format: 'image/png',
  // wms_info_format: 'application/vnd.ogc.gml',
  wms_info_format: 'text/plain',
  wms_layers: `ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill`,
  // wms_layers: `ch.swisstopo-vd.geometa-gemeinde`,
  wms_base_url: `https://wms.geo.admin.ch/`,
}

export const WMS = () => {
  const map = useMap()

  const onClick = async (e: LeafletMouseEvent) => {
    // console.log({ layer })
    if (layer.wms_queryable === 0) return
    const mapSize = map.getSize()
    const bounds = map.getBounds()
    let wmsData: string | undefined
    let failedToFetch = false
    try {
      const bbox = `${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng}`
      const params = {
        service: 'WMS',
        version: layer.wms_version,
        request: 'GetFeatureInfo',
        layers: layer.wms_layers,
        crs: 'EPSG:4326',
        format: layer.wms_format,
        info_format: layer.wms_info_format ?? 'application/vnd.ogc.gml',
        // info_format: 'text/plain',
        query_layers: layer.wms_layers,
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        width: mapSize.x,
        height: mapSize.y,
        bbox,
      }
      const query = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      )
      const res = await fetch(`${layer.wms_base_url}?${query}`)
      if (!res.ok) {
        console.error('GemeindenWms: status', res.status)
        return
      }
      wmsData = await res.text()
    } catch (error) {
      // fetch only rejects on network errors — the user may be offline
      console.error('GemeindenWms:', error)
      failedToFetch = true
    }

    // console.log({ mapSize, y: mapSize.y })

    // build popup depending on wms_info_format
    let popupContent
    // see for values: https://docs.geoserver.org/stable/en/user/services/wms/reference.html#getfeatureinfo
    if (failedToFetch) {
      popupContent = ReactDOMServer.renderToString(
        <PopupContainer>
          <StyledPopupContent>{`Sie könnten offline sein.\n\nOffline können keine WMS-Informationen\nabgerufen werden.`}</StyledPopupContent>
        </PopupContainer>,
      )
    } else {
      // not reachable in practice: without failedToFetch the request succeeded
      if (!wmsData) return
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (layer.wms_info_format) {
        case 'application/vnd.ogc.gml':
        case 'application/vnd.ogc.gml/3.1.1': {
          const parser = new window.DOMParser()
          const layersData = xmlToLayersData(
            parser.parseFromString(wmsData, 'text/html'),
          )

          // do not open empty popups
          if (!layersData.length) return

          popupContent = ReactDOMServer.renderToString(
            <Popup
              layersData={layersData}
              mapSize={mapSize}
            />,
          )
          break
        }
        // TODO: test
        case 'text/html': {
          popupContent = (
            <PopupContainer maxheight={mapSize.y - 40}>
              <div dangerouslySetInnerHTML={{ __html: wmsData }} />
            </PopupContainer>
          )
          break
        }
        // TODO: test
        case 'application/json':
        case 'text/javascript': {
          // do not open empty popups
          if (!wmsData?.length) return
          if (wmsData.includes('no results')) return

          popupContent = ReactDOMServer.renderToString(
            <PopupContainer maxheight={mapSize.y - 40}>
              <StyledPopupContent>
                {JSON.stringify(wmsData)}
              </StyledPopupContent>
            </PopupContainer>,
          )
          break
        }
        case 'text/plain':
        default: {
          // do not open empty popups
          if (!wmsData?.length) return
          if (wmsData.includes('no results')) return

          popupContent = ReactDOMServer.renderToString(
            <PopupContainer maxheight={mapSize.y - 40}>
              <StyledPopupContent>{wmsData}</StyledPopupContent>
            </PopupContainer>,
          )
          break
        }
      }
    }

    window.L.popup()
      .setLatLng(e.latlng)
      // the text/html branch assigns a React element (untested code path);
      // leaflet only types strings and nodes as popup content
      .setContent(popupContent as unknown as Content)
      .openOn(map)
  }

  useMapEvent('click', (e) => void onClick(e))

  const onTileErrorDebounced = useDebouncedCallback(
    onTileError.bind(this, map, layer),
    600,
  )

  // TODO:
  // leaflet calls server internally
  // BUT: if call errors, leaflet does not surface the error
  // instead ALL WMS LAYERS FAIL!!!!!!!!
  return (
    <WMSTileLayer
      url={layer.wms_base_url}
      layers={layer.wms_layers}
      version={layer.wms_version}
      format={layer.wms_format}
      maxNativeZoom={23}
      minZoom={0}
      maxZoom={23}
      opacity={0.5}
      transparent={false}
      // exceptions="inimage"
      eventHandlers={{
        tileerror: (event) => void onTileErrorDebounced(event),
      }}
    />
  )
}
