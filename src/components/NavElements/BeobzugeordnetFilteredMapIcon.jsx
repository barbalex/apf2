import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #ff00ff !important;
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`

export const BeobzugeordnetFilteredMapIcon = () => (
  <IconContainer title="Beobachtung in Karte hervorgehoben">
    <StyledMapIcon />
  </IconContainer>
)
