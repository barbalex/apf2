const qkFolderNode = ({ projId, apId }) => {
  const url = ['Projekte', projId, 'Arten', apId, 'Qualitaetskontrollen']

  return {
    nodeType: 'folder',
    menuType: 'qkFolder',
    id: apId,
    tableId: apId,
    parentTableId: apId,
    urlLabel: 'Qualitaetskontrollen',
    label: 'Qualitätskontrollen',
    url,
    hasChildren: false,
  }
}

export default qkFolderNode
