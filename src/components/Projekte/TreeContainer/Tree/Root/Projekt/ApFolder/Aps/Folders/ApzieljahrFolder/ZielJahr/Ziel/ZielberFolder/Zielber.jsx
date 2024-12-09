import { memo, useRef } from 'react'

import { Row } from '../../../../../../../../../Row.jsx'

export const Zielber = memo(({ projekt, ap, jahr, ziel, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'zielber',
    id: menu.id,
    parentId: ziel.id,
    parentTableId: ziel.id,
    urlLabel: menu.id,
    label: menu.label,
    url: [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'AP-Ziele',
      jahr,
      ziel.id,
      'Berichte',
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
