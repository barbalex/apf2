import { memo } from 'react'

import { useZielsOfJahrNavData } from '../../../../../../../../../../../modules/useZielsOfJahrNavData.js'
import { Ziel } from './Ziel/index.jsx'

export const Ziels = memo(({ in: inProp, menu }) => {
  const { navData } = useZielsOfJahrNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Ziel
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
