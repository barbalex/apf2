import React from 'react'
import 'leaflet'
import styled from 'styled-components'
import get from 'lodash/get'

import withLocalData from './withLocalData'

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

const ShowCoordinates = ({
  localData,
  changeControlType,
}: {
  localData: Object,
  changeControlType: () => void,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`

  const x = get(localData, 'mapMouseCoordinates.x').toLocaleString('de-ch')
  const y = get(localData, 'mapMouseCoordinates.y').toLocaleString('de-ch')

  return (
    <StyledDiv
      onClick={() => changeControlType('goto')}
      title="Klicken um Koordinaten zu suchen"
    >
      {`${x}, ${y}`}
    </StyledDiv>
  )
}

export default withLocalData(ShowCoordinates)
