import { memo } from 'react'
import { Row } from './Row.jsx'

export const ChildlessFolder = memo(({ menu }) => {
  const node = {
    nodeType: menu.treeNodeType,
    menuType: menu.treeMenuType,
    id: menu.treeId,
    tableId: menu.treeTableId,
    urlLabel: menu.id,
    label: menu.label,
    url: menu.treeUrl,
    hasChildren: menu.hasChildren,
  }

  return <Row node={node} />
})
