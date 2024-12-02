import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useApbersNavData } from '../../../../../../../../../../modules/useApbersNavData.js'

export const ApBer = memo(({ projekt, ap }) => {
  const { navData } = useApbersNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'apber',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Berichte', el.id],
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
