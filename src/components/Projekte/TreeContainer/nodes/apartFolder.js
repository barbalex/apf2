import apart from './apart'

const apartFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apart ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 && n[1] === projId && n[3] === apId && n[4] === 'Taxa',
    ).length > 0

  const children = isOpen
    ? await apart({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'apartFolder',
    filterTable: 'apart',
    id: `${apId}Apart`,
    tableId: apId,
    urlLabel: 'Taxa',
    label: `Taxa (${message})`,
    url: ['Projekte', projId, 'Arten', apId, 'Taxa'],
    hasChildren: count > 0,
    children,
  }
}

export default apartFolderNode
