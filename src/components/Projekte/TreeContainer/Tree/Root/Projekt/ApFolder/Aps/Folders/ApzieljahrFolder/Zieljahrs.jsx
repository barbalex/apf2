import { memo } from 'react'

import { Zieljahr } from './Zieljahr/index.jsx'
import { useZieljahrsNavData } from '../../../../../../../../../../modules/useZieljahrsNavData.js'

export const Zieljahrs = memo(({ projekt, ap }) => {
  const { navData, isLoading } = useZieljahrsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Zieljahr
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
    />
  ))
})
