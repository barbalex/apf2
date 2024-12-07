import { memo } from 'react'

import { useEkAbrechnungstypWertesNavData } from '../../../../../../../modules/useEkAbrechnungstypWertesNavData.js'
import { EkAbrechnungstyp } from './EkAbrechnungstyp.jsx'

export const EkAbrechnungstyps = memo(({ in: inProp }) => {
  const { navData } = useEkAbrechnungstypWertesNavData()

  return navData.menus.map((menu) => (
    <EkAbrechnungstyp
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
