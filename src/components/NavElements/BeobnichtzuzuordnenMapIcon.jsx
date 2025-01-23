import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #ffe4ff !important;
`

export const BeobnichtzuzuordnenMapIcon = () => (
  <IconContainer
    title="Beobachtungen nicht zuzuordnen in Karte sichtbar"
    className="iconContainer"
  >
    <StyledMapIcon />
  </IconContainer>
)
