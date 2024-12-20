import { memo } from 'react'

import { useAssozartsNavData } from '../../../../../../../../../../modules/useAssozartsNavData.js'
import { Assozart } from './Assozart.jsx'

export const Assozarts = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useAssozartsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Assozart
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
