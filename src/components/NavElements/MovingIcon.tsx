import { MdOutlineMoveDown } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './MovingIcon.module.css'

export const MovingIcon = () => (
  <div
    title="zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen"
    className={indexStyles.iconContainer}
  >
    <MdOutlineMoveDown className={styles.icon} />
  </div>
)
