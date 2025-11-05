import { MdContentCopy } from 'react-icons/md'

import { iconContainer } from './index.module.css'
import { icon } from './CopyingIcon.module.css'

export const CopyingIcon = () => (
  <div
    title="kopiert, bereit zum Einfügen"
    className={iconContainer}
  >
    <MdContentCopy className={icon} />
  </div>
)
