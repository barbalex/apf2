const projektNodes = ({ data }) => {
  const projekts = data?.allProjekts?.nodes ?? []

  // map through all elements and create array of nodes
  const nodes = projekts
    // is already sorted by name
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'projekt',
      filterTable: 'projekt',
      id: el.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', el.id],
      sort: [index],
      hasChildren: true,
    }))

  return nodes
}

export default projektNodes
