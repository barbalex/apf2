const popFolderNode = ({ projId, apId, store, count, loading }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.pop ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'Populationen']

  return {
    nodeType: 'folder',
    menuType: 'popFolder',
    filterTable: 'pop',
    id: `${apId}PopFolder`,
    tableId: apId,
    urlLabel: 'Populationen',
    label: `Populationen (${message})`,
    url,
    hasChildren: count > 0,
  }
}

export default popFolderNode
