import { memo } from 'react'

import { useTpopfeldkontrzaehlsNavData } from '../../../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrzaehlsNavData.js'
import { Zaehl } from './Zaehl.jsx'

export const Zaehls = memo(({ projekt, ap, pop, tpop, tpopkontr }) => {
  const { navData } = useTpopfeldkontrzaehlsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
    tpopkontrId: tpopkontr.id,
  })

  return navData.menus.map((menu) => (
    <Zaehl
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      tpop={tpop}
      tpopkontr={tpopkontr}
      menu={menu}
    />
  ))
})
