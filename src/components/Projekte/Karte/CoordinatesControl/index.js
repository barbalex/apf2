import React from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import getContext from 'recompose/getContext'
import { MuiThemeProvider } from 'material-ui/styles'
import PropTypes from 'prop-types'

import ShowCoordinates from './ShowCoordinates'
import PanToCoordinates from './PanToCoordinates'
import theme from '../../../../theme'

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
  inject('store'),
  getContext({ map: PropTypes.object.isRequired }),
  withState('controlType', 'changeControlType', 'coordinates'),
  observer
)

const CoordinatesControl = ({
  store,
  mouseCoordinates,
  controlType,
  changeControlType,
  map,
}: {
  store: Object,
  mouseCoordinates: Array<Number>,
  controlType: string,
  changeControlType: () => void,
  map: Object,
}) => (
  <StyledControl position="bottomright">
    <MuiThemeProvider theme={theme}>
      {controlType === 'coordinates' ? (
        <ShowCoordinates mouseCoordinates={mouseCoordinates} changeControlType={changeControlType} store={store} />
      ) : (
        <PanToCoordinates
          changeControlType={changeControlType}
          store={store}
          map={map}
        />
      )}
    </MuiThemeProvider>
  </StyledControl>
)

export default enhance(CoordinatesControl)
