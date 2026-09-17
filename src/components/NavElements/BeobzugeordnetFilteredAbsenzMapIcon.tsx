import { beobIconHighlightedAbsenzString } from '../Projekte/Karte/layers/BeobZugeordnet/beobIconHighlightedAbsenzString.ts'

import iconStyles from './index.module.css'
import mapIconStyles from './BeobzugeordnetFilteredMapIcon.module.css'
import absenzStyles from './absenzIcon.module.css'
import styles from './BeobzugeordnetAbsenzMapIcon.module.css'

export const BeobzugeordnetFilteredAbsenzMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={iconStyles.iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{
        __html: beobIconHighlightedAbsenzString,
      }}
      className={`${mapIconStyles.mapIcon} ${absenzStyles.absenzIcon} ${styles.icon}`}
    />
  </div>
)
