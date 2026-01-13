import { MdContentCopy } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './CopyingIcon.module.css'

export const CopyingIcon = () => (
  <div
    title="kopiert, bereit zum Einfügen"
    className={indexStyles.iconContainer}
  >
    <MdContentCopy className={styles.icon} />
  </div>
)
