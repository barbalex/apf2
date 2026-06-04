import { MdLocalFlorist } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './TpopMapIcon.module.css'

export const TpopMapIcon = () => (
  <div
    title="Teil-Populationen in Karte sichtbar"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.icon} />
  </div>
)
