import React, { useState, useEffect } from 'react'
import 'leaflet'
import { useMap } from 'react-leaflet'
import styled from 'styled-components'

import ShowCoordinates from './ShowCoordinates'
import PanToCoordinates from './PanToCoordinates'

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
  const [controlType, setControlType] = useState('coordinates')
  const map = useMap()
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
