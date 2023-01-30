import ekfrequenz from './ekfrequenz'

const ekfrequenzFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ekfrequenz ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'EK-Frequenzen',
    ).length > 0

  const children = isOpen
    ? await ekfrequenz({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'ekfrequenzFolder',
    filterTable: 'ekfrequenz',
    id: `${apId}Ekfrequenz`,
    tableId: apId,
    urlLabel: 'EK-Frequenzen',
    label: `EK-Frequenzen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default ekfrequenzFolderNode
