import React, { PropTypes } from 'react'
import 'leaflet'
import { inject, observer } from 'mobx-react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import compose from 'recompose/compose'

const StyledDiv = styled.div`
  background-color: white;
  border-radius: 5px;
  border: 2px solid rgba(0,0,0,0.2);
  background-clip: padding-box;
  span {
    color: rgba(0, 0, 0, 0.54) !important;
  }
`

const enhance = compose(
  inject(`store`),
  observer
)

const PngControl = ({ map, store }) =>
  <Control position="topright">
    <StyledDiv>
      {store.map.mouseCoordEpsg21781.toString(`, `)}
    </StyledDiv>
  </Control>

PngControl.propTypes = {
  map: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default enhance(PngControl)
