import { beobIconAbsenzString } from '../Projekte/Karte/layers/BeobNichtZuzuordnen/beobIconAbsenzString.ts'

import indexStyles from './index.module.css'
import absenzIconStyles from './absenzIcon.module.css'

export const BeobnichtzuzuordnenAbsenzMapIcon = () => (
  <div
    title="Absenz-Beobachtung"
    className={indexStyles.iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{ __html: beobIconAbsenzString }}
      className={absenzIconStyles.absenzIcon}
    />
  </div>
)
