import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useApartsNavData } from '../../../../../../../../../../modules/useApartsNavData.js'

export const Aparts = memo(({ projekt, ap }) => {
  const { navData } = useApartsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((menu) => {
    const node = {
      nodeType: 'table',
      menuType: 'apart',
      id: menu.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: menu.id,
      label: menu.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'Taxa', menu.id],
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
