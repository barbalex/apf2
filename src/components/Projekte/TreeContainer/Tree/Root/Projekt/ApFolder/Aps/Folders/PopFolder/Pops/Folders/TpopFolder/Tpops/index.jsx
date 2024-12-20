import { memo } from 'react'

import { useTpopsNavData } from '../../../../../../../../../../../../../../modules/useTpopsNavData.js'
import { Tpop } from './Tpop.jsx'

export const Tpops = memo(({ projekt, ap, pop, in: inProp }) => {
  const { navData } = useTpopsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
  })

  return navData.menus.map((menu) => (
    <Tpop
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      menu={menu}
      inProp={inProp}
    />
  ))
})
