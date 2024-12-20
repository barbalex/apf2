import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #016f19 !important;
`

export const TpopMapIcon = () => (
  <IconContainer title="Teil-Populationen in Karte sichtbar">
    <StyledMapIcon />
  </IconContainer>
)
