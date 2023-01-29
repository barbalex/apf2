const aperfkritFolderNode = ({ loading, projId, apId, store, count }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.erfkrit ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien']

  return {
    nodeType: 'folder',
    menuType: 'erfkritFolder',
    filterTable: 'erfkrit',
    id: `${apId}ErfkritFolder`,
    tableId: apId,
    urlLabel: 'AP-Erfolgskriterien',
    label: `AP-Erfolgskriterien (${message})`,
    url,
    hasChildren: count > 0,
  }
}

export default aperfkritFolderNode
