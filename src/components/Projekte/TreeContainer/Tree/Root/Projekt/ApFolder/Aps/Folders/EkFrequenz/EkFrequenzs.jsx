import { memo } from 'react'

import { useEkfrequenzsNavData } from '../../../../../../../../../../modules/useEkfrequenzsNavData.js'
import { EkFrequenz } from './EkFrequenz.jsx'

export const EkFrequenzs = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useEkfrequenzsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <EkFrequenz
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
