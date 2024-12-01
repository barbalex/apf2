import { memo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { useBeobNichtBeurteiltsNavData } from '../../../../../../../../../../modules/useBeobNichtbeurteiltsNavData.js'

export const BeobNichtBeurteilts = memo(({ projekt, ap }) => {
  const { navData } = useBeobNichtBeurteiltsNavData({ apId: ap.id })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'beobNichtBeurteilt',
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
        'nicht-beurteilte-Beobachtungen',
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
