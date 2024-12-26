import { memo } from 'react'

import { useTpopsNavData } from '../../../../../../../../../../../../../../modules/useTpopsNavData.js'
import { Tpop } from './Tpop.jsx'

// TODO: get rid of having to pass projekt, ap, pop
export const Tpops = memo(({ projekt, ap, pop, in: inProp, menu }) => {
  const { navData } = useTpopsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Tpop
      key={menu.id}
      projekt={projekt}
      ap={ap}
      pop={pop}
      menu={menu}
      inProp={inProp}
    />
  ))
})
