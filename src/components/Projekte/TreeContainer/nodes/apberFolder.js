const apberFolderNode = ({ data, loading, projId, apId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apber ?? ''
  const apbers = (data?.allApbers?.nodes ?? []).filter((n) => n.apId === apId)
  const count = apbers.length

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Berichte']

  return [
    {
      nodeType: 'folder',
      menuType: 'apberFolder',
      filterTable: 'apber',
      id: `${apId}ApberFolder`,
      tableId: apId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url,
      hasChildren: count > 0,
    },
  ]
}

export default apberFolderNode
