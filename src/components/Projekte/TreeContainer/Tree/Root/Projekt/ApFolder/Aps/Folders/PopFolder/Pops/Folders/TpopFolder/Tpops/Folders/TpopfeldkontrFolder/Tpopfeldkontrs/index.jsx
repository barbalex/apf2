import { memo } from 'react'

import { useTpopfeldkontrsNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrsNavData.js'
import { Tpopfeldkontr } from './Tpopfeldkontr.jsx'

export const Tpopfeldkontrs = memo(({ in: inProp, menu }) => {
  const { navData } = useTpopfeldkontrsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Tpopfeldkontr key={menu.id} menu={menu} inProp={inProp} />
  ))
})
