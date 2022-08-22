import React, { useState, useEffect, useCallback, useContext } from 'react'
import 'leaflet'
import { useMapEvents } from 'react-leaflet'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

import ShowCoordinates from './ShowCoordinates'
import PanToCoordinates from './PanToCoordinates'
import epsg4326to2056 from '../../../../modules/epsg4326to2056'
import storeContext from '../../../../storeContext'

/**
 * onClick coordinates container: render coordinate-field-pair and go-to button
 * onBlur coordinate-field-pair-container: render coordinates
 * onBlur coordinate field: validate coordinates
 * onClick go-to button:
 * - do nothing if coordinates are invalid, else:
 * - move to coordinates
 * - render coordinates
 */

const Container = styled.div`
  margin-bottom: 10px !important;
`

const CoordinatesControl = () => {
  const { setMapMouseCoordinates } = useContext(storeContext)
  const [controlType, setControlType] = useState('coordinates')

  const setMouseCoords = useCallback(
    (e) => {
      // console.log('setMouseCoordinates')
      const [x, y] = epsg4326to2056(e.latlng.lng, e.latlng.lat)
      setMapMouseCoordinates({ x, y })
    },
    [setMapMouseCoordinates],
  )

  const onMouseMove = debounce(setMouseCoords, 50)

  const map = useMapEvents({
    mousemove(e) {
      onMouseMove(e)
    },
  })
  // hack to get control to show on first load
  // see: https://github.com/LiveBy/react-leaflet-control/issues/27#issuecomment-430564722
  useEffect(() => {
    setControlType('coordinates')
  }, [])

  return (
    <Container>
      {controlType === 'coordinates' ? (
        <ShowCoordinates setControlType={setControlType} />
      ) : (
        <PanToCoordinates setControlType={setControlType} map={map} />
      )}
    </Container>
  )
}

export default CoordinatesControl
