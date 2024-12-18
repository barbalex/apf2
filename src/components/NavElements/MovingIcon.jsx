import styled from '@emotion/styled'
import {MdOutlineMoveDown} from 'react-icons/md'

import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

const StyledIcon = styled(MdOutlineMoveDown)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`

export const MovingIcon = () => (
  <IconContainer title="zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen">
    <StyledIcon />
  </IconContainer>
)
