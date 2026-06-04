import { MdPhotoLibrary } from 'react-icons/md'

import indexStyles from './index.module.css'
import styles from './BiotopCopyingIcon.module.css'

export const BiotopCopyingIcon = () => (
  <div
    title="Biotop kopiert, bereit zum Einfügen"
    className={indexStyles.iconContainer}
  >
    <MdPhotoLibrary className={styles.copyingIcon} />
  </div>
)
