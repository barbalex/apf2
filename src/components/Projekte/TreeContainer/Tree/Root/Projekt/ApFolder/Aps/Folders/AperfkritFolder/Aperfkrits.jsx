import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useErfkritsNavData } from '../../../../../../../../../../modules/useErfkritsNavData.js'

export const ApErfkrit = memo(({ projekt, ap }) => {
  const { navData } = useErfkritsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => {
    const node = {
      nodeType: 'table',
      menuType: 'erfkrit',
      id: menu.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: menu.id,
      label: menu.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'AP-Erfolgskriterien',
        menu.id,
      ],
      hasChildren: false,
    }

    return (
      <Row
        key={menu.id}
        node={node}
      />
    )
  })
})
