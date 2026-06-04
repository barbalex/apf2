import { MdLocalFlorist } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './PopMapIcon.module.css'

export const PopMapIcon = () => (
  <div
    title="Populationen in Karte sichtbar"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.icon} />
  </div>
)
