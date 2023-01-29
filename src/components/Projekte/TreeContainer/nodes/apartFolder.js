const apartFolderNode = ({ count, loading, projId, apId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apart ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

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
  }
}

export default apartFolderNode
