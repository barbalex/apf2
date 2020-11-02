import React from 'react'
import styled from 'styled-components'

const InnerDiv = styled.div`
  border: none !important;
`

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const Control = ({ children, position }) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <div className={positionClass}>
      <InnerDiv className="leaflet-control leaflet-bar">{children}</InnerDiv>
    </div>
  )
}

export default Control
