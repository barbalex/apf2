import { MdPhotoLibrary } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { copyingIcon } from './BiotopCopyingIcon.module.css'

export const BiotopCopyingIcon = () => (
  <div
    title="Biotop kopiert, bereit zum Einfügen"
    className={iconContainer}
  >
    <MdPhotoLibrary className={copyingIcon} />
  </div>
)
