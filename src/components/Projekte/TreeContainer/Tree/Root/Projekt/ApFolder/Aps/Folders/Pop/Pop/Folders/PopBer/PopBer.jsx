import { memo } from 'react'

import { Row } from '../../../../../../../../../Row.jsx'
import { usePopbersNavData } from '../../../../../../../../../../../../../modules/usePopbersNavData.js'

export const PopBer = memo(({ projekt, ap, pop }) => {
  const { navData } = usePopbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'popber',
      id: el.id,
      parentId: pop.id,
      parentTableId: pop.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Kontroll-Berichte',
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
