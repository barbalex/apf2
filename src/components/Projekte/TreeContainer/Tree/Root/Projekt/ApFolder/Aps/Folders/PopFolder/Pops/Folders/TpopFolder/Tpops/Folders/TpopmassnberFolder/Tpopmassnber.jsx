import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopmassnbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopmassnbersNavData.js'

export const Tpopmassnber = memo(({ projekt, ap, pop, tpop, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopmassnber',
    parentId: tpop.id,
    parentTableId: tpop.id,
    id: menu.id,
    urlLabel: menu.id,
    label: menu.label,
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
      menu.id,
    ],
    hasChildren: false,
  }

  return (
    <Row
      key={menu.id}
      node={node}
    />
  )
})
