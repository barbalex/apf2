import { memo, useRef } from 'react'

import { Row } from '../../../../../../Row.jsx'

export const EkFrequenz = memo(({ projekt, ap, inProp, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'ekfrequenz',
    id: menu.id,
    parentId: ap.id,
    parentTableId: ap.id,
    urlLabel: menu.id,
    label: menu.label,
    url: ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Frequenzen', menu.id],
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
