import { beobIconAbsenzString } from '../Projekte/Karte/layers/BeobNichtBeurteilt/beobIconAbsenzString.ts'

import indexStyles from './index.module.css'
import absenzIconStyles from './absenzIcon.module.css'
import styles from './BeobnichtbeurteiltAbsenzMapIcon.module.css'

export const BeobnichtbeurteiltAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung"
    className={indexStyles.iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconAbsenzString }}
      className={`${absenzIconStyles.absenzIcon} ${styles.icon}`}
    />
  </div>
)
