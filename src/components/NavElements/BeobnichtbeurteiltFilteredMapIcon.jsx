import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #9a009a !important;
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`

export const BeobnichtbeurteiltFilteredMapIcon = () => (
  <IconContainer
    title="Beobachtung in Karte hervorgehoben"
    className="iconContainer"
  >
    <StyledMapIcon />
  </IconContainer>
)
