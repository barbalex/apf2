import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'

export const Tpopmassn = memo(({ projekt, ap, pop, tpop, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopmassn',
    id: menu.id,
    parentId: tpop.id,
    parentTableId: tpop.id,
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
      'Massnahmen',
      menu.id,
    ],
    hasChildren: true,
  }

  return (
    <Row
      key={menu.id}
      node={node}
    />
  )
})
