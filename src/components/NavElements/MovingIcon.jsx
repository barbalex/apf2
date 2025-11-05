import { MdOutlineMoveDown } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { icon } from './MovingIcon.module.css'

export const MovingIcon = () => (
  <div
    title="zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen"
    className={iconContainer}
  >
    <MdOutlineMoveDown className={icon} />
  </div>
)
