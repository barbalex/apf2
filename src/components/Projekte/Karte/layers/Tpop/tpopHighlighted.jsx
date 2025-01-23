import { memo } from 'react'

import Icon from './tpopHighlighted.svg'
import { IconContainer } from '../../../../NavElements/IconContainer.jsx'

export const TpopIconHighlighted = memo(() => (
  <IconContainer className="iconContainer">
    <Icon />
  </IconContainer>
))
