import React from 'react'
import styled from 'styled-components'

const OuterDiv = styled.div`
  ${(props) => !props['data-visible'] && 'visibility: hidden;'}
`
const InnerDiv = styled.div`
  border: none !important;
  /* float children right */
  > button {
    float: right;
    margin-top: 10px;
  }
`

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const Control = ({ children, position, visible = true }) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <OuterDiv
      className="leaflet-control-container first"
      data-visible={visible}
    >
      <div className={positionClass}>
        <InnerDiv className="leaflet-control leaflet-bar">{children}</InnerDiv>
      </div>
    </OuterDiv>
  )
}

export default Control
