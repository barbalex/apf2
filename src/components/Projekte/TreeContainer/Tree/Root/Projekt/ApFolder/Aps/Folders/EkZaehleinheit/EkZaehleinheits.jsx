import { memo } from 'react'

import { useEkzaehleinheitsNavData } from '../../../../../../../../../../modules/useEkzaehleinheitsNavData.js'
import { EkZaehleinheit } from './EkZaehleinheit.jsx'

export const EkZaehleinheits = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useEkzaehleinheitsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <EkZaehleinheit
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
