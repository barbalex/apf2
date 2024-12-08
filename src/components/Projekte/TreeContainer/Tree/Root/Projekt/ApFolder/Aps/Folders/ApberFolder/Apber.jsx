import { memo, useRef } from 'react'

import { Row } from '../../../../../../Row.jsx'

export const Apber = memo(({ projekt, ap, menu, inProp }) => {
  const node = {
    nodeType: 'table',
    menuType: 'apber',
    id: menu.id,
    parentId: ap.id,
    parentTableId: ap.id,
    urlLabel: menu.id,
    label: menu.label,
    url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Berichte', menu.id],
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
