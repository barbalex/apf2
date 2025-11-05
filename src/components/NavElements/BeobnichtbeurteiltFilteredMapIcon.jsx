import { MdLocalFlorist } from 'react-icons/md'

import { mapIcon } from './BeobnichtbeurteiltFilteredMapIcon.module.css'
import { iconContainer } from './index.module.css'

export const BeobnichtbeurteiltFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <MdLocalFlorist className={mapIcon} />
  </div>
)
