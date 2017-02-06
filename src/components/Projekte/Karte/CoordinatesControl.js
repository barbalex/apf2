import React, { PropTypes } from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'

const StyledControl = styled(Control)`
  margin-bottom: 5px !important;
`
const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow: 0 1px 0 white, -0 -1px 0 white, 1px 0 0 white, -1px 0 0 white, 0 2px 0 white, -0 -2px 0 white, 2px 0 0 white, -2px 0 0 white, 0 3px 1px white, -0 -3px 1px white, 3px 0 1px white, -3px 0 1px white, 0 4px 2px white, -0 -4px 2px white, 4px 0 2px white, -4px 0 2px white, 0 5px 2px white, -0 -5px 2px white, 5px 0 2px white, -5px 0 2px white, 0 6px 2px white, -0 -6px 2px white, 6px 0 2px white, -6px 0 2px white, 0 7px 4px white, -0 -7px 4px white, 7px 0 4px white, -7px 0 4px white;
`

const enhance = compose(
  inject(`store`),
  observer
)

const CoordinatesControl = ({ map, store }) => {
  let [x, y] = store.map.mouseCoordEpsg21781
  let coord = ``
  if (x && y) {
    x = parseInt(x, 10).toLocaleString(`de-ch`)
    y = parseInt(y, 10).toLocaleString(`de-ch`)
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

CoordinatesControl.propTypes = {
  map: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default enhance(CoordinatesControl)
