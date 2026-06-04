import { beobIconAbsenzString } from '../Projekte/Karte/layers/BeobZugeordnet/beobIconAbsenzString.ts'

import { iconContainer } from './index.module.css'
import { absenzIcon } from './absenzIcon.module.css'

export const BeobzugeordnetAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung"
    className={iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconAbsenzString }}
      className={absenzIcon}
    />
  </div>
)
