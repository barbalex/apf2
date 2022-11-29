import React, { useContext } from 'react'
import { WMSTileLayer, useMapEvent, useMap } from 'react-leaflet'
import axios from 'redaxios'
import * as ReactDOMServer from 'react-dom/server'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import xmlToLayersData from '../../../../modules/xmlToLayersData'
import Popup from './Popup'
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

const version = '1.3.0'
const format = 'image/png'

const MassnahmenLayer = ({ layer }) => {
  const map = useMap()
  const store = useContext(storeContext)
  const apId = store.tree.apIdInActiveNodeArray

  useMapEvent('click', async (e) => {
    if (!apId) return

    const mapSize = map.getSize()
    const bounds = map.getBounds()
    let res
    let failedToFetch = false
    try {
      const bbox = `${bounds._southWest.lat},${bounds._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng}`
      const params = {
        service: 'WMS',
        version,
        request: 'GetFeatureInfo',
        layers: layer,
        crs: 'EPSG:4326',
        format,
        info_format: 'application/vnd.ogc.gml',
        feature_count: 40,
        query_layers: layer,
        x: Math.round(e.containerPoint.x),
        y: Math.round(e.containerPoint.y),
        width: mapSize.x,
        height: mapSize.y,
        bbox,
      }
      res = await axios({
        method: 'get',
        url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
        params,
      })
    } catch (error) {
      // console.log({ error, errorToJSON: error?.toJSON?.(), res })
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
      const parser = new window.DOMParser()
      // console.log('MassnahmenLayer, res.data:', res.data)
      const layersData = xmlToLayersData(
        parser.parseFromString(res.data, 'text/html'),
      )

      // do not open empty popups
      if (!layersData.length) return

      popupContent = ReactDOMServer.renderToString(
        <Popup layersData={layersData} mapSize={mapSize} />,
      )
    }

    window?.L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map)
  })

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
      maxNativeZoom={18}
      minZoom={0}
      maxZoom={22}
    />
  )
}

export default observer(MassnahmenLayer)
