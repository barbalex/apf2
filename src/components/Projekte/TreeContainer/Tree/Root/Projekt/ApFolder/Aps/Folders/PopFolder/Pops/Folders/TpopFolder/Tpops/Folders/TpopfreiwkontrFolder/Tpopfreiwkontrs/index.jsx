import { memo } from 'react'

import { useTpopfreiwkontrsNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfreiwkontrsNavData.js'
import { Tpopfreiwkontr } from './Tpopfreiwkontr.jsx'

export const Tpopfreiwkontrs = memo(({ in: inProp, menu }) => {
  const { navData } = useTpopfreiwkontrsNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <Tpopfreiwkontr key={menu.id} menu={menu} inProp={inProp} />
  ))
})
