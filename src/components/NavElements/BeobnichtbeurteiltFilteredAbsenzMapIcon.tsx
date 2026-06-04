import { beobIconHighlightedAbsenzString } from '../Projekte/Karte/layers/BeobNichtBeurteilt/beobIconHighlightedAbsenzString.ts'

import { iconContainer } from './index.module.css'
import { absenzIcon } from './absenzIcon.module.css'
import styles from './BeobnichtbeurteiltAbsenzMapIcon.module.css'

export const BeobnichtbeurteiltFilteredAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconHighlightedAbsenzString }}
      className={`${absenzIcon} ${styles.icon}`}
    />
  </div>
)
