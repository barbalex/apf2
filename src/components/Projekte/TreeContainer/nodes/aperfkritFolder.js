const aperfkritFolderNode = ({ data, loading, projId, apId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.erfkrit ?? ''

  const erfkritNodesLength = (data?.allErfkrits?.nodes ?? []).filter(
    (el) => el.apId === apId,
  ).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${erfkritNodesLength} gefiltert`
    : erfkritNodesLength

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien']

  return [
    {
      nodeType: 'folder',
      menuType: 'erfkritFolder',
      filterTable: 'erfkrit',
      id: `${apId}Erfkrit`,
      tableId: apId,
      urlLabel: 'AP-Erfolgskriterien',
      label: `AP-Erfolgskriterien (${message})`,
      url,
      hasChildren: erfkritNodesLength > 0,
    },
  ]
}

export default aperfkritFolderNode
