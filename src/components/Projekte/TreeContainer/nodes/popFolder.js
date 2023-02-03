import pop from './pop'

const popFolderNode = async ({
  projId,
  apId,
  store,
  count,
  loading,
  treeQueryVariables, 
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.pop ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'Populationen']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'Populationen',
    ).length > 0

  const children = isOpen
    ? await pop({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'popFolder',
    id: `${apId}PopFolder`,
    tableId: apId,
    urlLabel: 'Populationen',
    label: `Populationen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default popFolderNode
