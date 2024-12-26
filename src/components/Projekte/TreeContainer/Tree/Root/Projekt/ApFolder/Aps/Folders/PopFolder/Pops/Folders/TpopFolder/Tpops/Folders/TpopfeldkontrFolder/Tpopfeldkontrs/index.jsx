import { memo } from 'react'

import { useTpopfeldkontrsNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrsNavData.js'
import { Tpopfeldkontr } from './Tpopfeldkontr.jsx'

// TODO: get rid of having to pass projekt, ap, pop, tpop
export const Tpopfeldkontrs = memo(({ projekt, ap, pop, tpop, in: inProp }) => {
  const { navData } = useTpopfeldkontrsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((menu) => (
    <Tpopfeldkontr
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
