import { MapIcon } from './MapIcon.jsx'
import { IconContainer } from './IconContainer.jsx'

import { mapIcon } from './BeobnichtbeurteiltFilteredMapIcon.module.css'
import { iconContainer } from './index.module.css'

export const BeobnichtbeurteiltFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <MapIcon className={mapIcon} />
  </div>
)
