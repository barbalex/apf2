import { memo } from 'react'

import { useBeobNichtZuzuordnensNavData } from '../../../../../../../../../../modules/useBeobNichtZuzuordnensNavData.js'
import { BeobNichtZuzuordnen } from './BeobNichtZuzuordnen.jsx'

export const BeobNichtZuzuordnens = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useBeobNichtZuzuordnensNavData({ apId: ap.id })

  return navData.menus.map((menu) => (
    <BeobNichtZuzuordnen
      key={menu.id}
      projekt={projekt}
      ap={ap}
      inProp={inProp}
      menu={menu}
    />
  ))
})
