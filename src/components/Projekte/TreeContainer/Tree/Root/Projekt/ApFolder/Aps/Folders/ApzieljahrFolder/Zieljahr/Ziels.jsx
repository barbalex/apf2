import { memo } from 'react'

import { useZielsOfJahrNavData } from '../../../../../../../../../../../modules/useZielsOfJahrNavData.js'
import { NodeListFolderTransitioned } from '../../../../../../../NodeListFolderTransitioned.jsx'

export const Ziels = memo(({ in: inProp, menu }) => {
  const { navData } = useZielsOfJahrNavData(menu.fetcherParams)

  return navData.menus.map((menu) => (
    <NodeListFolderTransitioned
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
