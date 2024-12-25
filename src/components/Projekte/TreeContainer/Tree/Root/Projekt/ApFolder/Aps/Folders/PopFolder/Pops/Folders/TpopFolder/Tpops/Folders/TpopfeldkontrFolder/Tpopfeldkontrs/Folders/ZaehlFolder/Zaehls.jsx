import { memo } from 'react'

import { useTpopfeldkontrzaehlsNavData } from '../../../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrzaehlsNavData.js'
import { Node } from '../../../../../../../../../../../../../../../Node.jsx'

export const Zaehls = memo(({ projekt, ap, pop, tpop, tpopkontr }) => {
  const { navData } = useTpopfeldkontrzaehlsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
    tpopkontrId: tpopkontr.id,
  })

  return navData.menus.map((menu) => (
    <Node
      menu={menu}
      key={menu.id}
    />
  ))
})
