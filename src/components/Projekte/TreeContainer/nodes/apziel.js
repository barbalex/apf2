const apzielNodes = async ({ projId, apId, ziels, store }) => {
  // map through all elements and create array of nodes
  const nodes = ziels.map((el) => ({
    nodeType: 'table',
    menuType: 'ziel',
    filterTable: 'ziel',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', el.jahr, el.id],
    hasChildren: true,
  }))

  return nodes
}

export default apzielNodes
