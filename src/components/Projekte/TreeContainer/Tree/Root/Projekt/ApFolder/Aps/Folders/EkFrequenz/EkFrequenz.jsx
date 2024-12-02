import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useEkfrequenzsNavData } from '../../../../../../../../../../modules/useEkfrequenzsNavData.js'

export const EkFrequenz = memo(({ projekt, ap }) => {
  const { navData } = useEkfrequenzsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'ekfrequenz',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Frequenzen', el.id],
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
