import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #9a009a !important;
`

export const BeobnichtbeurteiltMapIcon = () => (
  <IconContainer title="Beobachtungen nicht beurteilt in Karte sichtbar">
    <StyledMapIcon />
  </IconContainer>
)
