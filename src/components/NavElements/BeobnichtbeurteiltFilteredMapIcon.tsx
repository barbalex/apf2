import { MdLocalFlorist } from 'react-icons/md'

import styles from './BeobnichtbeurteiltFilteredMapIcon.module.css'
import indexStyles from './index.module.css'

export const BeobnichtbeurteiltFilteredMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.mapIcon} />
  </div>
)
