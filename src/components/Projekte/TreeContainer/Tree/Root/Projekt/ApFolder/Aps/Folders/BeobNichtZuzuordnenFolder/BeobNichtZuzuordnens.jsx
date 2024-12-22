import { memo } from 'react'

import { useBeobNichtZuzuordnensNavData } from '../../../../../../../../../../modules/useBeobNichtZuzuordnensNavData.js'
import { BeobNichtZuzuordnen } from './BeobNichtZuzuordnen.jsx'
import { ChildlessFolderTransitioned } from '../../../../../../ChildlessFolderTransitioned.jsx'

export const BeobNichtZuzuordnens = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useBeobNichtZuzuordnensNavData({ apId: ap.id })

  return navData.menus.map((menu) => (
    <ChildlessFolderTransitioned
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
    // <BeobNichtZuzuordnen
    //   key={menu.id}
    //   projekt={projekt}
    //   ap={ap}
    //   inProp={inProp}
    //   menu={menu}
    // />
  ))
})
