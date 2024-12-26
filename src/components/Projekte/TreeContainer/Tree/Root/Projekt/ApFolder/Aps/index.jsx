import { memo } from 'react'

import { useApsNavData } from '../../../../../../../../modules/useApsNavData.js'
import { Ap } from './Ap.jsx'

export const Aps = memo(({ projekt, in: inProp, menu }) => {
  const { navData } = useApsNavData(menu.fetcherParams)

  return navData?.menus.map((menu) => (
    <Ap
      key={menu.id}
      projekt={projekt}
      ap={menu}
      inProp={inProp}
      menu={menu}
    />
  ))
})
