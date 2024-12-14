import { memo } from 'react'

import { usePopsNavData } from '../../../../../../../../../../../modules/usePopsNavData.js'
import { Pop } from './Pop.jsx'

export const Pops = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = usePopsNavData({ projId: projekt.id, apId: ap.id })

  return navData.menus.map((menu) => (
    <Pop
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
