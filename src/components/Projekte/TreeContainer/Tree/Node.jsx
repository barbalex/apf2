import { memo } from 'react'
import { Row } from './Row.jsx'

export const Node = memo(({ menu }) => {
  const node = {
    nodeType: menu.treeNodeType,
    menuType: menu.treeMenuType,
    id: menu.treeId,
    tableId: menu.treeTableId,
    parentId: menu.treeParentId,
    parentTableId: menu.treeParentTableId,
    urlLabel: menu.id,
    label: menu.label,
    url: menu.treeUrl,
    hasChildren: menu.hasChildren,
    alwaysOpen: menu.alwaysOpen,
  }

  return <Row node={node} />
})
