const popFolderNode = ({ projId, apId, store, count }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.pop ?? ''

  const message = nodeLabelFilterString ? `${count} gefiltert` : count

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
