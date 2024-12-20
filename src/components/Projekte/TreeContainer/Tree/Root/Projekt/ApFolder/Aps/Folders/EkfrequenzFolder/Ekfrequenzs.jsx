import { memo } from 'react'

import { useEkfrequenzsNavData } from '../../../../../../../../../../modules/useEkfrequenzsNavData.js'
import { Ekfrequenz } from './Ekfrequenz.jsx'

export const Ekfrequenzs = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useEkfrequenzsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Ekfrequenz
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
