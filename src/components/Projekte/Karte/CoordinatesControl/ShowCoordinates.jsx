import { useContext } from 'react'
import 'leaflet'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'

const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow:
    0 1px 0 white,
    -0 -1px 0 white,
    1px 0 0 white,
    -1px 0 0 white,
    0 2px 1px white,
    -0 -2px 1px white,
    2px 0 1px white,
    -2px 0 1px white,
    0 3px 2px white,
    -0 -3px 2px white,
    3px 0 2px white,
    -3px 0 2px white;
  cursor: pointer;
  margin-bottom: 2px !important;
`

export const ShowCoordinates = observer(({ setControlType }) => {
  const { mapMouseCoordinates } = useContext(MobxContext)
  const x = mapMouseCoordinates.x?.toLocaleString('de-ch')
  const y = mapMouseCoordinates.y?.toLocaleString('de-ch')

  const onClick = () => setControlType('goto')

  return (
    <StyledDiv
      onClick={onClick}
      title="Klicken um Koordinaten zu suchen"
    >
      {`${x}, ${y}`}
    </StyledDiv>
  )
})
