import React from 'react'
import 'leaflet'
import { withLeaflet } from 'react-leaflet'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

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

const enhance = compose(
  withLeaflet,
  withState('controlType', 'changeControlType', 'coordinates'),
)

const CoordinatesControl = ({
  controlType,
  changeControlType,
  leaflet,
}: {
  controlType: string,
  changeControlType: () => void,
  leaflet: Object,
}) => (
  <StyledControl position="bottomright">
    {controlType === 'coordinates' ? (
      <ShowCoordinates changeControlType={changeControlType} />
    ) : (
      <PanToCoordinates
        changeControlType={changeControlType}
        map={leaflet.map}
      />
    )}
  </StyledControl>
)

export default enhance(CoordinatesControl)
