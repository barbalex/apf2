import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useEkzaehleinheitsNavData } from '../../../../../../../../../../modules/useEkzaehleinheitsNavData.js'

export const EkZaehleinheits = memo(({ projekt, ap }) => {
  const { navData } = useEkzaehleinheitsNavData({
    projId: projekt.id,
    apId: ap.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'ekzaehleinheit',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Zähleinheiten', el.id],
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
