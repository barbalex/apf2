import { memo } from 'react'

import { useApsNavData } from '../../../../../../../../modules/useApsNavData.js'
import { Ap } from './Ap.jsx'

export const Aps = memo(({ in: inProp, menu }) => {
  const { navData } = useApsNavData(menu.fetcherParams)

  return navData?.menus.map((menu) => (
    <Ap key={menu.id} inProp={inProp} menu={menu} />
  ))
})
