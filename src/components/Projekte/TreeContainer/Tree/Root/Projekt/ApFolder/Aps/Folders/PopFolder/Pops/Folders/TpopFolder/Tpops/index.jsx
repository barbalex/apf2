import { memo } from 'react'

import { useTpopsNavData } from '../../../../../../../../../../../../../../modules/useTpopsNavData.js'
import { Tpop } from './Tpop.jsx'

export const Tpops = memo(({ in: inProp, menu }) => {
  const { navData } = useTpopsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Tpop key={menu.id} menu={menu} inProp={inProp} />
  ))
})
