import { memo } from 'react'

import Icon from './popHighlighted.svg'
import { IconContainer } from '../../../../NavElements/IconContainer.jsx'

export const PopIconHighlighted = memo(() => (
  <IconContainer className="iconContainer">
    <Icon />
  </IconContainer>
))
