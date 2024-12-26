import { memo } from 'react'

import { Zieljahr } from './Zieljahr/index.jsx'
import { useZieljahrsNavData } from '../../../../../../../../../../modules/useZieljahrsNavData.js'

// TODO: get rid of having to pass projekt, ap
export const Zieljahrs = memo(({ projekt, ap, in: inProp, menu }) => {
  const { navData } = useZieljahrsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Zieljahr
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
