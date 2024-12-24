import { memo } from 'react'

import { useTpopmassnsNavData } from '../../../../../../../../../../../../../../../../modules/useTpopmassnsNavData.js'
import { Tpopmassn } from './Tpopmassn.jsx'

export const Tpopmassns = memo(({ projekt, ap, pop, tpop, in: inProp }) => {
  const { navData } = useTpopmassnsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((menu) => (
    <Tpopmassn
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      tpop={tpop}
      menu={menu}
      inProp={inProp}
    />
  ))
})
