// Tried to integrate gemeinden WMS
// but: querying did not work
// and covers background
import React, { useContext } from 'react'
import { useMap, WMSTileLayer } from 'react-leaflet'
import styled from '@emotion/styled'
import { useMapEvent } from 'react-leaflet'
import axios from 'redaxios'
import * as ReactDOMServer from 'react-dom/server'
import { useDebouncedCallback } from 'use-debounce'
import { observer } from 'mobx-react-lite'

import xmlToLayersData from '../../../../modules/xmlToLayersData'
import Popup from './Popup'
import onTileError from './onTileError'
import storeContext from '../../../../storeContext'

const StyledPopupContent = styled.div`
  white-space: pre;
`
const PopupContainer = styled.div`
  overflow: auto;
  max-height: ${(props) => `${props.maxheight}px`};
  span {
    font-size: x-small !important;
  }
`

const layer = {
  wms_queryable: 1,
  wms_version: '1.3.0',
  wms_format: 'image/png',
  // wms_info_format: 'application/vnd.ogc.gml',
  wms_info_format: 'text/plain',
  wms_layers: `ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill`,
  // wms_layers: `ch.swisstopo-vd.geometa-gemeinde`,
  wms_base_url: `https://wms.geo.admin.ch/`,
}

const WMS = () => {
  const map = useMap()
  const store = useContext(storeContext)

  useMapEvent('click', async (e) => {
    // console.log({ layer })
    if (layer.wms_queryable === 0) return
    const mapSize = map.getSize()
    const bounds = map.getBounds()
    let res
    let failedToFetch = false
    try {
      const bbox = `${bounds._southWest.lat},${bounds._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng}`
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
      res = await axios({
        method: 'get',
        url: layer.wms_base_url,
        params,
      })
    } catch (error) {
      // console.log(`error fetching ${row.label}`, error?.toJSON())
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('error.response.data', error.response.data)
        console.error('error.response.status', error.response.status)
        console.error('error.response.headers', error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error('error.request:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('error.message', error.message)
      }
      if (error.message?.toLowerCase()?.includes('failed to fetch')) {
        failedToFetch = true
      } else {
        return
      }
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
      switch (layer.wms_info_format) {
        case 'application/vnd.ogc.gml':
        case 'application/vnd.ogc.gml/3.1.1': {
          const parser = new window.DOMParser()
          const layersData = xmlToLayersData(
            parser.parseFromString(res.data, 'text/html'),
          )

          // do not open empty popups
          if (!layersData.length) return

          popupContent = ReactDOMServer.renderToString(
            <Popup layersData={layersData} mapSize={mapSize} />,
          )
          break
        }
        // TODO: test
        case 'text/html': {
          popupContent = (
            <PopupContainer maxheight={mapSize.y - 40}>
              <div dangerouslySetInnerHTML={{ __html: res.data }} />
            </PopupContainer>
          )
          break
        }
        // TODO: test
        case 'application/json':
        case 'text/javascript': {
          // do not open empty popups
          if (!res.data?.length) return
          if (res.data.includes('no results')) return

          popupContent = ReactDOMServer.renderToString(
            <PopupContainer maxheight={mapSize.y - 40}>
              <StyledPopupContent>
                {JSON.stringify(res.data)}
              </StyledPopupContent>
            </PopupContainer>,
          )
          break
        }
        case 'text/plain':
        default: {
          // do not open empty popups
          if (!res.data?.length) return
          if (res.data.includes('no results')) return

          popupContent = ReactDOMServer.renderToString(
            <PopupContainer maxheight={mapSize.y - 40}>
              <StyledPopupContent>{res.data}</StyledPopupContent>
            </PopupContainer>,
          )
          break
        }
      }
    }

    window.L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map)
  })

  const onTileErrorDebounced = useDebouncedCallback(
    onTileError.bind(this, store, map, layer),
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
        tileerror: onTileErrorDebounced,
      }}
    />
  )
}

export default observer(WMS)
