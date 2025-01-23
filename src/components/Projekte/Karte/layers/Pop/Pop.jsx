import { memo } from 'react'

import Icon from './pop.svg'
import { IconContainer } from '../../../../NavElements/IconContainer.jsx'

export const PopIcon = memo(() => (
  <IconContainer className="iconContainer">
    <Icon />
  </IconContainer>
))
