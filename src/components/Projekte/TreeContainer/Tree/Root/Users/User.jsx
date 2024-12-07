import { memo } from 'react'

import { Row } from '../../Row.jsx'

export const User = memo(({ inProp, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'user',
    id: menu.id,
    urlLabel: menu.id,
    label: menu.label,
    url: ['Benutzer', menu.id],
    hasChildren: false,
  }

  return <Row node={node} />
})
