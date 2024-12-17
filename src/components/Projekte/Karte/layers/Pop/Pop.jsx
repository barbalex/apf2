import { memo } from 'react'

import Icon from './pop.svg'
import { IconContainer } from '../../../TreeContainer/Tree/Row.jsx'

export const PopIcon = memo(() => (
  <IconContainer>
    <Icon />
  </IconContainer>
))
