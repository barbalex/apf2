import { memo } from 'react'

import { usePopbersNavData } from '../../../../../../../../../../../../../modules/usePopbersNavData.js'
import { Popber } from './Popber.jsx'

export const Popbers = memo(({ projekt, ap, pop, in: inProp }) => {
  const { navData } = usePopbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
  })

  return navData.menus.map((menu) => (
    <Popber
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      menu={menu}
      inProp={inProp}
    />
  ))
})
