import { memo, useRef } from 'react'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopbersNavData.js'

export const Tpopber = memo(({ projekt, ap, pop, tpop, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopber',
    parentId: `${tpop.id}TpopberFolder`,
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
      'Kontroll-Berichte',
      menu.id,
    ],
    hasChildren: false,
  }

  const ref = useRef(null)

  return (
    <Row
      node={node}
      ref={ref}
    />
  )
})
