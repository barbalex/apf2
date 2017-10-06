import React from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

/**
 * TODO:
 * onClick coordinates container: render coordinate-field-pair and go-to button
 * onBlur coordinate-field-pair-container: render coordinates
 * onBlur coordinate field: validate coordinates
 * onClick go-to button:
 * - do nothing if coordinates are invalid, else:
 * - move to coordinates
 * - render coordinates
 */

const CoordinatesControl = styled(Control)`
  margin-bottom: 2px !important;
  margin-right: 5px !important;
  cursor: pointer !important;
`
const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow: 0 1px 0 white, -0 -1px 0 white, 1px 0 0 white, -1px 0 0 white,
    0 2px 1px white, -0 -2px 1px white, 2px 0 1px white, -2px 0 1px white,
    0 3px 2px white, -0 -3px 2px white, 3px 0 2px white, -3px 0 2px white;
`
const GotoControl = styled(Control)`
  margin-bottom: 2px !important;
  margin-right: 5px !important;
`

const enhance = compose(
  inject('store'),
  withState('controlType', 'changeControlType', 'coordinates'),
  withHandlers({
    onClickCoordinates: props => () => {
      console.log('coordinates clicked')
      props.changeControlType('goto')
    },
    onClickGoto: props => () => {
      console.log('goto clicked')
    },
  }),
  observer
)

const MyControl = ({
  store,
  controlType,
  onClickCoordinates,
}: {
  store: Object,
  controlType: string,
  onClickCoordinates: () => void,
}) => {
  if (controlType === 'coordinates') {
    let [x, y] = store.map.mouseCoordEpsg21781
    let coord = ''
    if (x && y) {
      x = parseInt(x, 10).toLocaleString('de-ch')
      y = parseInt(y, 10).toLocaleString('de-ch')
      coord = `${x}, ${y}`
    }
    return (
      <CoordinatesControl position="bottomright">
        <StyledDiv onClick={onClickCoordinates}>{coord}</StyledDiv>
      </CoordinatesControl>
    )
  }
  return (
    <GotoControl position="bottomright">
      <StyledDiv>"go to"</StyledDiv>
    </GotoControl>
  )
}

export default enhance(MyControl)
