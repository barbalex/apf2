import styled from '@emotion/styled'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledMapIcon = styled(MapIcon)`
  color: #947500 !important;
`

export const PopMapIcon = () => (
  <IconContainer
    title="Populationen in Karte sichtbar"
    className="iconContainer"
  >
    <StyledMapIcon />
  </IconContainer>
)
