import { MdLocalFlorist } from 'react-icons/md'

import { IconContainer } from './IconContainer.jsx'

import { mapIcon } from './BeobnichtbeurteiltMapIcon.module.css'
import { iconContainer } from './index.module.css'

export const BeobnichtbeurteiltMapIcon = () => (
  <div
    title="Beobachtungen nicht beurteilt in Karte sichtbar"
    className={iconContainer}
  >
    <MdLocalFlorist className={mapIcon} />
  </div>
)
