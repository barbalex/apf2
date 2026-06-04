import { MdLocalFlorist } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './BeobzugeordnetFilteredMapIcon.module.css'

export const BeobzugeordnetFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.mapIcon} />
  </div>
)
