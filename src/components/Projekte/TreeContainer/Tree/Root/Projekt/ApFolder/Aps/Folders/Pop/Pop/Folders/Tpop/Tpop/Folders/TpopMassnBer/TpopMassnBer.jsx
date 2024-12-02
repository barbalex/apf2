import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopmassnbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopmassnbersNavData.js'

export const TpopMassnBer = memo(({ projekt, ap, pop, tpop }) => {
  const { navData } = useTpopmassnbersNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopmassnber',
      parentId: tpop.id,
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
