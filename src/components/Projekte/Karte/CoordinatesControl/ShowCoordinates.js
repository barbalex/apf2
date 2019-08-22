import React, { useContext, useCallback } from 'react'
import 'leaflet'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'

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

const ShowCoordinates = ({ setControlType }) => {
  const { mapMouseCoordinates } = useContext(storeContext)
  const x = mapMouseCoordinates.x.toLocaleString('de-ch')
  const y = mapMouseCoordinates.y.toLocaleString('de-ch')

  const onClick = useCallback(() => setControlType('goto'), [setControlType])

  return (
    <StyledDiv onClick={onClick} title="Klicken um Koordinaten zu suchen">
      {`${x}, ${y}`}
    </StyledDiv>
  )
}

export default observer(ShowCoordinates)
