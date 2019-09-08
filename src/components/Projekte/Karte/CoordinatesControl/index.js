import React, { useState, useEffect } from 'react'
import 'leaflet'
import { useLeaflet } from 'react-leaflet'
import Control from 'react-leaflet-control'
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

const StyledControl = styled(Control)`
  margin-bottom: 2px !important;
  margin-right: 5px !important;
`

const CoordinatesControl = () => {
  const [controlType, setControlType] = useState('coordinates')
  const { map } = useLeaflet()
  // hack to get control to show on first load
  // see: https://github.com/LiveBy/react-leaflet-control/issues/27#issuecomment-430564722
  useEffect(() => {
    setControlType('coordinates')
  }, [])

  return (
    <StyledControl position="bottomright">
      {controlType === 'coordinates' ? (
        <ShowCoordinates setControlType={setControlType} />
      ) : (
        <PanToCoordinates setControlType={setControlType} map={map} />
      )}
    </StyledControl>
  )
}

export default CoordinatesControl
