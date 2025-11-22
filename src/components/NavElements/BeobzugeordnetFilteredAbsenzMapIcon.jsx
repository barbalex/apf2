import { beobIconHighlightedAbsenzString } from './beobIconHighlightedAbsenzString.js'

import { iconContainer } from './index.module.css'
import { mapIcon } from './BeobzugeordnetFilteredMapIcon.module.css'
import { absenzIcon } from './absenzIcon.module.css'

export const BeobzugeordnetFilteredAbsenzMapIcon = () => (
  <div
    title="Beobachtung in Karte hervorgehoben"
    className={iconContainer}
  >
    <div
      dangerouslySetInnerHTML={{
        __html: beobIconHighlightedAbsenzString,
      }}
      className={`${mapIcon} ${absenzIcon}`}
    />
  </div>
)
