import { beobIconAbsenzString } from '../Projekte/Karte/layers/BeobZugeordnet/beobIconAbsenzString.ts'

import indexStyles from './index.module.css'
import absenzIconStyles from './absenzIcon.module.css'
import styles from './BeobzugeordnetAbsenzMapIcon.module.css'

export const BeobzugeordnetAbsenzMapIcon = () => (
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
