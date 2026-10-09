import { beobIconHighlightedAbsenzString } from '../Projekte/Karte/layers/BeobNichtZuzuordnen/beobIconHighlightedAbsenzString.ts'

import indexStyles from './index.module.css'
import absenzIconStyles from './absenzIcon.module.css'

export const BeobnichtzuzuordnenFilteredAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung in Karte hervorgehoben"
    className={indexStyles.iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconHighlightedAbsenzString }}
      className={absenzIconStyles.absenzIcon}
    />
  </div>
)
