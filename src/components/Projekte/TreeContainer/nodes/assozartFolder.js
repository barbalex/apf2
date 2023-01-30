import assozart from './assozart'

const assozartFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.assozart ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'assoziierte-Arten',
    ).length > 0

  const children = isOpen
    ? await assozart({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'assozartFolder',
    filterTable: 'assozart',
    id: `${apId}AssozartFolder`,
    tableId: apId,
    urlLabel: 'assoziierte-Arten',
    label: `assoziierte Arten (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default assozartFolderNode
