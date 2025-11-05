import { MdLocalFlorist } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { mapIcon } from './BeobnichtzuzuordnenMapIcon.module.css'

export const BeobnichtzuzuordnenMapIcon = () => (
  <div
    title="Beobachtungen nicht zuzuordnen in Karte sichtbar"
    className={iconContainer}
  >
    <MdLocalFlorist className={mapIcon} />
  </div>
)
