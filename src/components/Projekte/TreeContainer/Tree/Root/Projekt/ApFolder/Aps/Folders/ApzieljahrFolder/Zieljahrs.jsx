import { memo } from 'react'

import { Zieljahr } from './Zieljahr/index.jsx'
import { useZieljahrsNavData } from '../../../../../../../../../../modules/useZieljahrsNavData.js'

export const Zieljahrs = memo(({ in: inProp, menu }) => {
  const { navData } = useZieljahrsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Zieljahr
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
