import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useAssozartsNavData } from '../../../../../../../../../../modules/useAssozartsNavData.js'

export const AssozArt = memo(({ projekt, ap }) => {
  const { navData } = useAssozartsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'assozart',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'assoziierte-Arten', el.id],
      hasChildren: false,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
})
