import tpop from "./tpop"

const tpopFolderNode = async ({ count, loading, projId, apId, popId, store, treeQueryVariables }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpop ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'Populationen' && n[5] === popId && n[6] === 'Teil-Populationen',
    ).length > 0

  const children = isOpen
    ? await pop({ treeQueryVariables, projId, apId, store })
    : []

  return {
      nodeType: 'folder',
      menuType: 'tpopFolder',
      filterTable: 'tpop',
      id: `${popId}TpopFolder`,
      tableId: popId,
      parentTableId: popId,
      urlLabel: 'Teil-Populationen',
      label: `Teil-Populationen (${message})`,
      url,
      hasChildren: count > 0,
    }
}

export default tpopFolderNode
