import { MdLocalFlorist } from 'react-icons/md'

import styles from './BeobnichtbeurteiltMapIcon.module.css'
import indexStyles from './index.module.css'

export const BeobnichtbeurteiltMapIcon = () => (
  <div
    title="Beobachtungen nicht beurteilt in Karte sichtbar"
    className={indexStyles.iconContainer}
  >
    <MdLocalFlorist className={styles.mapIcon} />
  </div>
)
