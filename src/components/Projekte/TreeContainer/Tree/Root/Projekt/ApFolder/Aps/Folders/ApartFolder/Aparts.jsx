import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useApartsNavData } from '../../../../../../../../../../modules/useApartsNavData.js'
import { Apart } from './Apart.jsx'

export const Aparts = memo(({ projekt, ap, in: inProp }) => {
  const { navData } = useApartsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => (
    <Apart
      key={menu.id}
      projekt={projekt}
      ap={ap}
      menu={menu}
      inProp={inProp}
    />
  ))
})
