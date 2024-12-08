import { memo } from 'react'

import { useErfkritsNavData } from '../../../../../../../../../../modules/useErfkritsNavData.js'
import { Aperfkrit } from './Aperfkrit.jsx'

export const Aperfkrits = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useErfkritsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Aperfkrit
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
