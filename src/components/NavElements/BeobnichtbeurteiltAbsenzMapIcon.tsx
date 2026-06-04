import { beobIconAbsenzString } from '../Projekte/Karte/layers/BeobNichtBeurteilt/beobIconAbsenzString.ts'

import { iconContainer } from './index.module.css'
import { absenzIcon } from './absenzIcon.module.css'
import styles from './BeobnichtbeurteiltAbsenzMapIcon.module.css'

export const BeobnichtbeurteiltAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung"
    className={iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconAbsenzString }}
      className={`${absenzIcon} ${styles.icon}`}
    />
  </div>
)
