const ekfrequenzFolderNode = ({ count, loading, projId, apId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ekfrequenz ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen']

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
  }
}

export default ekfrequenzFolderNode
