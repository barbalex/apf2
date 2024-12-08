import { memo } from 'react'

import { BeobNichtBeurteilt } from './BeobNichtBeurteilt.jsx'
import { useBeobNichtBeurteiltsNavData } from '../../../../../../../../../../modules/useBeobNichtBeurteiltsNavData.js'

export const BeobNichtBeurteilts = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useBeobNichtBeurteiltsNavData({ apId: ap.id })

  return navData.menus.map((menu) => (
    <BeobNichtBeurteilt
      key={menu.id}
      projekt={projekt}
      ap={ap}
      inProp={inProp}
      menu={menu}
    />
  ))
})
