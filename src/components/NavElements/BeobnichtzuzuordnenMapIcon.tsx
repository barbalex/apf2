import { MdLocalFlorist } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './BeobnichtzuzuordnenMapIcon.module.css'

export const BeobnichtzuzuordnenMapIcon = () => (
  <div
    title="Beobachtungen nicht zuzuordnen in Karte sichtbar"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.mapIcon} />
  </div>
)
