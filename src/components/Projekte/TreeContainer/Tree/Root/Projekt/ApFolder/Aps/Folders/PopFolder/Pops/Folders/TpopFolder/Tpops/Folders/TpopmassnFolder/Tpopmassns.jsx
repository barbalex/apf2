import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopmassnsNavData } from '../../../../../../../../../../../../../../../../modules/useTpopmassnsNavData.js'

export const Tpopmassns = memo(({ projekt, ap, pop, tpop }) => {
  const { navData } = useTpopmassnsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopmassn',
      id: el.id,
      parentId: tpop.id,
      parentTableId: tpop.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        tpop.id,
        'Massnahmen',
        el.id,
      ],
      hasChildren: true,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
})
