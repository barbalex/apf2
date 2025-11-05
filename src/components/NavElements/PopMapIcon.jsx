import { MdLocalFlorist } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { icon } from './PopMapIcon.module.css'

export const PopMapIcon = () => (
  <div
    title="Populationen in Karte sichtbar"
    className={iconContainer}
  >
    <MdLocalFlorist className={icon} />
  </div>
)
