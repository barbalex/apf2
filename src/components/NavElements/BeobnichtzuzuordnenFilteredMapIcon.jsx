import { MdLocalFlorist } from 'react-icons/md'

import { mapIcon } from './BeobnichtzuzuordnenFilteredMapIcon.module.css'
import { iconContainer } from './index.module.css'

export const BeobnichtzuzuordnenFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <MdLocalFlorist className={mapIcon} />
  </div>
)
