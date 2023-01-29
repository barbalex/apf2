const ekzaehleinheitFolderNode = ({ count, loading, projId, apId, store }) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.ekzaehleinheit ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten']

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
  }
}

export default ekzaehleinheitFolderNode
