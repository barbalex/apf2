import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useBeobNichtZuzuordnensNavData } from '../../../../../../../../../../modules/useBeobNichtZuzuordnensNavData.js'

export const BeobNichtZuzuordnens = memo(({ projekt, ap }) => {
  const { navData } = useBeobNichtZuzuordnensNavData({ apId: ap.id })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'beobNichtZuzuordnen',
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
        'nicht-zuzuordnende-Beobachtungen',
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
