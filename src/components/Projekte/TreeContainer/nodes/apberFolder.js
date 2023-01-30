import apber from './apber'

const apberFolderNode = async ({
  loading,
  projId,
  apId,
  store,
  count,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apber ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Berichte']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'AP-Berichte',
    ).length > 0

  const children = isOpen
    ? await apber({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'apberFolder',
    filterTable: 'apber',
    id: `${apId}ApberFolder`,
    tableId: apId,
    urlLabel: 'AP-Berichte',
    label: `AP-Berichte (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default apberFolderNode
