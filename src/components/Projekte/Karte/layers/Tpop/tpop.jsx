import { memo } from 'react'

import Icon from './tpop.svg'
import { IconContainer } from '../../../../NavElements/IconContainer.jsx'

export const TpopIcon = memo(() => (
  <IconContainer className="iconContainer">
    <Icon />
  </IconContainer>
))
