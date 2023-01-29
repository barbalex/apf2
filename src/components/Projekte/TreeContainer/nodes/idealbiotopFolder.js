const idealbiotopFolderNode = ({ projId, apId }) => {
  const url = ['Projekte', projId, 'Arten', apId, 'Idealbiotop']

  return {
    nodeType: 'folder',
    menuType: 'idealbiotopFolder',
    id: `${apId}IdealbiotopFolder`,
    tableId: apId,
    urlLabel: 'Idealbiotop',
    label: 'Idealbiotop',
    url,
    hasChildren: false,
  }
}

export default idealbiotopFolderNode
