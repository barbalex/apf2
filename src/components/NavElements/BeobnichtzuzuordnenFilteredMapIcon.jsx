import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #ffe4ff !important;
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`

export const BeobnichtzuzuordnenFilteredMapIcon = () => (
  <IconContainer title="Beobachtung in Karte hervorgehoben">
    <StyledMapIcon />
  </IconContainer>
)
