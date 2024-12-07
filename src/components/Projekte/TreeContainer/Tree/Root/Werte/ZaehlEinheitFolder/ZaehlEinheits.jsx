import { memo } from 'react'

import { useTpopkontrzaehlEinheitWertesNavData } from '../../../../../../../modules/useTpopkontrzaehlEinheitWertesNavData.js'
import { ZaehlEinheit } from './ZaehlEinheit.jsx'

export const ZaehlEinheits = memo(({ in: inProp }) => {
  const { navData } = useTpopkontrzaehlEinheitWertesNavData()

  return navData.menus.map((menu) => (
    <ZaehlEinheit
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
