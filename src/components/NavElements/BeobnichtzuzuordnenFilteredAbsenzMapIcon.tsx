import { beobIconHighlightedAbsenzString } from '../Projekte/Karte/layers/BeobNichtZuzuordnen/beobIconHighlightedAbsenzString.ts'

import { iconContainer } from './index.module.css'
import { absenzIcon } from './absenzIcon.module.css'

export const BeobnichtzuzuordnenFilteredAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconHighlightedAbsenzString }}
      className={absenzIcon}
    />
  </div>
)
