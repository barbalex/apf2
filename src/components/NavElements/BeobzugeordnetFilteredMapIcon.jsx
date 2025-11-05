import { MdLocalFlorist } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { mapIcon } from './BeobzugeordnetFilteredMapIcon.module.css'

export const BeobzugeordnetFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <MdLocalFlorist className={mapIcon} />
  </div>
)
