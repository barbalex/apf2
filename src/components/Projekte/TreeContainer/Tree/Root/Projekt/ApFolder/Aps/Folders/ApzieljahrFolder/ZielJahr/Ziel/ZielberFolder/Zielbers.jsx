import { memo } from 'react'

import { Row } from '../../../../../../../../../Row.jsx'
import { useZielbersNavData } from '../../../../../../../../../../../../../modules/useZielbersNavData.js'

export const Zielbers = memo(({ projekt, ap, jahr, ziel }) => {
  const { navData } = useZielbersNavData({
    projId: projekt.id,
    apId: ap.id,
    jahr,
    zielId: ziel.id,
  })

  return navData.menus.map((menu) => {
    const node = {
      nodeType: 'table',
      menuType: 'zielber',
      id: menu.id,
      parentId: ziel.id,
      parentTableId: ziel.id,
      urlLabel: menu.id,
      label: menu.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
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
