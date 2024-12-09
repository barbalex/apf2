import { memo } from 'react'

import { useZielsOfJahrNavData } from '../../../../../../../../../../../modules/useZielsOfJahrNavData.js'
import { Ziel } from './Ziel/index.jsx'

export const Ziels = memo(({ projekt, ap, jahr }) => {
  const { navData } = useZielsOfJahrNavData({
    projId: projekt.id,
    apId: ap.id,
    jahr,
  })

  return navData.menus.map((menu) => (
    <Ziel
      key={menu.id}
      projekt={projekt}
      ap={ap}
      jahr={jahr}
      menu={menu}
    />
  ))
})
