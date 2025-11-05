import { MdLocalFlorist } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { icon } from './TpopMapIcon.module.css'

export const TpopMapIcon = () => (
  <div
    title="Teil-Populationen in Karte sichtbar"
    className={iconContainer}
  >
    <MdLocalFlorist className={icon} />
  </div>
)
