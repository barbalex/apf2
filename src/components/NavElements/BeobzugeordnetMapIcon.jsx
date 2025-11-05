import { MdLocalFlorist } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { mapIcon } from './BeobzugeordnetMapIcon.module.css'

export const BeobzugeordnetMapIcon = () => (
  <div
    title="Beobachtungen zugeordnet in Karte sichtbar"
    className={iconContainer}
  >
    <MdLocalFlorist className={mapIcon} />
  </div>
)
