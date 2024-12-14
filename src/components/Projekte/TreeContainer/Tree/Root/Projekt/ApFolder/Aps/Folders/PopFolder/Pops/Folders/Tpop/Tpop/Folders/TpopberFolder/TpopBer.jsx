import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopbersNavData.js'

export const TpopBer = memo(({ projekt, ap, pop, tpop }) => {
  const { navData } = useTpopbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopber',
      parentId: `${tpop.id}TpopberFolder`,
      parentTableId: tpop.id,
      id: el.id,
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
