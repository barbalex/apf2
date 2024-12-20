import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../../../../Row.jsx'

export const Zaehl = memo(({ projekt, ap, pop, tpop, tpopkontr, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopfeldkontrzaehl',
    id: menu.id,
    parentId: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
    parentTableId: tpopkontr.id,
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
      'Feld-Kontrollen',
      tpopkontr.id,
      'Zaehlungen',
      menu.id,
    ],
    hasChildren: false,
  }

  return <Row node={node} />
})
