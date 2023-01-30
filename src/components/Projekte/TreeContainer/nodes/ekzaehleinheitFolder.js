import ekzaehleinheit from './ekzaehleinheit'

const ekzaehleinheitFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.ekzaehleinheit ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'EK-Zähleinheiten',
    ).length > 0

  const children = isOpen
    ? await ekzaehleinheit({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'ekzaehleinheitFolder',
    filterTable: 'ekzaehleinheit',
    id: `${apId}Ekzaehleinheit`,
    tableId: apId,
    urlLabel: 'EK-Zähleinheiten',
    label: `EK-Zähleinheiten (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default ekzaehleinheitFolderNode
