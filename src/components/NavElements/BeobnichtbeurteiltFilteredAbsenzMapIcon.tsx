import { beobIconHighlightedAbsenzString } from '../Projekte/Karte/layers/BeobNichtBeurteilt/beobIconHighlightedAbsenzString.ts'

import indexStyles from './index.module.css'
import absenzIconStyles from './absenzIcon.module.css'
import styles from './BeobnichtbeurteiltAbsenzMapIcon.module.css'

export const BeobnichtbeurteiltFilteredAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung in Karte hervorgehoben"
    className={indexStyles.iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconHighlightedAbsenzString }}
      className={`${absenzIconStyles.absenzIcon} ${styles.icon}`}
    />
  </div>
)
