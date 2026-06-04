import { MdLocalFlorist } from 'react-icons/md'

import styles from './BeobnichtzuzuordnenFilteredMapIcon.module.css'
import indexStyles from './index.module.css'

export const BeobnichtzuzuordnenFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.mapIcon} />
  </div>
)
