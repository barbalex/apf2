import { memo } from 'react'
import lowerFirst from 'lodash/lowerFirst'

import { Row } from '../../../../../../Row.jsx'

export const ChildlessFolder = memo(({ projekt, ap, menu }) => {
  const node = {
    nodeType: 'folder',
    menuType: `${lowerFirst(menu.id)}Folder`,
    id: `${ap.id}${menu.id}Folder`,
    tableId: ap.id,
    urlLabel: menu.id,
    label: menu.label,
    url: ['Projekte', projekt.id, 'Arten', ap.id, 'Idealbiotop', 'Dateien'],
    hasChildren: false,
  }

  return <Row node={node} />
})
