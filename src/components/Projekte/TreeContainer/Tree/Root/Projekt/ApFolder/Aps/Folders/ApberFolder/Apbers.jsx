import { memo } from 'react'

import { useApbersNavData } from '../../../../../../../../../../modules/useApbersNavData.js'
import { Apber } from './Apber.jsx'

export const Apbers = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useApbersNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Apber
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
