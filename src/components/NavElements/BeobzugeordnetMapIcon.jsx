import { MdLocalFlorist } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './BeobzugeordnetMapIcon.module.css'

export const BeobzugeordnetMapIcon = () => (
  <div
    title="Beobachtungen zugeordnet in Karte sichtbar"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.mapIcon} />
  </div>
)
