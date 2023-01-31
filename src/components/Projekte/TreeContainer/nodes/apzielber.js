const apzielberNodes = ({ zielbers, projId, apId, jahr, zielId }) => {
  // map through all elements and create array of nodes
  const nodes = (zielbers ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'zielber',
    filterTable: 'zielber',
    id: el.id,
    parentId: zielId,
    parentTableId: zielId,
    urlLabel: el.id,
    label: el.label,
    url: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'AP-Ziele',
      jahr,
      zielId,
      'Berichte',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default apzielberNodes
