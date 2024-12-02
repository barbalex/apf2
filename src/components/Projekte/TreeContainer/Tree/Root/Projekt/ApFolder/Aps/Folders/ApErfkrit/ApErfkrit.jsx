import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useErfkritsNavData } from '../../../../../../../../../../modules/useErfkritsNavData.js'

export const ApErfkrit = memo(({ projekt, ap }) => {
  const { navData } = useErfkritsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'erfkrit',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'AP-Erfolgskriterien',
        el.id,
      ],
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
