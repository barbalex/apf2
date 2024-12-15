import { memo } from 'react'

import { useBeobZugeordnetsNavData } from '../../../../../../../../../../../../../../../../modules/useBeobZugeordnetsNavData.js'
import { Beobzugeordnet } from './Beobzugeordnet.jsx'

export const Beobzugeordnets = memo(
  ({ projekt, ap, pop, tpop, in: inProp }) => {
    const { navData } = useBeobZugeordnetsNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
    })

    return navData.menus.map((menu) => (
      <Beobzugeordnet
        key={menu.id}
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        menu={menu}
        inProp={inProp}
      />
    ))
  },
)
