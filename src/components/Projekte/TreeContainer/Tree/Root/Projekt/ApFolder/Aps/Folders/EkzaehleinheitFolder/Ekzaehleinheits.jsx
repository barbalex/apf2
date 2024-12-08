import { memo } from 'react'

import { useEkzaehleinheitsNavData } from '../../../../../../../../../../modules/useEkzaehleinheitsNavData.js'
import { Ekzaehleinheit } from './Ekzaehleinheit.jsx'

export const Ekzaehleinheits = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useEkzaehleinheitsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Ekzaehleinheit
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
