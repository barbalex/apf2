import { memo } from 'react'

import { useTpopmassnbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopmassnbersNavData.js'
import { Tpopmassnber } from './Tpopmassnber.jsx'

export const Tpopmassnbers = memo(({ projekt, ap, pop, tpop, in: inProp }) => {
  const { navData } = useTpopmassnbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((menu) => (
    <Tpopmassnber
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
