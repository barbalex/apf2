import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopbersNavData.js'
import { Tpopber } from './Tpopber.jsx'

export const Tpopbers = memo(({ projekt, ap, pop, tpop }) => {
  const { navData } = useTpopbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((menu) => (
    <Tpopber
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      tpop={tpop}
      menu={menu}
    />
  ))
})
