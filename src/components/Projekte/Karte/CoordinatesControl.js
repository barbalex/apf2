import React from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'

const StyledControl = styled(Control)`
  margin-bottom: 2px !important;
  margin-right: 5px !important;
`
const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow: 0 1px 0 white, -0 -1px 0 white, 1px 0 0 white, -1px 0 0 white, 0 2px 1px white, -0 -2px 1px white, 2px 0 1px white, -2px 0 1px white, 0 3px 2px white, -0 -3px 2px white, 3px 0 2px white, -3px 0 2px white;
`

const enhance = compose(inject('store'), observer)

const CoordinatesControl = ({ store }: { store: Object }) => {
  let [x, y] = store.map.mouseCoordEpsg21781
  let coord = ''
  if (x && y) {
    x = parseInt(x, 10).toLocaleString('de-ch')
    y = parseInt(y, 10).toLocaleString('de-ch')
    coord = `${x}, ${y}`
  }

  return (
    <StyledControl position="bottomright">
      <StyledDiv>
        {coord}
      </StyledDiv>
    </StyledControl>
  )
}

export default enhance(CoordinatesControl)
