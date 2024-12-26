import { memo } from 'react'

import { usePopsNavData } from '../../../../../../../../../../../modules/usePopsNavData.js'
import { Pop } from './Pop.jsx'

export const Pops = memo(({ in: inProp, menu }) => {
  const { navData } = usePopsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Pop key={menu.id} menu={menu} inProp={inProp} />
  ))
})
