import { memo } from 'react'

import { usePopmassnbersNavData } from '../../../../../../../../../../../../../modules/usePopmassnbersNavData.js'
import { Popmassnber } from './Popmassnber.jsx'

export const Popmassnbers = memo(({ projekt, ap, pop, in: inProp }) => {
  const { navData } = usePopmassnbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
  })

  return navData.menus.map((menu) => (
    <Popmassnber
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      menu={menu}
      inProp={inProp}
    />
  ))
})
