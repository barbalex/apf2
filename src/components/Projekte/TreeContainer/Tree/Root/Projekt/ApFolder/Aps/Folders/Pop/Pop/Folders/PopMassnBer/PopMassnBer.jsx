import { memo } from 'react'

import { Row } from '../../../../../../../../../Row.jsx'
import { usePopmassnbersNavData } from '../../../../../../../../../../../../../modules/usePopmassnbersNavData.js'

export const PopMassnBer = memo(({ projekt, ap, pop }) => {
  const { navData } = usePopmassnbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'popmassnber',
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
        'Massnahmen-Berichte',
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
