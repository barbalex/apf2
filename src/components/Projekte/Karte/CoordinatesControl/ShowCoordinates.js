import React from 'react'
import 'leaflet'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow: 0 1px 0 white, -0 -1px 0 white, 1px 0 0 white, -1px 0 0 white,
    0 2px 1px white, -0 -2px 1px white, 2px 0 1px white, -2px 0 1px white,
    0 3px 2px white, -0 -3px 2px white, 3px 0 2px white, -3px 0 2px white;
  cursor: pointer;
  margin-bottom: 2px !important;
  margin-right: 5px !important;
`

const enhance = compose(
  withState('panToMarker', 'changePanToMarker', null),
  withHandlers({
    onClickCoordinates: props => () => {
      const { changeControlType } = props
      changeControlType('goto')
    },
  }),
  observer
)

const ShowCoordinates = ({
  store,
  onClickCoordinates,
}: {
  store: Object,
  onClickCoordinates: () => void,
}) => {
  let [x, y] = store.map.mouseCoordEpsg21781
  let coord = ''
  if (x && y) {
    x = parseInt(x, 10).toLocaleString('de-ch')
    y = parseInt(y, 10).toLocaleString('de-ch')
    coord = `${x}, ${y}`
  }

  return <StyledDiv onClick={onClickCoordinates}>{coord}</StyledDiv>
}

export default enhance(ShowCoordinates)
