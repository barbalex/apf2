import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #ff00ff !important;
`

export const BeobzugeordnetMapIcon = () => (
  <IconContainer
    title="Beobachtungen zugeordnet in Karte sichtbar"
    className="iconContainer"
  >
    <StyledMapIcon />
  </IconContainer>
)
