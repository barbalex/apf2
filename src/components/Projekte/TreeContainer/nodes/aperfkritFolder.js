import aperfkrit from './aperfkrit'

const aperfkritFolderNode = async ({
  loading,
  projId,
  apId,
  store,
  count,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.erfkrit ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'AP-Erfolgskriterien',
    ).length > 0

  const children = isOpen
    ? await aperfkrit({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'erfkritFolder',
    id: `${apId}ErfkritFolder`,
    tableId: apId,
    urlLabel: 'AP-Erfolgskriterien',
    label: `AP-Erfolgskriterien (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default aperfkritFolderNode
